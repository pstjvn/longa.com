
// This code is auto generate, please do not edit.

goog.provide('longa.gen.dto.BuyCreditResponse');

goog.require('goog.asserts');
goog.require('pstj.ds.DtoBase');


goog.scope(function() {
var a = goog.asserts;


/**
 * DTO for paypal details
 * @extends {pstj.ds.DtoBase}
 */
longa.gen.dto.BuyCreditResponse = goog.defineClass(pstj.ds.DtoBase, {
  constructor: function() {
    pstj.ds.DtoBase.call(this);
    /**
     * The server to use for responses.
     * @type {!string}
     */
    this.server = '';
    /**
     * The invoice to trigger on the server.
     * @type {!string}
     */
    this.invoiceId = '';
    /**
     * A preconfigured URI to compare to.
     * @type {!string}
     */
    this.url = '';
    /**
     * Pass-through variable for your own tracking purposes.
     * @type {!string}
     */
    this.sid = '';
  },

  /** @override */
  fromJSON: function(map) {
    this.server = a.assertString(map['server']);
    this.invoiceId = a.assertString(map['invoice']);
    this.url = a.assertString(map['paypal_url']);
    this.sid = a.assertString(map['custom']);
    goog.base(this, 'fromJSON', map);
  },

  /** @override */
  toJSON: function() {
    return {
      'server': this.server,
      'invoice': this.invoiceId,
      'paypal_url': this.url,
      'custom': this.sid
    };
  }
});
});  // goog.scope

