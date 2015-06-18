goog.provide('longa.ui.ProviderBalance');
goog.provide('longa.ui.ProviderBalanceRenderer');

goog.require('goog.async.Delay');
goog.require('goog.log');
goog.require('goog.ui.registry');
goog.require('longa.ds.Screen');
goog.require('longa.ds.Topic');
goog.require('longa.gen.dto.SellerBalance');
goog.require('longa.signals');
goog.require('longa.template');
goog.require('longa.ui.UserBalance');
goog.require('longa.ui.UserBalanceRenderer');


/** @extends {longa.ui.UserBalance} */
longa.ui.ProviderBalance = goog.defineClass(longa.ui.UserBalance, {
  /**
   * @param {goog.ui.ControlContent=} opt_content Text caption or DOM structure
   *     to display as the content of the control (if any).
   * @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
   *     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
   * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
   *     document interaction.
   */
  constructor: function(opt_content, opt_renderer, opt_domHelper) {
    longa.ui.UserBalance.call(this, opt_content, opt_renderer, opt_domHelper);
    /**
     * @final
     * @type {!goog.async.Delay}
     * @private
     */
    this.delay_ = new goog.async.Delay(function() {
      this.getController().push(longa.ds.Topic.SHOW_SCREEN,
          longa.ds.Screen.FEED_SIGNALS);
    }, 100, this);
  },

  /** @override */
  getRenderer: function() {
    return goog.asserts.assertInstanceof(goog.base(this, 'getRenderer'),
        longa.ui.ProviderBalanceRenderer);
  },

  /** @inheritDoc */
  getAccountID: function() {
    if (!goog.isNull(this.getModel())) {
      return /** @type {!longa.gen.dto.SellerBalance} */(
          this.getModel()).accountid;
    } else {
      throw new Error('No model found to extract account from');
    }
  },

  /** @inheritDoc */
  handleAction: function(e) {
    var button = goog.asserts.assertInstanceof(e.target, pstj.material.Button);
    switch (button.getAction()) {
      case 'signals':
        longa.signals.getForAccount(this.getAccountID()).then(function() {
          this.delay_.start();
        }, null, this);
        break;
      default: throw new Error('Unknown action:' + button.getAction());
    }
  }
});


/** @extends {longa.ui.UserBalanceRenderer} */
longa.ui.ProviderBalanceRenderer = goog.defineClass(
    longa.ui.UserBalanceRenderer, {
      constructor: function() {
        longa.ui.UserBalanceRenderer.call(this);
      },

      /** @override */
      logger: goog.log.getLogger('longa.ui.ProviderBalanceRenderer'),

      /** @override */
      getCssClass: function() {
        return longa.ui.ProviderBalanceRenderer.CSS_CLASS;
      },

      /** @override */
      getTemplate: function(model) {
        return longa.template.ProviderBalance(
            goog.asserts.assertInstanceof(model, longa.gen.dto.SellerBalance));
      },

      /** @inheritDoc */
      getStructuralCssClass: function() {
        return goog.getCssName('longa-app-balance');
      },

      /** @override */
      generateTemplateData: function(instance) {
        var model = instance.getModel();
        if (!goog.isNull(model)) {
          return goog.asserts.assertInstanceof(model,
              longa.gen.dto.SellerBalance);
        } else {
          goog.log.warning(this.logger,
              'Rendering Provider Balance sheet with empty data');
          return new longa.gen.dto.SellerBalance();
        }
      },

      statics: {
        /**
         * @final
         * @type {string}
         */
        CSS_CLASS: goog.getCssName('longa-app-provider-balance')
      }
    });
goog.addSingletonGetter(longa.ui.ProviderBalanceRenderer);

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(longa.ui.ProviderBalance,
    longa.ui.ProviderBalanceRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    longa.ui.ProviderBalanceRenderer.CSS_CLASS, function() {
      return new longa.ui.ProviderBalance(null);
    });
