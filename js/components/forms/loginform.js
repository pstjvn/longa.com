goog.provide('longa.ui.LoginForm');
goog.provide('longa.ui.LoginFormRenderer');


goog.require('goog.style');
goog.require('goog.ui.registry');
goog.require('longa.template');
goog.require('longa.ui.Form');
goog.require('pstj.material.Button');
goog.require('pstj.material.Checkbox');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.material.Input');
goog.require('pstj.material.Shadow');

goog.scope(function() {
var F = longa.ui.Form;
var ER = pstj.material.ElementRenderer;


/** @extends {F} */
longa.ui.LoginForm = goog.defineClass(F, {
  /**
   * @param {goog.ui.ControlContent=} opt_content Text caption or DOM structure
   *     to display as the content of the control (if any).
   * @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
   *     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
   * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
   *     document interaction.
   */
  constructor: function(opt_content, opt_renderer, opt_domHelper) {
    F.call(this, opt_content, opt_renderer, opt_domHelper);

    // We need this because of internal links
    this.setUsePointerAgent(true);
  },

  /**
   * Check is the login input are valid.
   * @return {boolean}
   */
  isValid: function() {
    return this.getChildAt(1).isValid() && this.getChildAt(2).isValid();
  },

  /**
   * Retrieves the username entered by the user.
   * @return {string}
   */
  getUsername: function() {
    return (goog.asserts.assertInstanceof(this.getChildAt(1),
        pstj.material.Input)).getValue();
  },

  /**
   * Retrieves the password entered by the user.
   * @return {string}
   */
  getPassword: function() {
    return (goog.asserts.assertInstanceof(this.getChildAt(2),
        pstj.material.Input)).getValue();
  },

  /**
   * Checks if the user wants to preserv the credentials and be auto logged
   * next time.
   * @return {boolean}
   */
  isKeepCredentials: function() {
    return (goog.asserts.assertInstanceof(this.getChildAt(3),
        pstj.material.Checkbox)).isChecked();
  },

  /** @override */
  getActionButton: function() {
    return goog.asserts.assertInstanceof(this.getChildAt(4),
        pstj.material.Button);
  },

  /** @override */
  setEnabled: function(enable) {
    this.getActionButton().setEnabled(enable);
  },

  /**
   * Shows/hides the account recovery link.
   * @param {boolean} enable If true the link will be shown.
   */
  showRecoveryLink: function(enable) {
    goog.style.setElementShown(
        this.getElementByClass(goog.getCssName('linklike')), enable);
  }
});


/** @extends {ER} */
longa.ui.LoginFormRenderer = goog.defineClass(ER, {
  constructor: function() {
    ER.call(this);
  },

  /** @override */
  getCssClass: function() {
    return longa.ui.LoginFormRenderer.CSS_CLASS;
  },

  /** @override */
  getTemplate: function(model) {
    return longa.template.LoginForm(model);
  },

  statics: {
    CSS_CLASS: goog.getCssName('longa-login-form')
  }
});

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(longa.ui.LoginForm,
    longa.ui.LoginFormRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    longa.ui.LoginFormRenderer.CSS_CLASS, function() {
      return new longa.ui.LoginForm(null);
    });

});  // goog.scope
