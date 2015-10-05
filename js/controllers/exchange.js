goog.provide('longa.control.Exchange');

goog.require('goog.Uri');
goog.require('longa.control.Auth');
goog.require('longa.rpc');
goog.require('longa.signals');
goog.require('longa.strings');
goog.require('pstj.control.Control');


/** @extends {pstj.control.Control} */
longa.control.Exchange = goog.defineClass(pstj.control.Control, {
  constructor: function() {
    pstj.control.Control.call(this);
    /**
     * Reference the amount wa want to use in paypal.
     * @private
     * @type {number}
     */
    this.lastAmount_ = 0;
    this.init();
  },

  /**
   * Purchase LCs.
   * @param {!number} amount
   * @return {!goog.Promise<!string>} A promise transformed to one that
   * resolves with a string.
   */
  buyCredit: function(amount) {
    this.lastAmount_ = amount;
    return longa.rpc.buyCredit(amount)
        .then(this.handleBuy_, this.handleBuyFail_, this);
  },

  /**
   * @private
   * @param {!longa.gen.dto.BuyCreditResponse} response
   * @return {!string} The generated URL for redirect.
   */
  handleBuy_: function(response) {
    var key = longa.control.Auth.getInstance().getPPRecoverKey();
    return this.generatePayPalURI_(response, key);
  },

  /**
   * FROM PAYPAL HELP DESK:
   *
   * For the "return" variable to work properly, you must first enable Auto
   * Return in your PayPal Account.
   * "Auto Return" immediately brings your buyers back to your specified
   * URL upon payment completion. This feature replaces the standard PayPal
   * hosted "Payment Done" page with a page hosted on your website.
   *
   * To set up Auto Return, you need to turn it on in your Account Profile
   * and enter the return URL that will be used to redirect your buyers back
   * to your site.
   *
   * Log in to your Account
   * Select "Edit Profile"
   * Under "Selling Preferences"
   * Select "Website Payment Preferences"
   * Note first option - Select "On" - Auto Return for Website Payments
   * Enter the Return URL.
   * Click "Save."
   *
   * The Return URL specified in your PayPal Account is good
   * for all transactions however, you can override this by using the "return"
   * variable in your individual item button code and direct the buyer
   * to a different URL. Note, the line of code should look something like
   * this example:
   *
   * Generate a viable paypal payment URI.
   * @param {!longa.gen.dto.BuyCreditResponse} ppdetails
   * @param {!string} key Recover key.
   * @private
   * @return {!string}
   */
  generatePayPalURI_: function(ppdetails, key) {
    var uri = new goog.Uri();
    uri.setScheme('http')
        .setDomain('www.paypal.com')
        .setPath('/cgi-bin/websrc')
        .setParameterValue('cmd', '_xclick')
        .setParameterValue('billing_type', '2')
        .setParameterValue('business', 'paypal@edge4trade.com')
        .setParameterValue('item_name', 'Longa credit')
        .setParameterValue('quantity', this.lastAmount_.toString())
        .setParameterValue('amount', '1')
        .setParameterValue('no_note', '1')
        .setParameterValue('no_shipping', '1')
        .setParameterValue('ipn_test', '1')
        .setParameterValue('currency_code', 'USD')
        .setParameterValue('custom', ppdetails.sid)
        .setParameterValue('invoice', ppdetails.invoiceId)
        .setParameterValue('notify_url', 'http://' + ppdetails.server +
            '/cgi-bin/paypal.cgi')
        .setParameterValue('cancel_return', 'http://' +
            ppdetails.server + '/longa/build.html?key=' + key + '&a=cancel')
        .setParameterValue('return', 'http://' +
            ppdetails.server + '/longa/build.html?key=' + key +
            '&a=ok&amount=' + this.lastAmount_.toString())
        .setParameterValue('rm', '1');

    return goog.asserts.assertString(uri.toString());
  },

  /**
   * @private
   * @param {?} err OPtional error.
   */
  handleBuyFail_: function(err) {
    longa.control.Toaster.getInstance().addToast(
        longa.strings.cannotCretePaypalTransaction(null).toString(),
        null, null);
  },

  /**
   * Request a withdrawal of money from the account.
   * @param {!number} amount How much LC to convert to money.
   * @return {!goog.Promise<boolean>}
   */
  withdrawCredit: function(amount) {
    return longa.rpc.withdrawCredit(amount);
  },

  /**
   * Manage subscribption for an account.
   * @param {!boolean} sub If true, subscribe, else unsubscribe.
   * @param {!number} acctid The account id to subscribe to.
   * @return {!goog.Promise<!boolean>}
   */
  subscribe: function(sub, acctid) {
    if (sub) {
      return longa.rpc.subscribe(acctid).then(function() {
        longa.signals.get();
        return true;
      });
    } else {
      return longa.rpc.unsubscribe(acctid).then(function() {
        longa.signals.get();
        return true;
      });
    }
  }
});
goog.addSingletonGetter(longa.control.Exchange);
