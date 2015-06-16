goog.provide('longa.ui.Terms');
goog.provide('longa.ui.TermsRenderer');

goog.require('goog.ui.registry');
goog.require('longa.template');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');


/** @extends {pstj.material.Element} */
longa.ui.Terms = goog.defineClass(pstj.material.Element, {
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
    this.setAllowTextSelection(true);
  }
});


/** @extends {pstj.material.ElementRenderer} */
longa.ui.TermsRenderer = goog.defineClass(pstj.material.ElementRenderer, {
  constructor: function() {
    pstj.material.ElementRenderer.call(this);
  },

  /** @override */
  getCssClass: function() {
    return longa.ui.TermsRenderer.CSS_CLASS;
  },

  /** @override */
  getTemplate: function(model) {
    return longa.template.Terms(model);
  },

  statics: {
    /**
     * @final
     * @type {string}
     */
    CSS_CLASS: goog.getCssName('longa-app-terms')
  }
});
goog.addSingletonGetter(longa.ui.TermsRenderer);

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(longa.ui.Terms,
    longa.ui.TermsRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    longa.ui.TermsRenderer.CSS_CLASS, function() {
      return new longa.ui.Terms(null);
    });
