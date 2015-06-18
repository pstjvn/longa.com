goog.provide('longa.ui.SSL');
goog.provide('longa.ui.SSLRenderer');

goog.require('goog.ui.registry');
goog.require('longa.data');
goog.require('longa.ds.Signals');
goog.require('longa.template');
goog.require('longa.ui.ListHeader');
goog.require('longa.ui.Page');
goog.require('longa.ui.PageRenderer');
goog.require('pstj.material.HeaderPanel');


/** @extends {longa.ui.Page} */
longa.ui.SSL = goog.defineClass(longa.ui.Page, {
  /**
   * @param {goog.ui.ControlContent=} opt_content Text caption or DOM structure
   *     to display as the content of the control (if any).
   * @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
   *     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
   * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
   *     document interaction.
   */
  constructor: function(opt_content, opt_renderer, opt_domHelper) {
    longa.ui.Page.call(this, opt_content, opt_renderer, opt_domHelper);
  },

  /**
   * Add model instance to both the list and the header so they can work
   * in synchron. Also utilize global model for list and assume controller
   * for signals will manage that.
   * @override
   */
  addMaterialChildren: function() {
    goog.base(this, 'addMaterialChildren');
    var model = new longa.ds.Signals(longa.data.currentSellerList);
    this.getChildAt(0)
        .getChildAt(0)
        .getChildAt(0).setModel(model);
    this.getChildAt(0)
        .getChildAt(1)
        .getChildAt(0).setModel(model);
  }
});


/** @extends {longa.ui.PageRenderer} */
longa.ui.SSLRenderer = goog.defineClass(longa.ui.PageRenderer, {
  constructor: function() {
    longa.ui.PageRenderer.call(this);
  },

  /** @override */
  getCssClass: function() {
    return longa.ui.SSLRenderer.CSS_CLASS;
  },

  /** @override */
  getStructuralCssClass: function() {
    return longa.ui.PageRenderer.CSS_CLASS;
  },

  /** @override */
  getTemplate: function(model) {
    return longa.template.SellerSignalList(model);
  },

  statics: {
    /**
     * @final
     * @type {string}
     */
    CSS_CLASS: goog.getCssName('longa-app-seller-signals-page')
  }
});
goog.addSingletonGetter(longa.ui.SSLRenderer);

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(longa.ui.SSL,
    longa.ui.SSLRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    longa.ui.SSLRenderer.CSS_CLASS, function() {
      return new longa.ui.SSL(null);
    });
