
// This code is auto generate, please do not edit.

goog.provide('longa.gen.dto.SellerBalance');

goog.require('goog.asserts');
goog.require('goog.object');
goog.require('longa.gen.dto.Balance');


goog.scope(function() {
var a = goog.asserts;


/**
 * DTO for Provider Balance as seen by an Investor
 * @extends {longa.gen.dto.Balance}
 */
longa.gen.dto.SellerBalance = goog.defineClass(longa.gen.dto.Balance, {
  constructor: function() {
    longa.gen.dto.Balance.call(this);
    /**
     * The username of the Seller
     * @type {!number}
     */
    this.accountid = 0;
    /**
     * The username of the seller
     * @type {!string}
     */
    this.username = '';
    /**
     * The point per percent charge applied to investors who follow this
     *  seller
     * @type {!number}
     */
    this.pipCharge = 0;
    /**
     * How much credit must an investor have to be able to subscribe to this
     *  seller
     * @type {!number}
     */
    this.minimalCreditToSubscrbe = 0;
    /**
     * If the seller's signals are paid (will charge for profit)
     * @type {!boolean}
     */
    this.paidService = false;
    /**
     * If the currently logged in user is subscribed to this seller
     * @type {!boolean}
     */
    this.subscribed = false;
    /**
     * The url for more detailed information
     * @type {!string}
     */
    this.dataURL = '';
  },

  /**@override */
  fromJSON: function(map) {
    this.accountid = a.assertNumber(map['target_acctid']);
    this.username = a.assertString(map['seller_username']);
    this.pipCharge = a.assertNumber(map['pip_charge']);
    this.minimalCreditToSubscrbe = a.assertNumber(map['service_min_balance']);
    this.paidService = a.assertBoolean(map['service_paid']);
    this.subscribed = a.assertBoolean(map['subscribed']);
    this.dataURL = a.assertString(map['datail_url']);
    goog.base(this, 'fromJSON', map);
  },

  /**@override */
  toJSON: function() {
    var exports = {
      'target_acctid': this.accountid,
      'seller_username': this.username,
      'pip_charge': this.pipCharge,
      'service_min_balance': this.minimalCreditToSubscrbe,
      'service_paid': this.paidService,
      'subscribed': this.subscribed,
      'datail_url': this.dataURL
    };
    return goog.object.extend(exports,
        a.assertObject(goog.base(this, 'toJSON')));
  }
});
});  // goog.scope

