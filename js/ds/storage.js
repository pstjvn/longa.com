/**
 * @fileoverview Provides global access to storage mechanizm for the whole app.
 *
 * Currently implemented is storage only for the user credentials.
 * TODO: implement storage for last alert index.
 * TODO: implement sotrage for stuctured data (lovefield - see
 * https://github.com/google/lovefield).
 */

goog.provide('longa.storage');

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
 * Saves the credentials for later re-logins.
 * @param {!longa.gen.dto.LoginDetails} credentials The details to save.
 */
longa.storage.storeCredentials = function(credentials) {
  longa.storage.storage_.set(longa.storage.credentialsSymbol_,
      credentials);
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
