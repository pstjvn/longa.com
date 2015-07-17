goog.provide('longa.ui.WithdrawCredit');
goog.provide('longa.ui.WithdrawCreditRenderer');

goog.require('goog.ui.registry');
goog.require('longa.control.Toaster');
goog.require('longa.strings');
goog.require('longa.template');
goog.require('longa.ui.BuyCredit');
goog.require('longa.ui.BuyCreditRenderer');


/** @extends {longa.ui.BuyCredit} */
longa.ui.WithdrawCredit = goog.defineClass(longa.ui.BuyCredit, {
  /**
   * @param {goog.ui.ControlContent=} opt_content Text caption or DOM structure
   *     to display as the content of the control (if any).
   * @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
   *     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
   * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
   *     document interaction.
   */
  constructor: function(opt_content, opt_renderer, opt_domHelper) {
    longa.ui.BuyCredit.call(this, opt_content, opt_renderer, opt_domHelper);
    /** @override */
    this.ownScreen = longa.ds.Screen.BALANCE_WIDHTRAW;
    /**
     * Store the last amount we are operating on.
     * @type {!number}
     * @private
     */
    this.lastAmount_ = 0;
  },

  /** @override */
  submitHandler: function() {
    if (this.getInput().isValid() && !this.getInput().isEmpty()) {
      this.getSubmitButton().setEnabled(false);
      this.lastAmount_ = this.getAmount();
      longa.control.Exchange.getInstance()
          .withdrawCredit(this.lastAmount_)
          .then(this.onWithdraw_, null, this)
          .thenAlways(this.restoreButton, this);
    }
  },

  /**
   * Handles successful withdrawal.
   * @private
   */
  onWithdraw_: function() {
    longa.control.Toaster.getInstance().addToast(
        longa.strings.onWithdrawSuccess({
          amount: this.lastAmount_
        }).toString(), null, null);
  }
});


/** @extends {longa.ui.BuyCreditRenderer} */
longa.ui.WithdrawCreditRenderer = goog.defineClass(longa.ui.BuyCreditRenderer, {
  constructor: function() {
    longa.ui.BuyCreditRenderer.call(this);
  },

  /** @override */
  getCssClass: function() {
    return longa.ui.WithdrawCreditRenderer.CSS_CLASS;
  },

  /** @override */
  getTemplate: function(model) {
    return longa.template.ExchangeForm({
      withdraw: true
    });
  },

  /** @override */
  getStructuralCssClass: function() {
    return goog.getCssName('longa-app-buy-credit');
  },

  statics: {
    /**
     * @final
     * @type {string}
     */
    CSS_CLASS: goog.getCssName('longa-app-withdraw')
  }
});
goog.addSingletonGetter(longa.ui.WithdrawCreditRenderer);

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(longa.ui.WithdrawCredit,
    longa.ui.WithdrawCreditRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    longa.ui.WithdrawCreditRenderer.CSS_CLASS, function() {
      return new longa.ui.WithdrawCredit(null);
    });
