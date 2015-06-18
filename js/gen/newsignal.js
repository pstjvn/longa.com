
// This code is auto generate, please do not edit.

goog.provide('longa.gen.dto.NewSignal');

goog.require('goog.asserts');
goog.require('pstj.ds.DtoBase');


goog.scope(function() {
var a = goog.asserts;


/**
 * Describes a new signal to be created.
 * @extends {pstj.ds.DtoBase}
 */
longa.gen.dto.NewSignal = goog.defineClass(pstj.ds.DtoBase, {
  constructor: function() {
    pstj.ds.DtoBase.call(this);
    /** @type {!string} */
    this.type = '';
    /** @type {!string} */
    this.symbol = '';
    /** @type {!string} */
    this.run = '';
  },

  /** @override */
  fromJSON: function(map) {
    this.type = a.assertString(map['type']);
    this.symbol = a.assertString(map['symbol']);
    this.run = a.assertString(map['run']);
    goog.base(this, 'fromJSON', map);
  },

  /** @override */
  toJSON: function() {
    return {
      'type': this.type,
      'symbol': this.symbol,
      'run': this.run
    };
  }
});
});  // goog.scope

