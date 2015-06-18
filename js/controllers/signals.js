goog.provide('longa.control.Signals');
goog.provide('longa.signals');

goog.require('longa.control.Toaster');
goog.require('longa.data');
goog.require('longa.gen.dto.Signals');
goog.require('longa.rpc');
goog.require('pstj.control.Control');


/** @extends {pstj.control.Control} */
longa.control.Signals = goog.defineClass(pstj.control.Control, {
  constructor: function() {
    pstj.control.Control.call(this);
    this.init();
  },

  /** @override */
  init: function() {
    goog.base(this, 'init');
    // Clear the list of signals when user logs out so we do not accidentally
    // show signals to another user.
    this.listen(longa.ds.Topic.USER_AUTH_CHANGED, function() {
      longa.data.mysignals.fromJSON(/** @type {Object<string, *>} */(
          (new longa.gen.dto.Signals()).toJSON()));
    });
  },

  /**
   * Retrieve logged account's signals.
   * @return {!goog.Promise<!longa.gen.dto.Signals>}
   */
  get: function() {
    return longa.rpc.getSignals()
        .then(this.onOwnSignals, this.onOwnSignalsFail, this);
  },

  /**
   * Retrieves the signals list for an account by its ID.
   * @param {!number} acctid The account id to use.
   * @return {!goog.Promise<!longa.gen.dto.Signals>}
   */
  getForAccount: function(acctid) {
    // Clear original DTO.
    longa.data.currentSellerList.fromJSON(/** @type {Object<string, *>} */(
        (new longa.gen.dto.Signals()).toJSON()));
    return longa.rpc.getSignals(acctid).then(this.handleSellerSignals,
        null, this);
  },

  /**
   * Handles the receiving of signals for specific account.
   * This will override the currently stored remote account signal data.
   *
   * @protected
   * @param {!longa.gen.dto.Signals} signals
   * @return {!longa.gen.dto.Signals}
   */
  handleSellerSignals: function(signals) {
    console.log('Update seller signals', signals.signals.length);
    longa.data.currentSellerList.fromJSON(/** @type {Object<string, *>} */(
        signals.toJSON()));
    return signals;
  },

  /**
   * Add new signal.
   * @param {!longa.gen.dto.NewSignal} request
   */
  addSignal: function(request) {
    request.run = 'open_signal';
    return longa.rpc.addSignal(request);
  },

  /**
   * @protected
   * @param {!longa.gen.dto.Signals} signals
   * @return {!longa.gen.dto.Signals}
   */
  onOwnSignals: function(signals) {
    longa.data.mysignals.fromJSON(/** @type {!Object<string, *>} */(
        signals.toJSON()));
    return signals;
  },

  /**
   * Handles the signal retrieval failure.
   * @param {*} e The error if any.
   */
  onOwnSignalsFail: function(e) {
    if (e instanceof Error) {
      longa.control.Toaster.getInstance().addToast(e.message, null, null);
    }
  }
});


/**
 * Provide global singleton for accessing the signals controller.
 * @type {longa.control.Signals}
 * @const
 */
longa.signals = new longa.control.Signals();
