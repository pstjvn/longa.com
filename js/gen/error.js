
// This code is auto generate, please do not edit.

goog.provide('longa.gen.dto.Error');

goog.require('goog.asserts');
goog.require('pstj.ds.DtoBase');


goog.scope(function() {
var a = goog.asserts;


/**
 * DTO for errors
 * @extends {pstj.ds.DtoBase}
 */
longa.gen.dto.Error = goog.defineClass(pstj.ds.DtoBase, {
  constructor: function() {
    pstj.ds.DtoBase.call(this);
    /**
     * The server to use for responses.
     * @type {!string}
     */
    this.message = '';
    /**
     * If we should navigate internally.
     * @type {!string}
     */
    this.redirect = '';
  },

  /** @override */
  fromJSON: function(map) {
    this.message = a.assertString(map['msg']);
    this.redirect = a.assertString(map['redirect']);
    goog.base(this, 'fromJSON', map);
  },

  /** @override */
  toJSON: function() {
    return {
      'msg': this.message,
      'redirect': this.redirect
    };
  }
});
});  // goog.scope

