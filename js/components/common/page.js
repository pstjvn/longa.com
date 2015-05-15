goog.provide('longa.ui.Page');

goog.require('goog.array');
goog.require('goog.ui.Component.State');
goog.require('goog.ui.registry');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');


/** @extends {pstj.material.Element} */
longa.ui.Page = goog.defineClass(pstj.material.Element, {
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
    this.setSupportedState(goog.ui.Component.State.SELECTED, true);
  },

  /**
   * Intentionally dispose of the children, we are not going to use them again.
   * @override
   */
  removeChildren: function() {
    var children = goog.base(this, 'removeChildren');
    goog.array.forEach(children, function(component) {
      goog.dispose(component);
    });
    return children;
  }
});


/** @extends {pstj.material.ElementRenderer} */
longa.ui.PageRenderer = goog.defineClass(pstj.material.ElementRenderer, {
  constructor: function() {
    pstj.material.ElementRenderer.call(this);
  },

  /** @override */
  getCssClass: function() {
    return longa.ui.PageRenderer.CSS_CLASS;
  },

  /** @override */
  getTemplate: function(model) {
    return longa.template.Page(model);
  },

  statics: {
    /**
     * @final
     * @type {string}
     */
    CSS_CLASS: goog.getCssName('longa-app-page')
  }
});
goog.addSingletonGetter(longa.ui.PageRenderer);

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(longa.ui.Page,
    longa.ui.PageRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    longa.ui.PageRenderer.CSS_CLASS, function() {
      return new longa.ui.Page(null);
    });
