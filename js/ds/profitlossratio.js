/**
 * @fileoverview Provides the profit/loss ratio for any given account.
 */

goog.provide('longa.ds.ProfitLossRatio');

goog.require('pstj.ds.DtoBase');

goog.scope(function() {
var DTO = pstj.ds.DtoBase;


/** @extends {DTO} */
longa.ds.ProfitLossRatio = goog.defineClass(DTO, {
  constructor: function() {
    DTO.call(this);
    /** @type {number} */
    this.profitLossRationAllTime = 0;
    /** @type {number} */
    this.profitLossRatioForOpenSignals = 0;
    /** @type {number} */
    this.profitLossRationForMonth = 0;
    /** @type {number} */
    this.profitLossRationForYear = 0;
  },

  /** @override */
  fromJSON: function(map) {
    this.profitLossRationAllTime = goog.asserts.assertNumber(
        map['pl_all_time']);
    this.profitLossRatioForOpenSignals = goog.asserts.assertNumber(
        map['pl_open']);
    this.profitLossRationForMonth = goog.asserts.assertNumber(map['pl_month']);
    this.profitLossRationForYear = goog.asserts.assertNumber(map['pl_year']);
    goog.base(this, 'fromJSON', map);
  }
});

});  // goog.scope
