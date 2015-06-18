
// This code is auto generate, please do not edit.

goog.provide('longa.gen.dto.Signals');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('longa.gen.dto.Signal');
goog.require('pstj.ds.DtoBase');


goog.scope(function() {
var a = goog.asserts;


/**
 * Describes a list of signals
 * @extends {pstj.ds.DtoBase}
 */
longa.gen.dto.Signals = goog.defineClass(pstj.ds.DtoBase, {
  constructor: function() {
    pstj.ds.DtoBase.call(this);
    /** @type {!Array<!longa.gen.dto.Signal>} */
    this.signals = [];
  },

  /** @override */
  fromJSON: function(map) {
    goog.array.clear(this.signals);
    goog.array.forEach(a.assertArray(map['signal']), function(item) {
      var i = new longa.gen.dto.Signal();
      i.fromJSON(a.assertObject(item));
      this.signals.push(i);
    }, this);
    goog.base(this, 'fromJSON', map);
  },

  /** @override */
  toJSON: function() {
    return {
      'signal': goog.array.map(this.signals, function(item) {
        return item.toJSON();
      })
    };
  }
});
});  // goog.scope

