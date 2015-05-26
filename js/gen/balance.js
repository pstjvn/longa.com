
// This code is auto generate, please do not edit.

goog.provide('longa.gen.dto.Balance');

goog.require('goog.asserts');
goog.require('pstj.ds.DtoBase');


goog.scope(function() {
var a = goog.asserts;


/**
 * DTO for basic balance infomation, not to be used directly.
 * @extends {pstj.ds.DtoBase}
 */
longa.gen.dto.Balance = goog.defineClass(pstj.ds.DtoBase, {
  constructor: function() {
    pstj.ds.DtoBase.call(this);
    /**
     * The date when the first signal was created/received
     * @type {!string}
     */
    this.firstSignalDate = '';
    /**
     * The time of day when the first signal was created/received
     * @type {!string}
     */
    this.firstSignalTime = '';
    /**
     * The date when the last signal was created/received
     * @type {!string}
     */
    this.lastSignalDate = '';
    /**
     * The time of date when the first signal was created/received
     * @type {!string}
     */
    this.lastSignalTime = '';
    /**
     * Number of subscribers (seller) or number of providers the account is
     *  subscribed to (investor).
     * @type {!number}
     */
    this.memberCount = 0;
    /**
     * Total number of created/received signals
     * @type {!number}
     */
    this.signalCount = 0;
    /**
     * The number of signals that were on loss
     * @type {!number}
     */
    this.lostSignalCount = 0;
    /**
     * The number of signals that turned profit on close time
     * @type {!number}
     */
    this.profitableSignalCount = 0;
    /**
     * The number of currently open signals
     * @type {!number}
     */
    this.openSignalCount = 0;
    /**
     * The profit/loss ratio for all time
     * @type {!number}
     */
    this.profitLossRatio = 0;
    /**
     * The profit/loss ratio for the current month (since 1st)
     * @type {!number}
     */
    this.profitLossRatioMonth = 0;
    /**
     * The profit/loss ratio for the currently open signals
     * @type {!number}
     */
    this.profitLossRatioOpen = 0;
    /**
     * The profit/loss ratio for the current calendar year
     * @type {!number}
     */
    this.profitLossRatioYear = 0;
    /**
     * The average duration in days of an open/close cycle
     * @type {!number}
     */
    this.averageTransactionDuration = 0;
  },

  /** @override */
  fromJSON: function(map) {
    this.firstSignalDate = a.assertString(map['first_signal_date']);
    this.firstSignalTime = a.assertString(map['first_signal_time']);
    this.lastSignalDate = a.assertString(map['last_signal_date']);
    this.lastSignalTime = a.assertString(map['last_signal_time']);
    this.memberCount = a.assertNumber(map['member_count']);
    this.signalCount = a.assertNumber(map['signal_count']);
    this.lostSignalCount = a.assertNumber(map['loss_count']);
    this.profitableSignalCount = a.assertNumber(map['profit_count']);
    this.openSignalCount = a.assertNumber(map['open_count']);
    this.profitLossRatio = a.assertNumber(map['pl_all_time']);
    this.profitLossRatioMonth = a.assertNumber(map['pl_month']);
    this.profitLossRatioOpen = a.assertNumber(map['pl_open']);
    this.profitLossRatioYear = a.assertNumber(map['pl_year']);
    this.averageTransactionDuration = a.assertNumber(map['tran_duration']);
    goog.base(this, 'fromJSON', map);
  },

  /** @override */
  toJSON: function() {
    return {
      'first_signal_date': this.firstSignalDate,
      'first_signal_time': this.firstSignalTime,
      'last_signal_date': this.lastSignalDate,
      'last_signal_time': this.lastSignalTime,
      'member_count': this.memberCount,
      'signal_count': this.signalCount,
      'loss_count': this.lostSignalCount,
      'profit_count': this.profitableSignalCount,
      'open_count': this.openSignalCount,
      'pl_all_time': this.profitLossRatio,
      'pl_month': this.profitLossRatioMonth,
      'pl_open': this.profitLossRatioOpen,
      'pl_year': this.profitLossRatioYear,
      'tran_duration': this.averageTransactionDuration
    };
  }
});
});  // goog.scope

