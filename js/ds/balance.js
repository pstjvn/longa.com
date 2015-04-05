/**
 * @fileoverview Implemented representation of the balance of any given
 * user on the system.
 *
 * Note that not all fields bear meaning - depending on the user type some
 * might be ignored.
 */

goog.provide('longa.ds.Balance');

goog.require('longa.ds.ProfitLossRatio');
goog.require('longa.ds.User');


goog.scope(function() {
var User = longa.ds.User;
var a = goog.asserts;
var ProfitLossRatio = longa.ds.ProfitLossRatio;


/** @extends {User} */
longa.ds.Balance = goog.defineClass(User, {
  constructor: function() {
    User.call(this);
    /**
     * Current balance of the account - in longa credits.
     * @type {number}
     */
    this.balance = 0;
    /**
     * Cumulative account debit - how much it was debited since its creation.
     * @type {number}
     */
    this.debit = 0;
    /**
     * Current account credit - how much credit it has received since
     * its creation (longa credits).
     * @type {number}
     */
    this.credit = 0;
    /**
     * Cumulative withdrawals made on this account (longa credits).
     * @type {number}
     */
    this.withdrawal = 0;

    /**
     * How many subscribed members does this account have.
     * Applicable only for accounts of type 'Seller'.
     * @type {number}
     */
    this.memberCount = 0;
    /**
     * How many signals did this account published.
     * Applicable only for accounts of type 'seller'.
     * @type {number}
     */
    this.signalCount = 0;
    /**
     * Number of signals that yielded profit after they were closed.
     * @type {number}
     */
    this.profitCount = 0;
    /**
     * Number of signals that had negative profit when closed.
     * @type {number}
     */
    this.lossCount = 0;
    /**
     * Number of signals that are currently opened (i.e. had OPEN but
     * not yet CLOSE).
     * @type {number}
     */
    this.openedCount = 0;
    /**
     * How much does this seller account charge per 1% yield.
     * The charge is calculated based on the profitability of the
     * signal and is deducted from each sunscriber (longa credits).
     * @type {number}
     */
    this.pipCharge = 0;
    /**
     * No info about this one.
     * @type {number}
     */
    this.serviceCharge = 0;
    /**
     * How much did the system debited this account since its creation.
     * System charges are the ones the account pays for profitable
     * signals - ones that the account was subscribed for OPEN, CLOSE and
     * yielded profit > 0.
     * @type {number}
     */
    this.systemCharge = 0;

    /** @type {number} */
    this.transactionDuration = 0;
    /** @type {number} */
    this.maximumAllowedWithdrawal = 0;
    /** @type {!ProfitLossRatio} */
    this.profitLossRatios = new ProfitLossRatio();
  },

  /** @override */
  fromJSON: function(map) {
    this.balance = a.assertNumber(map['balance']);
    this.credit = a.assertNumber(map['credit']);
    this.debit = a.assertNumber(map['debit']);
    this.withdrawal = a.assertNumber(map['withdrawal']);

    // Update the p/l
    this.profitLossRatios.fromJSON(map);

    // seller specific
    if (this.usertype == longa.ds.User.UserType.SELLER) {
      // update values for seller.
    }

    // Create the user bits.
    goog.base(this, 'fromJSON', map);

    // override this one to the correct value
    this.acctid = a.assertNumber(map['target_acctid']);
  }
});

});  // goog.scope
