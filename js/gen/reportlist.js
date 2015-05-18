
// This code is auto generate, please do not edit.

goog.provide('longa.gen.dto.ReportList');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('longa.gen.dto.ReportRecord');
goog.require('pstj.ds.DtoBase');


goog.scope(function() {
var a = goog.asserts;


/**
 * Describes the report list received from server.
 * @extends {pstj.ds.DtoBase}
 */
longa.gen.dto.ReportList = goog.defineClass(pstj.ds.DtoBase, {
  constructor: function() {
    pstj.ds.DtoBase.call(this);
    /**@type {!Array<longa.gen.dto.ReportRecord>} */
    this.items = [];
  },

  /**@override */
  fromJSON: function(map) {
    goog.array.clear(this.items);
    goog.array.forEach(a.assertArray(map['report']), function(item) {
      var i = new longa.gen.dto.ReportRecord();
      i.fromJSON(a.assertObject(item));
      this.items.push(i);
    }, this);
    goog.base(this, 'fromJSON', map);
  },

  /**@override */
  toJSON: function() {
    return {
      'report': this.items
    };
  }
});
});  // goog.scope

