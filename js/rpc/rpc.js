goog.provide('longa.rpc');
goog.provide('longa.rpc_');

goog.require('goog.Promise');
goog.require('goog.debug');
goog.require('goog.json');
goog.require('goog.log');
goog.require('longa.gen.dto.Alerts');
goog.require('longa.gen.dto.BuyCreditResponse');
goog.require('longa.gen.dto.Profile');
goog.require('longa.gen.dto.ReportList');
goog.require('longa.gen.dto.User');
goog.require('longa.gen.dto.UserBalance');
goog.require('pstj.resource');


/** Implements the RPC for the Longa.com project */
longa.rpc_.Main = goog.defineClass(null, {
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
   * @return {!goog.Promise<!longa.gen.dto.User>}
   */
  login: function(request) {

    request.run = longa.rpc_.Calls.LOGIN;

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
   * @return {!goog.Promise<!longa.gen.dto.UserBalance>}
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
   * RPC call: /rep
   * @param {number} acctid The account id to retrieve report for.
   * @return {!goog.Promise<longa.gen.dto.ReportList>}
   */
  getReport: function(acctid) {
    goog.log.info(this.logger_, 'Retrieving reporting data for: ' + acctid);
    return new goog.Promise(function(resolve, reject) {
      this.resource_.get({
        'run': 'rep',
        'acctid': acctid
      }, goog.bind(function(err, result) {
        try {
          var report = this.handleReportResponse(err, result);
        } catch (e) {
          goog.log.error(this.logger_, 'Cannot retirve report: ' +
              e.message);
          reject(e);
          return;
        }
        resolve(report);
      }, this));
    }, this);
  },

  /**
   * RPC /buy_credit
   * @param {!number} amount The LC credit to purchase.
   * @return {!goog.Promise<!longa.gen.dto.BuyCreditResponse>}
   */
  buyCredit: function(amount) {
    goog.log.info(this.logger_, 'Attempting to purchase credits: ' + amount);
    return new goog.Promise(function(resolve, reject) {
      this.resource_.get({
        'run': 'buy_credit',
        'amount': amount.toString()
      }, goog.bind(function(err, result) {
        try {
          var pp = this.handleBuyCreditResponse(err, result);
        } catch (e) {
          goog.log.error(this.logger_, 'Cannot retrieve paypal payment info' +
              e.message);
          reject(e);
          return;
        }
        resolve(pp);
      }, this));
    }, this);
  },

  /**
   * RPC /withdrawal
   * @param {!number} amount The LC credits to withdraw.
   * @return {!goog.Promise<boolean>}
   */
  withdrawCredit: function(amount) {
    goog.log.info(this.logger_, 'Attempting withdrawal credits: ' + amount);
    return new goog.Promise(function(resolve, reject) {
      this.resource_.get({
        'run': 'withdrawal',
        'amount': amount.toString()
      }, goog.bind(function(err, result) {
        try {
          this.handleRawResponse_(err, result);
        } catch (e) {
          reject(e);
        }
        resolve(true);
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
   * @return {!goog.Promise<!longa.gen.dto.Profile>}
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
   * RPC call: /profile (POST)
   * Update the user profile on the server.
   * @param {!longa.gen.dto.Profile} profile
   * @return {!goog.Promise<!longa.gen.dto.Profile>}
   */
  updateProfile: function(profile) {
    goog.log.info(this.logger_, 'Updating profile');

    return new goog.Promise(function(resolve, reject) {
      this.resource_.post(/** @type {Object<string, *>} */(profile.toJSON()),
          goog.bind(function(err, result) {
            try {
              var profile = this.handleProfileResult(err, result);
            } catch (e) {
              goog.log.error(this.logger_, 'Cannot update profile: ' +
                  e.message);
              reject(e);
              return;
            }
            goog.log.info(this.logger_, 'Profile updated');
            resolve(profile);
          }, this));
    }, this);
  },

  /**
   * Recovers the account.
   * @param {string} email
   * @return {!goog.Promise<boolean>}
   */
  recover: function(email) {
    goog.log.info(this.logger_, 'Attempt to recover account: ' + email);
    return new goog.Promise(function(resolve, reject) {
      this.resource_.get({
        'run': longa.rpc_.Calls.RECOVER,
        'email': email
      }, goog.bind(function(err, result) {
        if (!goog.isNull(err)) {
          reject(err);
        } else if (!this.wasSuccessful_(result)) {
          reject(new Error(result['msg']));
        } else {
          resolve(true);
        }
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
   * @return {!longa.gen.dto.User}
   */
  handleLoginResult: function(err, loginResult) {
    this.handleRawResponse_(err, loginResult);
    var credentials = new longa.gen.dto.User();
    credentials.fromJSON(loginResult);
    return credentials;
  },

  /**
   * Default handler for the balance request (balance without acctid).
   * @param {Error?} err The error if there was any in the RPC link.
   * @param {?} balance The request's result from server.
   * @protected
   * @return {!longa.gen.dto.UserBalance}
   */
  handleBalanceResponse: function(err, balance) {
    this.handleRawResponse_(err, balance);
    var b = new longa.gen.dto.UserBalance();
    b.fromJSON(balance);
    return b;
  },

  /**
   * Default handler for the balance request (balance without acctid).
   * @param {Error?} err The error if there was any in the RPC link.
   * @param {?} report The request's result from server.
   * @protected
   * @return {!longa.gen.dto.ReportList}
   */
  handleReportResponse: function(err, report) {
    this.handleRawResponse_(err, report);
    var rl = new longa.gen.dto.ReportList();
    rl.fromJSON(report);
    return rl;
  },

  /**
   * Handles the receiving of alert list.
   *
   * @param {Error?} err The error if there was any in the RPC link.
   * @param {?} alerts The request's result from server.
   * @protected
   * @return {!longa.gen.dto.Alerts}
   */
  handleAlertsResponse: function(err, alerts) {
    this.handleRawResponse_(err, alerts);
    // TODO: We need fix here, please contact server admin to fix it there.
    this.fixAlertsResponse_(alerts);
    var a = new longa.gen.dto.Alerts();
    a.fromJSON(alerts);
    return a;
  },

  /**
   * Handles the raw responce from server fro buy_credit.
   * @param {Error?} err The error if one was creted in the network layer.
   * @param {?} pp The result from server.
   * @protected
   * @return {!longa.gen.dto.BuyCreditResponse}
   */
  handleBuyCreditResponse: function(err, pp) {
    this.handleRawResponse_(err, pp);
    var a = new longa.gen.dto.BuyCreditResponse();
    a.fromJSON(pp);
    return a;
  },

  /**
   * Handles the receiving of the profile info.
   * @param {Error?} err The error if one was creating by the network stack.
   * @param {?} profile The raw server response.
   * @protected
   * @return {!longa.gen.dto.Profile}
   */
  handleProfileResult: function(err, profile) {
    this.handleRawResponse_(err, profile);
    var p = new longa.gen.dto.Profile();
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
longa.rpc_.Calls = {
  LOGIN: 'log',
  RECOVER: 'forgot'
};


/**
 * Provide the default instane for application(s) to use.
 *
 * The instance is constructed to be used as a shorthand, example:
 * <pre>
 *   var rpc = longa.rpc;
 *   rpc.login(...);
 * </pre>
 *
 * @final
 * @type {longa.rpc_.Main}
 */
longa.rpc = new longa.rpc_.Main();
