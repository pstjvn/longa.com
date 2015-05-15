goog.provide('longa.ui.Balance');

goog.require('goog.asserts');
goog.require('goog.log');
goog.require('goog.ui.registry');
goog.require('longa.gen.dto.UserBalance');
goog.require('longa.ui.CustomTrend');
goog.require('pstj.material.Button');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.material.RadioButton');
goog.require('pstj.material.RadioGroup');


/** @extends {pstj.material.Element} */
longa.ui.Balance = goog.defineClass(pstj.material.Element, {
  /**
   * @param {goog.ui.ControlContent=} opt_content Text caption or DOM structure
   *     to display as the content of the control (if any).
   * @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
   *     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
   * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
   *     document interaction.
   */
  constructor: function(opt_content, opt_renderer, opt_domHelper) {
    pstj.material.Element.call(this, opt_content, opt_renderer, opt_domHelper);
  }
});


/** @extends {pstj.material.ElementRenderer} */
longa.ui.BalanceRenderer = goog.defineClass(pstj.material.ElementRenderer, {
  constructor: function() {
    pstj.material.ElementRenderer.call(this);
    /**
     * @private
     * @type {goog.debug.Logger}
     */
    this.logger_ = goog.log.getLogger('longa.ui.BalanceRenderer');
  },

  /** @override */
  getCssClass: function() {
    return longa.ui.BalanceRenderer.CSS_CLASS;
  },

  /** @override */
  getTemplate: function(model) {
    return longa.template.UserBalance(model);
  },

  /** @override */
  generateTemplateData: function(instance) {
    var model = instance.getModel();
    if (!goog.isNull(model)) {
      return goog.asserts.assertInstanceof(model, longa.gen.dto.UserBalance);
    } else if (!goog.isNull(longa.data.balance)) {
      return goog.asserts.assertInstanceof(longa.data.balance,
          longa.gen.dto.UserBalance);
    } else {
      goog.log.warning(this.logger_, 'Rendering Balance sheet with empty data');
      return new longa.gen.dto.UserBalance();
    }
  },

  getStructuralCssClass: function() {
    return goog.getCssName('longa-app-balance');
  },

  statics: {
    /**
     * @final
     * @type {string}
     */
    CSS_CLASS: goog.getCssName('longa-app-user-balance')
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
