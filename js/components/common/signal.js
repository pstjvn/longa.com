goog.provide('longa.ui.Signal');
goog.provide('longa.ui.SignalRenderer');

goog.require('goog.ui.registry');
goog.require('longa.template');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');


/** @extends {pstj.material.Element} */
longa.ui.Signal = goog.defineClass(pstj.material.Element, {
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
longa.ui.SignalRenderer = goog.defineClass(pstj.material.ElementRenderer, {
  constructor: function() {
    pstj.material.ElementRenderer.call(this);
  },

  /** @override */
  getCssClass: function() {
    return longa.ui.SignalRenderer.CSS_CLASS;
  },

  /** @override */
  generateTemplateData: function(instance) {
    return goog.asserts.assertInstanceof(instance.getModel(),
        longa.gen.dto.Signal);
  },

  /** @override */
  getTemplate: function(model) {
    return longa.template.Signal(model);
  },

  statics: {
    /**
     * @final
     * @type {string}
     */
    CSS_CLASS: goog.getCssName('longa-app-signal-record')
  }
});
goog.addSingletonGetter(longa.ui.SignalRenderer);

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(longa.ui.Signal,
    longa.ui.SignalRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    longa.ui.SignalRenderer.CSS_CLASS, function() {
      return new longa.ui.Signal(null);
    });
