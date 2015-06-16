goog.provide('longa.ui.Balance');
goog.provide('longa.ui.BalanceRenderer');

goog.require('goog.array');
goog.require('goog.ui.registry');
goog.require('longa.ds.Screen');
goog.require('longa.ds.Topic');
goog.require('longa.template');
goog.require('longa.ui.BuyCredit');
goog.require('longa.ui.Pages');
goog.require('longa.ui.PagesRenderer');
goog.require('longa.ui.UserBalance');
goog.require('longa.ui.WithdrawCredit');
goog.require('pstj.control.Control');
goog.require('pstj.material.HeaderPanel');


/** @extends {longa.ui.Pages} */
longa.ui.Balance = goog.defineClass(longa.ui.Pages, {
  /**
   * @param {goog.ui.ControlContent=} opt_content Text caption or DOM structure
   *     to display as the content of the control (if any).
   * @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
   *     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
   * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
   *     document interaction.
   */
  constructor: function(opt_content, opt_renderer, opt_domHelper) {
    longa.ui.Pages.call(this, opt_content, opt_renderer, opt_domHelper);
    this.getController().listen(longa.ds.Topic.SHOW_SCREEN, this.switchScreens);
    this.getController().listen(longa.ds.Topic.USER_BALANCE_CHANGE,
        this.onUserBalanaceChange);
    // prevent the newly logged in user to see the previous user's data.
    this.getController().listen(longa.ds.Topic.USER_AUTH_CHANGED, function() {
      if (!longa.ds.utils.isKnownUser()) {
        this.destroyMainBalanceSheet_();
      }
    });

    this.setUseAnimation(true);
  },

  /**
   * @param {number} screen The screen to switch to.
   * @protected
   */
  switchScreens: function(screen) {
    switch (screen) {
      case longa.ds.Screen.BALANCE:
        this.setSelectedIndex(0);
        break;
      case longa.ds.Screen.BALANCE_BUY:
        this.setSelectedIndex(1);
        break;
      case longa.ds.Screen.BALANCE_WIDHTRAW:
        this.setSelectedIndex(2);
        break;
    }
  },

  /** @protected */
  onUserBalanaceChange: function() {
    this.destroyMainBalanceSheet_();
    if (!goog.isNull(longa.data.balance)) {
      var balance = new longa.ui.UserBalance();
      balance.setModel(longa.data.balance);
      this.getChildAt(0).addChild(balance, true);
    }
  },

  /** @private */
  destroyMainBalanceSheet_: function() {
    if (this.getChildAt(0).hasChildren()) {
      goog.array.forEach(this.getChildAt(0).removeChildren(), function(el) {
        goog.dispose(el);
      });
    }
  }
});


/** @extends {longa.ui.PagesRenderer} */
longa.ui.BalanceRenderer = goog.defineClass(longa.ui.PagesRenderer, {
  constructor: function() {
    longa.ui.PagesRenderer.call(this);
  },

  /** @override */
  getCssClass: function() {
    return longa.ui.BalanceRenderer.CSS_CLASS;
  },

  /** @override */
  getTemplate: function(model) {
    return longa.template.Balance(model);
  },

  /** @override */
  getStructuralCssClass: function() {
    return goog.getCssName('longa-app-pages');
  },

  statics: {
    /**
     * @final
     * @type {string}
     */
    CSS_CLASS: goog.getCssName('longa-app-balance-pages')
  }
});
goog.addSingletonGetter(longa.ui.BalanceRenderer);

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(longa.ui.Balance,
    longa.ui.BalanceRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    longa.ui.BalanceRenderer.CSS_CLASS, function() {
      return new longa.ui.Balance(null);
    });
