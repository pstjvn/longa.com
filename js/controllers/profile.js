goog.provide('longa.control.Profile');
goog.provide('longa.profile');

goog.require('longa.control.Toaster');
goog.require('longa.data');
goog.require('longa.rpc');
goog.require('pstj.control.Control');


/** @extends {pstj.control.Control} */
longa.control.Profile = goog.defineClass(pstj.control.Control, {
  constructor: function() {
    pstj.control.Control.call(this);
    this.init();
  },

  /**
   * @return {!goog.Promise<!longa.gen.dto.Profile>}
   */
  get: function() {
    return longa.rpc.getProfile().then(this.onGet_, this.onGetFail_, this);
  },

  /**
   * Updates the profile on server using RPC.
   * @param {!longa.gen.dto.Profile} profile
   * @return {!goog.Promise<!longa.gen.dto.Profile>}
   */
  put: function(profile) {
    return longa.rpc.updateProfile(profile);
  },

  /**
   * @private
   * @param {longa.gen.dto.Profile} profile
   */
  onGet_: function(profile) {
    longa.data.profile.fromJSON(/** @type {!Object<string, *>} */(
        profile.toJSON()));
  },

  /**
   * @private
   * @param {*} e
   */
  onGetFail_: function(e) {
    if (e instanceof Error) {
      longa.control.Toaster.getInstance().addToast(e.message, null, null);
    }
  }
});


/**
 * @final
 * @type {!longa.control.Profile}
 */
longa.profile = new longa.control.Profile();
