/**
 * @fileoverview Provides global access to storage mechanizm for the whole app.
 *
 * Currently implemented is storage only for the user credentials and alerts.
 * TODO: implement sotrage for stuctured data (lovefield - see
 * https://github.com/google/lovefield).
 */

goog.provide('longa.storage');

goog.require('longa.data');
goog.require('longa.gen.dto.LoginDetails');
goog.require('pstj.storage.Storage');


/**
 * @private
 * @final
 * @type {!pstj.storage.Storage}
 */
longa.storage.storage_ = new pstj.storage.Storage();


/**
 * The symbol under which to save the login of the users.
 * @type {string}
 * @final
 * @private
 */
longa.storage.credentialsSymbol_ = 'credentials';


/**
 * The symbol under which to save the last alert index received.
 * @type {string}
 * @final
 * @private
 */
longa.storage.alertIndexSymbol_ = 'lastalert';


/**
 * The symbol under which to save the last alert index received.
 * @type {string}
 * @final
 * @private
 */
longa.storage.stashTsSymbol_ = 'lsts';


/**
 * Saves the credentials for later re-logins.
 * @param {!longa.gen.dto.LoginDetails} credentials The details to save.
 */
longa.storage.storeCredentials = function(credentials) {
  longa.storage.storage_.set(longa.storage.credentialsSymbol_,
      credentials);
};


/**
 * Stashes the credentials for returning user from paypal.
 * @param {!longa.gen.dto.LoginDetails} credentials
 * @param {!string} key
 */
longa.storage.stashCredentials = function(credentials, key) {
  longa.storage.storage_.set(key, credentials);
  longa.storage.storage_.set(longa.storage.stashTsSymbol_, goog.now());
};


/**
 * Unstashes previuosly stored credentials.
 * @param {!string} key
 * @return {?longa.gen.dto.LoginDetails}
 */
longa.storage.unstashCredentials = function(key) {
  var res = null;
  try {
    var lastStashTs = longa.storage.storage_.get(longa.storage.stashTsSymbol_);
    if (goog.isNumber(lastStashTs) &&
        goog.now() - lastStashTs < (15 * 60 * 1000)) {
      var result = longa.storage.storage_.get(key);
      if (goog.isDefAndNotNull(result)) {
        goog.asserts.assertObject(result);
        var ld = new longa.gen.dto.LoginDetails();
        ld.fromJSON(result);
        res = ld;
      }
    }
    longa.storage.storage_.remove(key);
  } catch (e) { }
  return res;
};


/**
 * Clears up the credentials from LS.
 */
longa.storage.removeCredentials = function() {
  longa.storage.storage_.remove(longa.storage.credentialsSymbol_);
};


/**
 * Attempts to retrieve stored login information for the user. If one is found
 * it is returned, otherwise null is returned.
 * @return {?longa.gen.dto.LoginDetails}
 */
longa.storage.retrieveCredentials = function() {
  try {
    var result = longa.storage.storage_.get(longa.storage.credentialsSymbol_);
    if (goog.isDefAndNotNull(result)) {
      goog.asserts.assertObject(result);
      var ld = new longa.gen.dto.LoginDetails();
      ld.fromJSON(result);
      return ld;
    } else {
      return null;
    }
  } catch (e) {
    return null;
  }
};


/**
 * Retrieve the last index of alert received. If no alert was received
 * zero will be returned.
 * @return {!number}
 */
longa.storage.getLastAlertIndex = function() {
  try {
    var result = longa.storage.storage_.get(longa.storage.getAlertSymbol_());
    if (goog.isDefAndNotNull(result)) {
      goog.asserts.assertNumber(result);
      return result;
    } else {
      return 0;
    }
  } catch (e) {
    return 0;
  }
};


/**
 * Saves the last alert index received.
 * @param {!number} index The alert index.
 */
longa.storage.setLastAlertIndex = function(index) {
  longa.storage.storage_.set(longa.storage.getAlertSymbol_(), index);
};


/**
 * Matches the alert to the user.
 * @return {!string}
 * @private
 */
longa.storage.getAlertSymbol_ = function() {
  return longa.storage.alertIndexSymbol_ + longa.data.user.accountid;
};
