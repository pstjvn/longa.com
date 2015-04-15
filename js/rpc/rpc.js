goog.provide('longa.rpc');
goog.provide('longa.rpc.Calls');
goog.provide('longa.rpc.Main');

goog.require('goog.Promise');
goog.require('goog.debug');
goog.require('goog.json');
goog.require('goog.log');
goog.require('longa.gen.dto.Alerts');
goog.require('longa.gen.dto.Profile');
goog.require('longa.gen.dto.User');
goog.require('longa.gen.dto.UserBalance');
goog.require('pstj.resource');

goog.scope(function() {
var Alerts = longa.gen.dto.Alerts;
var Profile = longa.gen.dto.Profile;
var User = longa.gen.dto.User;
var UserBalance = longa.gen.dto.UserBalance;


/** Implements the RPC for the Longa.com project */
longa.rpc.Main = goog.defineClass(null, {
  constructor: function() {
    /**
     * The logger to use for RPC
     * @type {goog.debug.Logger}
     * @private
     */
    this.logger_ = goog.log.getLogger('longa.rpc');
    /**
     * Reference the resource instance we are going to use.
     * @type {pstj.resource.Resource}
     * @private
     */
    this.resource_ = null;
  },

  /**
   * Provides the entry point to configure the rpc package.
   *
   * This can be called only once in the lifetime of the application and
   * should be called before you start any rpcs.
   *
   * @param {pstj.resource.Configuration} config
   */
  configure: function(config) {
    if (goog.isNull(this.resource_)) {
      goog.log.info(this.logger_, 'Configuring rpc:' +
          goog.debug.expose(config));
      pstj.resource.configure(config);
      this.resource_ = pstj.resource.getInstance();
      this.registerCallbacks();
    } else {
      throw new Error('Already configured');
    }
  },

  /**
   * Pre-registers the handlers for the default RPC calls.
   *
   * You should not call this directly, but can override it if needed.
   *
   * @protected
   */
  registerCallbacks: function() {},

  /**
   * RPC call: /log implementation.
   *
   * @param {longa.gen.dto.LoginDetails} request
   * @return {!goog.Promise<!User>}
   */
  login: function(request) {

    request.run = longa.rpc.Calls.LOGIN;

    goog.log.fine(this.logger_, 'Attemping log-in on server');
    goog.log.info(this.logger_, 'User credentials for request: ' +
        goog.json.serialize(request));

    return new goog.Promise(function(resolve, reject) {
      this.resource_.get(
          /** @type {Object<string, *>} */(request.toJSON()),
          goog.bind(function(err, result) {

            try {
              var user = this.handleLoginResult(err, result);
            } catch (e) {
              goog.log.warning(this.logger_, 'Log-in failed: ' + e.message);
              reject(e);
              return;
            }

            goog.log.info(this.logger_, 'Logged in on server: ' +
                goog.debug.expose(user));
            resolve(user);

          }, this));
    }, this);
  },

  /**
   * RPC call: /logout implementation.
   *
   * @return {goog.Promise<boolean>}
   */
  logout: function() {

    goog.log.fine(this.logger_, 'Attempting log-out on server');

    return new goog.Promise(function(resolve, reject) {
      this.resource_.get({
        'run': 'logout'
      }, goog.bind(function(err, result) {

        var succeeded = this.handleLogoutRequest(err, result);
        goog.log.info(this.logger_, 'Log-out succeed: ' + succeeded);
        resolve(succeeded);

      }, this));
    }, this);
  },

  /**
   * PRC call: /bal
   * @return {!goog.Promise<!UserBalance>}
   */
  getBalance: function() {

    goog.log.fine(this.logger_, 'getting balance for logged in account');

    return new goog.Promise(function(resolve, reject) {
      this.resource_.get({
        'run': 'bal'
      }, goog.bind(function(err, result) {

        try {
          var balance = this.handleBalanceResponse(err, result);
        } catch (e) {
          goog.log.error(this.logger_, 'Cannot get balance: ' +
              e.message);
          reject(e);
          return;
        }
        resolve(balance);
      }, this));
    }, this);
  },

  /**
   * RPC call: /alert
   * @param {number=} opt_beginAfter The alert ID after which to begin the
   *    collection.
   * @return {!goog.Promise<!longa.gen.dto.Alerts>}
   */
  getAlerts: function(opt_beginAfter) {
    if (!goog.isNumber(opt_beginAfter)) opt_beginAfter = 0;

    goog.log.fine(this.logger_, 'Retrieving alerts after id ' + opt_beginAfter);

    return new goog.Promise(function(resolve, reject) {
      this.resource_.get({
        'run': 'alert',
        'alert_id': opt_beginAfter
      }, goog.bind(function(err, result) {
        try {
          var alerts = this.handleAlertsResponse(err, result);
        } catch (e) {
          goog.log.error(this.logger_, 'Cannot get alerts: ' +
              e.message);
          reject(e);
          return;
        }
        goog.log.info(this.logger_, 'Received alerts.');
        resolve(alerts);
      }, this));
    }, this);
  },

  /**
   * RPC call: /profile
   * @return {!goog.Promise<!Profile>}
   */
  getProfile: function() {
    goog.log.fine(this.logger_, 'Retriving profile info');
    return new goog.Promise(function(resolve, reject) {
      this.resource_.get({
        'run': 'profile'
      }, goog.bind(function(err, result) {
        try {
          var profile = this.handleProfileResult(err, result);
        } catch (e) {
          goog.log.error(this.logger_, 'Cannot retirve profile' +
              e.message);
          reject(e);
          return;
        }
        goog.log.info(this.logger_, 'Received profile');
        resolve(profile);
      }, this));
    }, this);
  },

  /**
   * Default RPC handler for login attempts.
   *
   * @param {Error?} err The error if there was any in the RPC link.
   * @param {?} loginResult The login result if the call was successfully
   *    completed.
   * @protected
   * @return {!User}
   */
  handleLoginResult: function(err, loginResult) {
    this.handleRawResponse_(err, loginResult);
    var credentials = new User();
    credentials.fromJSON(loginResult);
    return credentials;
  },

  /**
   * Default handler for the balance request (balance without acctid).
   * @param {Error?} err The error if there was any in the RPC link.
   * @param {?} balance The request's result from server.
   * @protected
   * @return {!UserBalance}
   */
  handleBalanceResponse: function(err, balance) {
    this.handleRawResponse_(err, balance);
    var b = new UserBalance();
    b.fromJSON(balance);
    return b;
  },

  /**
   * Handles the receiving of alert list.
   *
   * @param {Error?} err The error if there was any in the RPC link.
   * @param {?} alerts The request's result from server.
   * @protected
   * @return {!Alerts}
   */
  handleAlertsResponse: function(err, alerts) {
    this.handleRawResponse_(err, alerts);
    // TODO: We need fix here, please contact server admin to fix it there.
    this.fixAlertsResponse_(alerts);
    var a = new Alerts();
    a.fromJSON(alerts);
    return a;
  },

  /**
   * Handles the receiving of the profile info.
   * @param {Error?} err The error if one was creating by the network stack.
   * @param {?} profile The raw server response.
   * @protected
   * @return {!Profile}
   */
  handleProfileResult: function(err, profile) {
    this.handleRawResponse_(err, profile);
    var p = new Profile();
    p.fromJSON(profile);
    return p;
  },

  /**
   * Handles the attempt to log out from the server session.
   * @protected
   * @param {Error?} err An error if such occured on network layer.
   * @param {?} logoutResult The logout result object.
   * @return {boolean} True if the logout was successful, false otherwise.
   */
  handleLogoutRequest: function(err, logoutResult) {
    if (goog.isNull(err)) {
      goog.asserts.assertObject(logoutResult);
      return this.wasSuccessful_(logoutResult);
    } else {
      return false;
    }
  },

  /**
   * Checks if the rpc call was makred as successful by the server side.
   *
   * @private
   * @param {Object<string, *>} result
   * @return {boolean}
   */
  wasSuccessful_: function(result) {
    return result['status'] == 'OK';
  },

  /**
   * Bareback handling of all responses coming from the Longa server.
   *
   * The response has common denominator signature that we can check upon
   * and pre-process before we actually try to use it.
   *
   * TODO: Also here we monitor for server sent redirects and we emit pubsub
   * on the redirect topic.
   *
   * @private
   * @param {Error?} err The error from the actual transport layer if any.
   * @param {Object<string, *>} result The actual server sent result.
   */
  handleRawResponse_: function(err, result) {
    if (!goog.isNull(err)) throw err;
    goog.asserts.assertObject(result);
    if (!this.wasSuccessful_(result)) throw new Error(result['msg']);
  },

  /**
   * Fixes the response from the server. It should be fixed there instead.
   * @param {Object<string, *>} alerts
   * @protected
   */
  fixAlertsResponse_: function(alerts) {
    goog.array.forEach(goog.asserts.assertArray(alerts['alert']), function(a) {
      a['provider_acctid'] = parseInt(a['provider_acctid'], 10);
    });
  }
});


/**
 * @enum {string}
 */
longa.rpc.Calls = {
  LOGIN: 'log'
};


/**
 * Provide the default instane for application(s) to use.
 *
 * The instance is constructed to be used as a shorthand, example:
 * <pre>
 *   var rpc = longa.rpc.instance;
 *   rpc.login(...);
 * </pre>
 *
 * @final
 * @type {longa.rpc.Main}
 */
longa.rpc.instance = new longa.rpc.Main();

});  // goog.scope
