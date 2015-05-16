goog.provide('longa.App');

goog.require('goog.Promise');
goog.require('goog.async.Delay');
goog.require('goog.dom');
goog.require('goog.json');
goog.require('goog.labs.net.xhr');
goog.require('goog.log');
goog.require('goog.net.ImageLoader');
goog.require('goog.style');
goog.require('goog.ui.Component.EventType');
goog.require('longa.control.Alerts');
goog.require('longa.control.Auth');
goog.require('longa.control.Toaster');
goog.require('longa.data');
goog.require('longa.ds.Screen');
goog.require('longa.ds.Topic');
goog.require('longa.ds.utils');
goog.require('longa.gen.dto.Alerts');
goog.require('longa.rpc');
goog.require('longa.storage');
goog.require('longa.template');
goog.require('longa.ui.Main');
goog.require('longa.ui.StartScreen');
goog.require('pstj.control.Control');
goog.require('pstj.ds.dto.SwipetileList');
goog.require('pstj.widget.Swiper');


goog.scope(function() {
var rpc = longa.rpc;
var T = longa.ds.Topic;


/** @extends {pstj.control.Control} */
longa.App = goog.defineClass(pstj.control.Control, {
  constructor: function() {
    pstj.control.Control.call(this);
    /**
     * @type {goog.debug.Logger}
     * @private
     * @final
     */
    this.logger_ = goog.log.getLogger('longa.App');
    /**
     * The main view (app)
     * @type {longa.ui.Main}
     * @private
     */
    this.mainApp_ = null;
    /**
     * The start screen we need to show on each launch.
     * @type {longa.ui.StartScreen}
     * @private
     */
    this.startScreen_ = null;
    /**
     * A promise that will resolve only when the styles get successfully
     * installed on the page.
     * @type {goog.Promise<boolean>}
     * @private
     */
    this.installStylesPromise_ = null;
    this.init();
  },

  /** @override */
  init: function() {
    goog.base(this, 'init');
    goog.log.fine(this.logger_, 'Initializing the Longa contrtoller');
    rpc.configure({
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
    var source = '';
    if (COMPILED) {
      if (goog.isString(goog.global['APP_STYLES_DEBUG'])) {
        source = goog.asserts.assertString(goog.global['APP_STYLES_DEBUG']);
      } else {
        source = goog.asserts.assertString(goog.global['APP_STYLES_COMPILED']);
      }
    } else {
      source = goog.asserts.assertString(goog.global['APP_STYLES']);
    }
    this.installStylesPromise_ = goog.labs.net.xhr.get(source)
        .then(function(response) {
          return new goog.Promise(function(resolve, reject) {
            goog.style.installStyles(response);
            setTimeout(function() {
              resolve(true);
            });
          });
        });


    var detail = longa.storage.retrieveCredentials();
    // If we have stired credentials attempt to load data and then render the
    // app.
    // If not - preload the start screen images and render the start screen.
    if (!goog.isNull(detail)) {
      // Show some sort of loading indicator.
      var loginlistenerkey = this.listen(longa.ds.Topic.USER_AUTH_CHANGED,
          function() {
            this.cancel(loginlistenerkey);
            if (longa.ds.utils.isKnownUser()) {
              this.removeLoader_();
              // Start loading data from server and only the show main screen.
              this.mainApp_ = new longa.ui.Main();
              this.mainApp_.render(document.body);
              longa.control.Toaster.getInstance();
              this.push(longa.ds.Topic.SHOW_SCREEN, longa.ds.Screen.ALERTS);
              // this.updateAll();
            } else {
              // Login attempted but failed
              // Make sure the styles for the app has been loaded
              // and then show login with fail.
              this.installStylesPromise_.then(function(_) {
                this.removeLoader_();
                this.mainApp_ = new longa.ui.Main();
                this.mainApp_.render(document.body);
                // Show screen with failed info.
                // TODO: add fail notice - the login form is too deep so
                // instead we should use the 'toast'.
                this.push(T.SHOW_SCREEN, longa.ds.Screen.LOGIN);
              });
            }
          });
      longa.control.Auth.getInstance().login(detail, false);
    } else {
      goog.Promise.all(
          [this.installStylesPromise_, this.preloadStartScreenImages_()])
          .then(function() {
            // we are sure the images has loaded and the
            // styles has been applied.
            //
            // remove the loader and render the start screen.
            this.startScreen_ = new longa.ui.StartScreen();
            this.removeLoader_();
            this.startScreen_.render(document.body);
            this.getHandler().listenOnce(this.startScreen_,
                goog.ui.Component.EventType.ACTION,
                function(e) {
                  var idx = this.startScreen_.indexOfChild(e.target);
                  // after it is handled / showed with animation...
                  setTimeout(goog.bind(function() {
                    if (goog.isNull(this.mainApp_)) {
                      this.mainApp_ = new longa.ui.Main();
                    }
                    this.startScreen_.dispose();
                    this.mainApp_.render(document.body);
                    if (idx == 1) {
                      // skip
                      this.push(T.SHOW_SCREEN, longa.ds.Screen.FAQ);
                    } else if (idx == 3) {
                      // sign up
                      this.push(T.SHOW_SCREEN, longa.ds.Screen.REGISTER);
                    } else if (idx == 4) {
                      // log in
                      this.push(T.SHOW_SCREEN, longa.ds.Screen.LOGIN);
                    }
                  }, this), 200);
                });
          }, null, this);
    }

    // Subsribe to login/logout - if a user logged in retrieve the details.
    this.listen(longa.ds.Topic.USER_AUTH_CHANGED, function() {
      if (longa.ds.utils.isKnownUser()) {
        // User just logged in.
        this.updateAll();
      }
    });

    // Subscribe for handling error from other controls.
    this.listen(longa.ds.Topic.CONTROL_ERROR, function(error) {
      goog.asserts.assertInstanceof(error, Error);
      this.handleError(error);
    });
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
   * Starts preloading of the images for the start screen.
   *
   * @private
   * @return {goog.Promise<boolean>} The promise that will resolve once the
   *     images have been loaded.
   */
  preloadStartScreenImages_: function() {
    var il = new goog.net.ImageLoader();
    goog.array.forEach(longa.data.preloadImages, function(uri, i) {
      il.addImage(i.toString(), uri);
    });
    return new goog.Promise(function(resolve, reject) {
      this.getHandler().listen(il, goog.net.EventType.COMPLETE, function(_) {
        resolve(true);
      });
      il.start();
    }, this);
  },


  /**
   * Force update all data.
   */
  updateAll: function() {
    goog.Promise.all([
      this.retrieveBalance(),
      longa.control.Alerts.getInstance().get()
    ]).then(function(data) {
      goog.log.info(this.logger_, 'Update all finished');
      this.push(longa.ds.Topic.USER_BALANCE_CHANGE);
    }, null, this);
  },

  /**
   * Attempts to retrieve the balance of the currently logged in user.
   */
  retrieveBalance: function() {
    goog.log.info(this.logger_, 'Attempting balance retrieval');
    return rpc.getBalance().then(
        this.onBalanceReceived, this.onBalanaceFailed, this);
  },

  /**
   * Attempt to load the profile initially.
   */
  retrieveProfile: function() {
    return rpc.getProfile()
        .then(this.onProfileUpdate, this.onProfileFailure, this);
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
   * Handles the receiving of a profile update / get request.
   * @param {!longa.gen.dto.Profile} profile
   * @protected
   */
  onProfileUpdate: function(profile) {
    goog.log.info(this.logger_, 'Retrieved the profile: ' +
        goog.debug.expose(profile));
  },

  /**
   * Handles the error from loading the profile.
   * @protected
   * @param {*} e The error that occured from loading the profile.
   */
  onProfileFailure: function(e) {
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
});  // goog.scope
