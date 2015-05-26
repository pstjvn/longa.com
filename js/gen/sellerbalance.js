
// This code is auto generate, please do not edit.

goog.provide('longa.gen.dto.SellerBalance');

goog.require('goog.asserts');
goog.require('goog.object');
goog.require('longa.gen.dto.Balance');


goog.scope(function() {
var a = goog.asserts;


/**
 * DTO for seller balance sheet
 * @extends {longa.gen.dto.Balance}
 */
longa.gen.dto.SellerBalance = goog.defineClass(longa.gen.dto.Balance, {
  constructor: function() {
    longa.gen.dto.Balance.call(this);
    /** @type {!number} */
    this.accountid = 0;
    /**
     * The profit charge per point.
     * @type {!number}
     */
    this.charge = 0;
    /**
     * The username of the signal seller.
     * @type {!string}
     */
    this.username = '';
    /**
     * The minimum balance required to use the service.
     * @type {!number}
     */
    this.minimumRequiredBalance = 0;
    /** @type {!boolean} */
    this.isPaid = false;
    /** @type {!boolean} */
    this.isSubscribed = false;
  },

  /** @override */
  fromJSON: function(map) {
    this.accountid = a.assertNumber(map['target_acctid']);
    this.charge = a.assertNumber(map['pip_charge']);
    this.username = a.assertString(map['seller_username']);
    this.minimumRequiredBalance = a.assertNumber(map['service_min_balance']);
    this.isPaid = a.assertBoolean(map['service_paid']);
    this.isSubscribed = a.assertBoolean(map['subscribed']);
    goog.base(this, 'fromJSON', map);
  },

  /** @override */
  toJSON: function() {
    var exports = {
      'target_acctid': this.accountid,
      'pip_charge': this.charge,
      'seller_username': this.username,
      'service_min_balance': this.minimumRequiredBalance,
      'service_paid': this.isPaid,
      'subscribed': this.isSubscribed
    };
    goog.object.extend(exports,
        a.assertObject(goog.base(this, 'toJSON')));
    return exports;
  }
});
});  // goog.scope

