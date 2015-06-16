/**
 * @fileoverview Provides the main application controller.
 *
 * It is responsible for initializing the UI and managing the sessions
 * (for example retruning from paypal etc).
 *
 * It is also responsible for pre-loading and tweaking the timing of
 * loading elements. This role however should be delegated to service worker.
 */

goog.provide('longa.App');

goog.require('goog.Promise');
goog.require('goog.Uri');
goog.require('goog.log');
goog.require('goog.ui.Component.EventType');
goog.require('longa.control.Alerts');
goog.require('longa.control.Auth');
goog.require('longa.control.Toaster');
goog.require('longa.data');
goog.require('longa.ds.Screen');
goog.require('longa.ds.Topic');
goog.require('longa.ds.utils');
goog.require('longa.preload');
goog.require('longa.profile');
goog.require('longa.rpc');
goog.require('longa.sellers');
goog.require('longa.service');
goog.require('longa.storage');
goog.require('longa.strings');
goog.require('longa.ui.App');
goog.require('longa.ui.StartScreen');
goog.require('pstj.control.Control');


/** @extends {pstj.control.Control} */
longa.App = goog.defineClass(pstj.control.Control, {
  constructor: function() {
    pstj.control.Control.call(this);
    /**
     * @final
     * @private
     * @type {goog.debug.Logger}
     */
    this.logger_ = goog.log.getLogger('longa.App');
    /**
     * @type {longa.ui.App}
     * @protected
     */
    this.activities = new longa.ui.App();
    /**
     * The start screen we need to show on each launch.
     * @type {!longa.ui.StartScreen}
     * @protected
     */
    this.startScreen = new longa.ui.StartScreen();
    /**
     * If a key was used to log in the user (as opposite to regulr login).
     * @type {boolean}
     * @private
     */
    this.loggedWithKey_ = false;
    /**
     * @private
     * @type {boolean}
     */
    this.hadKey_ = false;
    /**
     * @private
     * @type {!number}
     */
    this.loginListenerKey_ = -1;
    this.init();
  },

  /** @override */
  init: function() {
    goog.base(this, 'init');

    // Initializes the transport layer / rpc.
    longa.rpc.configure({
      // The run variable name as in /cgi-bin/stock.cgi?{run}=...
      run: 'run',
      // The path of the cgi exe as in {/cgi-bin/stock.cgi}?...
      execPath: '/cgi-bin/stock.cgi',
      // If the exec path contains a domain different from the
      // domain we are currently running under.
      crossdomain: false
    });

    // Load custom style for app by returning a promise of the
    // installation (with a timeout of 16 ms so we are sure the
    // browser had the time to parse those styles).
    longa.preload.installStyles();
    // Start preloading google apis ASAP as it might take over 2 seconds.
    longa.preload.installVizualizationApis().thenCatch(function(e) {
      // Notify user that we cound not use the vizualization.
      longa.control.Toaster.getInstance().addToast(
          longa.strings.CannotLoadGoogleAPIs(null).toString(), null, null);
    });

    var details = this.initLoginState_();
    // If we have some credentails we have to attempt login.
    if (!goog.isNull(details)) {
      this.loginListenerKey_ = this.listen(
          longa.ds.Topic.USER_AUTH_CHANGED,
          this.loginListener_);
      longa.control.Auth.getInstance().login(details, false);
      // Now that we are waiting for the login response use the time to
      // render the screen as we are exepcted to always land there after this
      // action.
      this.activities.render(document.body);
    } else {
      // We need both the images and the styles.
      goog.Promise.all([
        longa.preload.installStyles(),
        longa.preload.preloadStartScreenImages()
      ]).then(this.showStartScreen_, null, this);
    }

    // Subsribe to login/logout - if a user logged in retrieve the details.
    this.listen(longa.ds.Topic.USER_AUTH_CHANGED, function() {
      if (longa.ds.utils.isKnownUser()) {
        // User just logged in.
        this.updateAll();
        this.push(longa.ds.Topic.SHOW_SCREEN, longa.ds.Screen.BALANCE);
      } else {
        this.push(longa.ds.Topic.SHOW_SCREEN, longa.ds.Screen.LOGIN);
      }
    });

    // Subscribe for handling error from other controls.
    this.listen(longa.ds.Topic.CONTROL_ERROR, function(error) {
      goog.asserts.assertInstanceof(error, Error);
      this.handleError(error);
    });
  },

  /**
   * This handler is called only once when we attempt to load the user
   * credentials while loading the application. It is handling the
   * USER_AUTH_CHANGE event.
   *
   * @private
   */
  loginListener_: function() {
    // Remove the listener as it is always a one time listener!
    this.cancel(this.loginListenerKey_);
    // If we successully logged in
    if (longa.ds.utils.isKnownUser()) {
      longa.preload.preloadFaqImages();
      this.removeLoader_();
      this.push(longa.ds.Topic.SHOW_SCREEN, longa.ds.Screen.BALANCE);
      this.handleInitialLoginFromPaypal_();
    } else { // We attempted login but it failed.
      // Wait for the installation of styles and the preloading of
      // FAQ images and then show the login activity.
      goog.Promise.all([
        longa.preload.installStyles(),
        longa.preload.preloadFaqImages()
      ]).then(function(_) {
        this.removeLoader_();
        this.push(longa.ds.Topic.SHOW_SCREEN, longa.ds.Screen.LOGIN);
        this.handleInitialLoginFromPaypalFailure_();
        longa.sellers.get();
      }, null, this);
    }
  },

  /**
   * Assuming no login details could be used to login, we show the start screen
   * and preload the rest of the app in the background.
   *
   * @private
   */
  showStartScreen_: function() {
    this.removeLoader_();
    this.startScreen.render(document.body);
    this.getHandler()
        .listenOnce(this.startScreen, goog.ui.Component.EventType.ACTION,
            this.startScreenActionHandler_);
    // While the user is orienting use the low activity frame to render the main
    // app and preload the faq images.
    this.activities.render(document.body);
    longa.preload.preloadFaqImages();
  },

  /**
   * Method to handle user login from paypal (with a previously stored key).
   *
   * @private
   */
  handleInitialLoginFromPaypal_: function() {
    // If coming from paypal
    if (this.hadKey_) {
      // And we managed to log in with that credentials (i.e. we are the same
      // user)
      if (this.loggedWithKey_) {
        var uri = new goog.Uri(window.location.href);
        var action = uri.getParameterValue('a');
        var amount = uri.getParameterValue('amount');
        if (action == 'ok') {
          longa.control.Toaster.getInstance().addToast(
              longa.strings.fromPayPalOK({
                amount: amount || '0'
              }).toString(), null, null);
        } else {
          longa.control.Toaster.getInstance().addToast(
              longa.strings.fromPayPalCancel(null).toString(),
              null, null);
        }
      } else {
        // We had a key but we could not login with it...
        longa.control.Toaster.getInstance().addToast(
            longa.strings.hadKeyButUsedStored(null).toString(),
            null, null);
      }
    }
  },

  /**
   * Handles an usuccessful attempt to login with a key (from paypal).
   *
   * @private
   */
  handleInitialLoginFromPaypalFailure_: function() {
    if (!this.hadKey_) {
      longa.control.Toaster.getInstance().addToast(
          longa.strings.CannotLoginWithSavedCredentials(null).toString(),
          null, null);
    } else {
      longa.control.Toaster.getInstance().addToast(
          longa.strings.fromPayPalUnknown(null).toString(),
          null, null);
    }
  },

  /**
   * Figure out the user status, if we are coming from redirection (paypal)
   * and if we have stored credentials. From the resolve of this query
   * depends what we will load and show to the user.
   *
   * @private
   * @return {?longa.gen.dto.LoginDetails}
   */
  initLoginState_: function() {
    // Figure out how did we ended up here (paypal etc).
    var detail = null;
    var uri = new goog.Uri(window.location.href);
    var key = uri.getParameterValue('key');
    if (goog.isString(key)) {
      this.hadKey_ = true;
      detail = longa.storage.unstashCredentials(key);
      if (goog.isNull(detail)) {
        detail = longa.storage.retrieveCredentials();
      } else {
        this.loggedWithKey_ = true;
      }
    } else {
      detail = longa.storage.retrieveCredentials();
    }

    return detail;
  },

  /**
   * Removes the loader screen.
   * @private
   */
  removeLoader_: function() {
    document.body.removeChild(document.body.querySelector('#loader'));
    document.head.removeChild(document.head.querySelector('#loadercss'));
  },


  /**
   * Handles the user interaction with the start screen. Basically removes the
   * start screen and shows the corresponding activity.
   *
   * @private
   * @param {goog.events.Event} e
   */
  startScreenActionHandler_: function(e) {
    var idx = this.startScreen.indexOfChild(
        /** @type {goog.ui.Component} */(e.target));
    // At this point we are sure that we have the styles so we can just
    // show the activities screen.
    goog.dispose(this.startScreen);
    if (idx == 1) this.push(longa.ds.Topic.SHOW_SCREEN,
        longa.ds.Screen.FAQ);
    else if (idx == 3) this.push(longa.ds.Topic.SHOW_SCREEN,
        longa.ds.Screen.REGISTER);
    else if (idx == 4) this.push(longa.ds.Topic.SHOW_SCREEN,
        longa.ds.Screen.LOGIN);
    // At this point if the faq is not shown (idx != 1) then we
    // need to preload them. We have nothing to wait for, so we just
    // invoke it to start the image loader.
    longa.preload.preloadFaqImages();
    // Load the sellers as they are always available regardless of state.
    longa.sellers.get();
  },

  /**
   * Starts preloading of the images for the start screen.
   *
   * @private
   * @return {goog.Promise<boolean>} The promise that will resolve once the
   *     images have been loaded.
   */
  preloadStartScreenImages_: function() {
    return longa.preload.preloadStartScreenImages();
  },

  /**
   * Preload the images or wait for up to 15 seconds - whichever comes first.
   * @private
   * @return {goog.Promise<boolean>} True if the images were preloaded, false
   * if the timeout passed out.
   */
  preloadFaqImages_: function() {
    return longa.preload.preloadFaqImages();
  },

  /**
   * Force update all data.
   */
  updateAll: function() {

    var promises = [
      this.retrieveBalance(),
      longa.profile.get(),
      longa.control.Alerts.getInstance().get(),
      longa.sellers.get()
    ];

    if (longa.ds.utils.isSeller()) {
      promises.push(longa.service.get());
    }

    goog.Promise.all(promises).then(function(data) {
      goog.log.info(this.logger_, 'Update all finished');
      this.push(longa.ds.Topic.USER_BALANCE_CHANGE);
    }, null, this);
  },

  /**
   * Attempts to retrieve the balance of the currently logged in user.
   */
  retrieveBalance: function() {
    return longa.rpc.getBalance().then(
        this.onBalanceReceived, this.onBalanaceFailed, this);
  },

  /**
   * Handles the successful retrieval of the user's balance.
   * @param {!longa.gen.dto.UserBalance} balance
   * @protected
   */
  onBalanceReceived: function(balance) {
    goog.log.info(this.logger_, 'Balance received: ' +
        goog.debug.expose(balance));
    longa.data.balance = balance;
    return balance;
  },

  /**
   * Handles the error from retrieving the current user's balance.
   * @protected
   * @param {*} e The error produced from the retrieval.
   */
  onBalanaceFailed: function(e) {
    this.handleError(e);
  },

  /**
   * Handles an error.
   *
   * This initial implementation only logs the error.
   *
   * A more robust implementation should use pstj.error.Throw instead in
   * order to allow the aplpication logic to handle different types of errors.
   */
  handleError: function(e) {
    goog.log.error(this.logger_, 'Error perfoming login: ' +
        (goog.isObject(e) ? e.message : ''));
  }
});
