goog.provide('longa.control.Sellers_');
goog.provide('longa.sellers');

goog.require('longa.control.Toaster');
goog.require('longa.data');
goog.require('longa.rpc');
goog.require('pstj.control.Control');


/**
 * @extends {pstj.control.Control}
 * @private
 */
longa.control.Sellers_ = goog.defineClass(pstj.control.Control, {
  constructor: function() {
    pstj.control.Control.call(this);
    this.init();
  },

  /**
   * @return {!goog.Promise<!longa.gen.dto.Sellers>}
   */
  get: function() {
    return longa.rpc.getSellerRecords()
      .then(this.onGet_, this.onGetFail_, this);
  },

  /**
   * @private
   * @param {longa.gen.dto.Sellers} sellers
   */
  onGet_: function(sellers) {
    longa.data.sellers.fromJSON(sellers.toJSON());
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
 * @type {!longa.control.Sellers_}
 */
longa.sellers = new longa.control.Sellers_();
