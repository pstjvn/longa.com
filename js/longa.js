goog.provide('longa.App');

goog.require('goog.dom');
goog.require('goog.json');
goog.require('goog.log');
goog.require('goog.ui.Component.EventType');
goog.require('longa.control.Auth');
goog.require('longa.ds.Topic');
goog.require('longa.gen.dto.LoginDetails');
goog.require('longa.rpc');
goog.require('longa.storage');
goog.require('longa.template');
goog.require('longa.ui.Main');
goog.require('longa.ui.StartScreen');
goog.require('pstj.control.Control');
goog.require('pstj.ds.dto.SwipetileList');
goog.require('pstj.widget.Swiper');


goog.scope(function() {
var rpc = longa.rpc.instance;
var LoginDetails = longa.gen.dto.LoginDetails;
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
    this.mainApp_ = new longa.ui.Main();
    /**
     * The start screen we need to show on each launch.
     * @type {longa.ui.StartScreen}
     * @private
     */
    this.startScreen_ = new longa.ui.StartScreen();
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

    // If we have credentials peform the login right away.
    var detail = longa.storage.retrieveCredentials();
    if (!goog.isNull(detail)) {
      // Show some sort of loading indicator.
      longa.control.Auth.getInstance().login(detail, false);
      this.mainApp_.render(document.body);
      this.push(T.SHOW_SCREEN, longa.ds.Screen.FAQ);
    } else {
      // Initially - show start screen
      this.startScreen_.render(document.body);
      // Init listeners, this one will be called only once anyway so we
      // inline it here - it will hide the start screen and we cannot go
      // back to it until reload.
      this.getHandler().listenOnce(this.startScreen_,
          goog.ui.Component.EventType.ACTION,
          function(e) {
            var idx = this.startScreen_.indexOfChild(e.target);
            // after it is handled / showed with animation...
            setTimeout(goog.bind(function() {
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
    }
  },

  /**
   * Attempts to perform authorization with the backend.
   */
  performAuth: function() {

    goog.log.info(this.logger_, 'attempt login with rpc');

    var credentaisl = new LoginDetails();
    credentaisl.username = 'aaa';
    credentaisl.password = '123456';
    credentaisl.run = 'log';
    rpc.login(credentaisl).then(this.onLogin, this.onLoginFail, this);
  },

  /**
   * Attempts to retrieve the balance of the currently logged in user.
   */
  retrieveBalance: function() {
    goog.log.info(this.logger_, 'Attempting balance retrieval');
    rpc.getBalance().then(this.onBalanceReceived, this.onBalanaceFailed, this);
  },

  /**
   * Attempts to retvrieve the alerts for the currently logged in account.
   * @param {number=} opt_beginAfter If provided it is considered an alert id
   *    and only alerts with larger ID than this one will be returned.
   */
  retrieveAlerts: function(opt_beginAfter) {
    goog.log.info(this.logger_, 'Attempting alerts retrieval');
    rpc.getAlerts((goog.isNumber(opt_beginAfter) ? opt_beginAfter : 0))
        .then(this.onAlertLoaded, this.onAlertsFailed, this);
  },

  /**
   * Attempt to load the profile initially.
   */
  retrieveProfile: function() {
    rpc.getProfile().then(this.onProfileUpdate, this.onProfileFailure, this);
  },

  /**
   * Handles successfull login completion.
   * @protected
   * @param {longa.gen.dto.User} user
   */
  onLogin: function(user) {
    goog.log.info(this.logger_, 'New user received: ' +
        goog.debug.expose(/** @type {Object<string, *>} */(
            user.toJSON())));
    this.retrieveBalance();
    this.retrieveAlerts();
    this.retrieveProfile();
  },

  /**
   * Handles failure in user login completion.
   * @protected
   * @param {*} e The error produced.
   */
  onLoginFail: function(e) {
    this.handleError(e);
  },

  /**
   * Handles the successful retrieval of the user's balance.
   * @param {!longa.gen.dto.UserBalance} balance
   * @protected
   */
  onBalanceReceived: function(balance) {
    goog.log.info(this.logger_, 'Balance received: ' +
        goog.debug.expose(balance));
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
   * Handles the loading of alerts. Note that alerts are constantly queried and
   * only the new alert instances need to be added to the list and not
   * to replace the whole Alerts instance. However the server will always return
   * a new Alerts instance, thus you need to manually merge the alerts array.
   *
   * @protected
   * @param {!longa.gen.dto.Alerts} alerts
   */
  onAlertLoaded: function(alerts) {
    goog.log.info(this.logger_, 'Retrieved ' + alerts.alerts.length +
        ' new alerts');
  },

  /**
   * Handles the error from loading new alerts.
   * @protected
   * @param {*} e The error that occured from loading the alerts.
   */
  onAlertsFailed: function(e) {
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
