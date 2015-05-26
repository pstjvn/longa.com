
// This code is auto generate, please do not edit.

goog.provide('longa.gen.dto.Sellers');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('longa.gen.dto.SellerBalance');
goog.require('pstj.ds.DtoBase');


goog.scope(function() {
var a = goog.asserts;


/**
 * Describes the alert listr
 * @extends {pstj.ds.DtoBase}
 */
longa.gen.dto.Sellers = goog.defineClass(pstj.ds.DtoBase, {
  constructor: function() {
    pstj.ds.DtoBase.call(this);
    /** @type {!Array<!longa.gen.dto.SellerBalance>} */
    this.sellers = [];
  },

  /** @override */
  fromJSON: function(map) {
    goog.array.clear(this.sellers);
    goog.array.forEach(a.assertArray(map['seller']), function(item) {
      var i = new longa.gen.dto.SellerBalance();
      i.fromJSON(a.assertObject(item));
      this.sellers.push(i);
    }, this);
    goog.base(this, 'fromJSON', map);
  },

  /** @override */
  toJSON: function() {
    return {
      'seller': goog.array.map(this.sellers, function(item) {
        return item.toJSON();
      })
    };
  }
});
});  // goog.scope

