
// This code is auto generate, please do not edit.

goog.provide('longa.gen.dto.Alerts');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('longa.gen.dto.Alert');
goog.require('pstj.ds.DtoBase');


goog.scope(function() {
var a = goog.asserts;


/**
 * Describes the alert listr
 * @extends {pstj.ds.DtoBase}
 */
longa.gen.dto.Alerts = goog.defineClass(pstj.ds.DtoBase, {
  constructor: function() {
    pstj.ds.DtoBase.call(this);
    /** @type {!Array<!longa.gen.dto.Alert>} */
    this.alerts = [];
    /** @type {!number} */
    this.delay = 0;
  },

  /** @override */
  fromJSON: function(map) {
    goog.array.clear(this.alerts);
    goog.array.forEach(a.assertArray(map['alert']), function(item) {
      var i = new longa.gen.dto.Alert();
      i.fromJSON(a.assertObject(item));
      this.alerts.push(i);
    }, this);
    this.delay = a.assertNumber(map['delay']);
    goog.base(this, 'fromJSON', map);
  },

  /** @override */
  toJSON: function() {
    return {
      'alert': goog.array.map(this.alerts, function(item) {
        return item.toJSON();
      }),
      'delay': this.delay
    };
  }
});
});  // goog.scope

