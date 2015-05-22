goog.provide('longa.ui.Alert');

goog.require('goog.ui.registry');
goog.require('longa.gen.dto.Alert');
goog.require('longa.template');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');


/** @extends {pstj.material.Element} */
longa.ui.Alert = goog.defineClass(pstj.material.Element, {
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

  /**
   * @override
   * @return {longa.gen.dto.Alert}
   */
  getModel: function() {
    var model = goog.base(this, 'getModel');
    if (goog.isDefAndNotNull(model)) {
      return goog.asserts.assertInstanceof(model, longa.gen.dto.Alert);
    } else {
      return null;
    }
  }
});


/** @extends {pstj.material.ElementRenderer} */
longa.ui.AlertRenderer = goog.defineClass(pstj.material.ElementRenderer, {
  constructor: function() {
    pstj.material.ElementRenderer.call(this);
  },

  /** @override */
  getCssClass: function() {
    return longa.ui.AlertRenderer.CSS_CLASS;
  },

  /** @override */
  getTemplate: function(model) {
    var data = goog.asserts.assertInstanceof(
        (goog.asserts.assertInstanceof(model.alert, longa.ui.Alert))
            .getModel(), longa.gen.dto.Alert);

    return longa.template.Alert(data);
  },

  /** @override */
  generateTemplateData: function(instance) {
    return {
      alert: instance
    };
  },

  statics: {
    /**
     * @final
     * @type {string}
     */
    CSS_CLASS: goog.getCssName('longa-app-alert')
  }
});
goog.addSingletonGetter(longa.ui.AlertRenderer);

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(longa.ui.Alert,
    longa.ui.AlertRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    longa.ui.AlertRenderer.CSS_CLASS, function() {
      return new longa.ui.Alert(null);
    });
