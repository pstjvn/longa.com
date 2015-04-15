goog.provide('longa.ui.LoginForm');

goog.require('goog.events');
goog.require('goog.style');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.registry');
goog.require('longa.template');
goog.require('longa.ui.ErrorMessage');
goog.require('pstj.material.Button');
goog.require('pstj.material.Checkbox');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.material.EventMap');
goog.require('pstj.material.Input');
goog.require('pstj.material.Shadow');

goog.scope(function() {
var E = pstj.material.Element;
var ER = pstj.material.ElementRenderer;
var UIET = goog.ui.Component.EventType;


/** @extends {E} */
longa.ui.LoginForm = goog.defineClass(E, {
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
    this.setUsePointerAgent(true);
  },

  /** @override */
  enterDocument: function() {
    goog.base(this, 'enterDocument');
    this.getHandler().listen(this.getChildAt(4), UIET.ACTION,
        this.handleSubmit);
  },

  /**
   * Sets/shows the error message.
   * @param {string} message
   */
  setError: function(message) {
    this.getChildAt(0).showMessage(message);
  },

  /**
   * Removes the currently displayed error.
   */
  removeError: function() {
    this.getChildAt(0).hideMessage();
  },

  /**
   * Handles the submit button activation.
   * @param {goog.events.Event} e The synthetic action event.
   * @protected
   */
  handleSubmit: function(e) {
    this.setEnabled(false);
    this.dispatchEvent(longa.ui.LoginForm.EventType.CALL_LOGIN);
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

  /**
   * Completely ignore the state machine and simply enable/disable the
   * button.
   * @override
   */
  setEnabled: function(enable) {
    this.getChildAt(3).setEnabled(enable);
  },

  /**
   * Shows/hides the account recovery link.
   * @param {boolean} enable If true the link will be shown.
   */
  showRecoveryLink: function(enable) {
    goog.style.setElementShown(
        this.getElementByClass(goog.getCssName('linklike')), enable);
  },

  statics: {
    /**
     * The events this component can emit.
     * @enum {string}
     * @final
     */
    EventType: {
      CALL_LOGIN: goog.events.getUniqueId('request-login')
    }
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
