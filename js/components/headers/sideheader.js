goog.provide('longa.ui.SideHeader');

goog.require('goog.ui.registry');
goog.require('longa.template');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');


/** @extends {pstj.material.Element} */
longa.ui.SideHeader = goog.defineClass(pstj.material.Element, {
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
longa.ui.SideHeaderRenderer = goog.defineClass(pstj.material.ElementRenderer, {
  constructor: function() {
    pstj.material.ElementRenderer.call(this);
  },

  /** @override */
  getTemplate: function() {
    return longa.template.SideHeader();
  },

  /** @override */
  getCssClass: function() {
    return longa.ui.SideHeaderRenderer.CSS_CLASS;
  },

  statics: {
    /**
     * @final
     * @type {string}
     */
    CSS_CLASS: goog.getCssName('longa-side-header')
  }
});
goog.addSingletonGetter(longa.ui.SideHeaderRenderer);

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(longa.ui.SideHeader,
    longa.ui.SideHeaderRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    longa.ui.SideHeaderRenderer.CSS_CLASS, function() {
      return new longa.ui.SideHeader(null);
    });
