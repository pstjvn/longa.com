
// This code is auto generate, please do not edit.

goog.provide('longa.gen.dto.ReportRecord');

goog.require('goog.asserts');
goog.require('pstj.ds.DtoBase');


goog.scope(function() {
var a = goog.asserts;


/**
 * Describes a single report record in record data list
 * @extends {pstj.ds.DtoBase}
 */
longa.gen.dto.ReportRecord = goog.defineClass(pstj.ds.DtoBase, {
  constructor: function() {
    pstj.ds.DtoBase.call(this);
    /**
     * The date of this reporting record
     * @type {!Date}
     */
    this.date = new Date();
    /**
     * Profit/loss for all time at this particular date
     * @type {!number}
     */
    this.profitLossRatio = 0;
    /**
     * The signal count at that date
     * @type {!number}
     */
    this.signalCount = 0;
    /**
     * Chagres at that date
     * @type {!number}
     */
    this.charge = 0;
    /**
     * Number of subscribers, valid only for sellers
     * @type {!number}
     */
    this.memberCount = 0;
  },

  /** @override */
  fromJSON: function(map) {
    this.date = (new Date(a.assertString(map['date']))) || this.date;
    this.profitLossRatio = a.assertNumber(map['pl_all_time']);
    this.signalCount = a.assertNumber(map['signal_count']);
    this.charge = a.assertNumber(map['charge']);
    this.memberCount = a.assertNumber(map['member_count']);
    goog.base(this, 'fromJSON', map);
  },

  /** @override */
  toJSON: function() {
    return {
      'date': this.date.toString(),
      'pl_all_time': this.profitLossRatio,
      'signal_count': this.signalCount,
      'charge': this.charge,
      'member_count': this.memberCount
    };
  }
});
});  // goog.scope

