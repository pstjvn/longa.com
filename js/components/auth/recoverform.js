goog.provide('longa.ui.RecoverForm');

goog.require('goog.ui.registry');
goog.require('longa.template');
goog.require('longa.ui.ErrorMessage');
goog.require('longa.ui.Form');
goog.require('pstj.material.Button');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.material.Input');
goog.require('pstj.material.Shadow');

goog.scope(function() {
var E = longa.ui.Form;
var ER = pstj.material.ElementRenderer;


/** @extends {E} */
longa.ui.RecoverForm = goog.defineClass(E, {
  /**
   * @param {goog.ui.ControlContent=} opt_content Text caption or DOM structure
   *     to display as the content of the control (if any).
   * @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
   *     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
   * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
   *     document interaction.
   */
  constructor: function(opt_content, opt_renderer, opt_domHelper) {
    E.call(this, opt_content, opt_renderer, opt_domHelper);

    // Use pointer for internal links
    this.setUsePointerAgent(true);
  },

  /**
   * Check is the recovery input is valid.
   * @return {boolean}
   */
  isValid: function() {
    return this.getChildAt(1).isValid();
  },

  /**
   * Retrieves the email entered by the user.
   * @return {string}
   */
  getEmail: function() {
    return (goog.asserts.assertInstanceof(this.getChildAt(1),
        pstj.material.Input)).getValue();
  },

  /** @override */
  getActionButton: function() {
    return goog.asserts.assertInstanceof(this.getChildAt(2),
        pstj.material.Button);
  }
});


/** @extends {ER} */
longa.ui.RecoverFormRenderer = goog.defineClass(ER, {
  constructor: function() {
    ER.call(this);
  },

  /** @override */
  getCssClass: function() {
    return longa.ui.RecoverFormRenderer.CSS_CLASS;
  },

  /** @override */
  getTemplate: function(model) {
    return longa.template.RecoverForm(model);
  },

  statics: {
    CSS_CLASS: goog.getCssName('longa-recover-form')
  }
});

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(longa.ui.RecoverForm,
    longa.ui.RecoverFormRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    longa.ui.RecoverFormRenderer.CSS_CLASS, function() {
      return new longa.ui.RecoverForm(null);
    });

});  // goog.scope
