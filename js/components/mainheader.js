goog.provide('longa.ui.MainHeader');

goog.require('goog.ui.registry');
goog.require('longa.staticdata');
goog.require('longa.template');
goog.require('pstj.material.Button');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');


/** @extends {pstj.material.Element} */
longa.ui.MainHeader = goog.defineClass(pstj.material.Element, {
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
  },

  selectItem: function(idx) {

  }
});


/** @extends {pstj.material.ElementRenderer} */
longa.ui.MainHeaderRenderer = goog.defineClass(pstj.material.ElementRenderer, {
  constructor: function() {
    pstj.material.ElementRenderer.call(this);
  },

  /** @override */
  getTemplate: function(m) {
    return longa.template.MainHeader(m);
  },

  /** @override */
  generateTemplateData: function(instance) {
    return {
      tiles: longa.staticdata.HeaderTiles
    };
  },

  /** @override */
  getCssClass: function() {
    return longa.ui.MainHeaderRenderer.CSS_CLASS;
  },

  statics: {
    /**
     * @final
     * @type {string}
     */
    CSS_CLASS: goog.getCssName('longa-main-header')
  }
});
goog.addSingletonGetter(longa.ui.MainHeaderRenderer);

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(longa.ui.MainHeader,
    longa.ui.MainHeaderRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    longa.ui.MainHeaderRenderer.CSS_CLASS, function() {
      return new longa.ui.MainHeader(null);
    });
