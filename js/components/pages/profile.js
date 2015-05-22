goog.provide('longa.ui.Profile');

goog.require('goog.ui.registry');
goog.require('longa.ui.Form');
goog.require('pstj.material.ElementRenderer');


/** @extends {longa.ui.Form} */
longa.ui.Profile = goog.defineClass(longa.ui.Form, {
  /**
   * @param {goog.ui.ControlContent=} opt_content Text caption or DOM structure
   *     to display as the content of the control (if any).
   * @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
   *     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
   * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
   *     document interaction.
   */
  constructor: function(opt_content, opt_renderer, opt_domHelper) {
    longa.ui.Form.call(this, opt_content, opt_renderer, opt_domHelper);
  }
});


/** @extends {pstj.material.ElementRenderer} */
longa.ui.ProfileRenderer = goog.defineClass(pstj.material.ElementRenderer, {
  constructor: function() {
    pstj.material.ElementRenderer.call(this);
  },

  /** @override */
  getCssClass: function() {
    return longa.ui.ProfileRenderer.CSS_CLASS;
  },

  /** @override */
  getTemplate: function(model) {
    return longa.template.RegistrationForm({
      registration: false
    });
  },

  /** @inheritDoc */
  getStructuralCssClass: function() {
    return goog.getCssName('longa-registration-form');
  },

  statics: {
    /**
     * @final
     * @type {string}
     */
    CSS_CLASS: goog.getCssName('longa-app-profile')
  }
});
goog.addSingletonGetter(longa.ui.ProfileRenderer);

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(longa.ui.Profile,
    longa.ui.ProfileRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    longa.ui.ProfileRenderer.CSS_CLASS, function() {
      return new longa.ui.Profile(null);
    });
