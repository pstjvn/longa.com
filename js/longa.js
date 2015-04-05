goog.provide('longa.App');

goog.require('app.template');
goog.require('goog.debug.Console');
goog.require('goog.json');
goog.require('goog.log');
goog.require('longa.ds.LoginDetails');
goog.require('longa.ds.User');
goog.require('longa.rpc');

goog.scope(function() {
var rpc = longa.rpc.instance;


/** The main entry point for the application */
longa.App = goog.defineClass(null, {
  constructor: function() {
    /**
     * @type {goog.debug.Logger}
     * @private
     * @final
     */
    this.logger_ = goog.log.getLogger('longa.App');
    this.init_();
  },

  /**
   * Performs needed initialization and configuration.
   * @private
   */
  init_: function() {
    goog.log.fine(this.logger_, 'Initializing the app');
    rpc.configure({
      // The run variable name as in /cgi-bin/stock.cgi?{run}=...
      run: 'run',
      // The path of the cgi exe as in {/cgi-bin/stock.cgi}?...
      execPath: '/cgi-bin/stock.cgi',
      // If the exec path contains a domain different from the
      // domain we are currently running under.
      crossdomain: false
    });
  },

  /**
   * Attempts to perform authorization with the backend.
   */
  performAuth: function() {

    goog.log.info(this.logger_, 'attempt login with rpc');

    var credentaisl = new longa.ds.LoginDetails();
    credentaisl.username = 'aaa';
    credentaisl.password = '123456';
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
   * @param {longa.ds.User} user
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
   * @param {longa.ds.Balance} balance
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

  onAlertLoaded: function(alerts) {
    goog.log.info(this.logger_, 'Retrieved ' + alerts.getCount() +
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
