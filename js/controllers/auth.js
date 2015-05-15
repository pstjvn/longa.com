goog.provide('longa.control.Auth');

goog.require('longa.ds.Topic');
goog.require('longa.gen.dto.LoginDetails');
goog.require('longa.gen.dto.User');
goog.require('longa.rpc');
goog.require('pstj.control.Control');

goog.scope(function() {
// var T = longa.ds.Topic;
var rpc = longa.rpc;


/** @extends {pstj.control.Control} */
longa.control.Auth = goog.defineClass(pstj.control.Control, {
  /** @param {Object=} opt_context The context to use. */
  constructor: function(opt_context) {
    pstj.control.Control.call(this, opt_context);
    /**
     * If we should keep the user/pass in local storage when a login
     * succeeds.
     * @type {boolean}
     * @private
     */
    this.keepLoginDetails_ = false;
    /**
     * Reference to the last login details.
     *
     * We keep them until the server response is back to avoid unnessesary
     * handing around of the data in closures and promisses.
     *
     * @private
     * @type {longa.gen.dto.LoginDetails}
     */
    this.lastLoginDetails_ = null;
    /**
     * @private
     * @type {goog.debug.Logger}
     */
    this.logger_ = goog.log.getLogger('longa.control.Auth');
  },

  /**
   * Performs attempt to log in on the server.
   *
   * @param {!longa.gen.dto.LoginDetails} login_details The user details to
   * use to perform the login action.
   * @param {!boolean} keep_details If true the controller will preserve the
   * login details in local storage and will perform authomatic login the next
   * time the application is started until the user requests a logout.
   */
  login: function(login_details, keep_details) {

    this.keepLoginDetails_ = keep_details;
    this.lastLoginDetails_ = login_details;
    goog.log.info(this.logger_, 'Should keep login details: ' +
        keep_details.toString());
    goog.log.info(this.logger_, login_details.username + ':' +
        login_details.password);
    rpc.login(login_details)
      .then(this.onLogin_, this.onLoginFail_, this)
      .thenAlways(this.onLoginComplete_, this);
  },

  /**
   * Performs the log-out procedures.
   */
  logout: function() {
    rpc.logout().then(
        function() {
          longa.storage.removeCredentials();
          longa.data.user = new longa.gen.dto.User();
          this.push(longa.ds.Topic.USER_AUTH_CHANGED);
        }, function() {
          // generic error handler.
        }, this);
  },

  /**
   * Handles the receiving of new user credentials upon successful login.
   * @param {!longa.gen.dto.User} user
   * @private
   */
  onLogin_: function(user) {
    goog.log.info(this.logger_, 'Login successed');
    longa.data.user = user;
    if (this.keepLoginDetails_) {
      longa.storage.storeCredentials(goog.asserts.assertInstanceof(
          this.lastLoginDetails_, longa.gen.dto.LoginDetails));
    }
  },

  /**
   * Handles the error when performing login on the server.
   * @param {*} error The error associated with the action that failed.
   * @private
   */
  onLoginFail_: function(error) {
    goog.log.info(this.logger_, 'Login failed');
    goog.asserts.assertInstanceof(error, Error);
    longa.data.user = new longa.gen.dto.User();
    this.push(longa.ds.Topic.USER_AUTH_FAILED, error);
  },

  /**
   * Handles the completion of the user auth process.
   * @private
   */
  onLoginComplete_: function() {
    goog.log.info(this.logger_, 'Login completed');
    // Clear the reference as we do not need it anymore.
    this.lastLoginDetails_ = null;
    this.push(longa.ds.Topic.USER_AUTH_CHANGED);
  }
});
goog.addSingletonGetter(longa.control.Auth);

});  // goog.scope
