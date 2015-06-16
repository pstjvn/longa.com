
// This code is auto generate, please do not edit.

goog.provide('longa.gen.dto.UserBalance');

goog.require('goog.asserts');
goog.require('goog.object');
goog.require('longa.gen.dto.Balance');


goog.scope(function() {
var a = goog.asserts;


/**
 * DTO for User balance as seen for self user
 * @extends {longa.gen.dto.Balance}
 */
longa.gen.dto.UserBalance = goog.defineClass(longa.gen.dto.Balance, {
  constructor: function() {
    longa.gen.dto.Balance.call(this);
    /**
     * The current balance of the account
     * @type {!number}
     */
    this.balance = 0;
    /**
     * All time credit
     * @type {!number}
     */
    this.credit = 0;
    /**
     * All time debit
     * @type {!number}
     */
    this.debit = 0;
    /**
     * All time widthrawal
     * @type {!number}
     */
    this.withdrawal = 0;
    /**
     * The maximum amout of withdrawal at once
     * @type {!number}
     */
    this.maximumWithdrawal = 0;
    /**
     * How much was payed in PIP charges for all time
     * @type {!number}
     */
    this.allTimeChargesForProfit = 0;
    /**
     * ???
     * @type {!number}
     */
    this.systemCharges = 0;
    /**
     * ???
     * @type {!number}
     */
    this.serviceCharges = 0;
    /**
     * The usertype, 0 is unknown, 1 is investor, 2 is seller
     * @type {!string}
     */
    this.usertype = '';
  },

  /** @override */
  fromJSON: function(map) {
    this.balance = a.assertNumber(map['balance']);
    this.credit = a.assertNumber(map['credit']);
    this.debit = a.assertNumber(map['debit']);
    this.withdrawal = a.assertNumber(map['withdrawal']);
    this.maximumWithdrawal = a.assertNumber(map['max_withdrawal']);
    this.allTimeChargesForProfit = a.assertNumber(map['pip_charge']);
    this.systemCharges = a.assertNumber(map['system_charge']);
    this.serviceCharges = a.assertNumber(map['service_charge']);
    this.usertype = a.assertString(map['usertype']);
    goog.base(this, 'fromJSON', map);
  },

  /** @override */
  toJSON: function() {
    var exports = {
      'balance': this.balance,
      'credit': this.credit,
      'debit': this.debit,
      'withdrawal': this.withdrawal,
      'max_withdrawal': this.maximumWithdrawal,
      'pip_charge': this.allTimeChargesForProfit,
      'system_charge': this.systemCharges,
      'service_charge': this.serviceCharges,
      'usertype': this.usertype
    };
    goog.object.extend(exports,
        a.assertObject(goog.base(this, 'toJSON')));
    return exports;
  }
});
});  // goog.scope

