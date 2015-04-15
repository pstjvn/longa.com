goog.provide('longa.ui.RegistrationForm');

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
longa.ui.RegistrationForm = goog.defineClass(E, {
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
    this.getHandler().listen(this, UIET.ACTION, this.handleSubmit);
    this.getHandler().listen(this.querySelector('[name="country"]'),
        goog.events.EventType.CHANGE, this.handleCountryChange_);
  },

  /**
   * Handles the changes in the country selection list. We use it to
   * clear the state selection for non-US.
   * @param {goog.events.Event} e
   * @protected
   */
  handleCountryChange_: function(e) {
    var select = /** @type {HTMLSelectElement} */(e.target);
    var value = select.value;
    if (value != 'United States') {
      var s = /** @type {HTMLSelectElement} */(
          this.querySelector('[name="state"]'));
      s.value = s.options.item(0).value;
    }
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
    this.dispatchEvent(longa.ui.RegistrationForm.EventType.CALL_REGISTER);
  },

  /**
   * Completely ignore the state machine and simply enable/disable the
   * button.
   * @override
   */
  setEnabled: function(enable) {
    this.getChildAt(3).setEnabled(enable);
  },

  statics: {
    /**
     * The events this component can emit.
     * @enum {string}
     * @final
     */
    EventType: {
      CALL_REGISTER: goog.events.getUniqueId('request-registration')
    }
  }
});


/** @extends {ER} */
longa.ui.RegistrationFormRenderer = goog.defineClass(ER, {
  constructor: function() {
    ER.call(this);
  },

  /** @override */
  getCssClass: function() {
    return longa.ui.RegistrationFormRenderer.CSS_CLASS;
  },

  /** @override */
  getTemplate: function(model) {
    return longa.template.RegistrationForm(model);
  },

  statics: {
    CSS_CLASS: goog.getCssName('longa-registration-form')
  }
});

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(longa.ui.RegistrationForm,
    longa.ui.RegistrationFormRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    longa.ui.RegistrationFormRenderer.CSS_CLASS, function() {
      return new longa.ui.RegistrationForm(null);
    });

});  // goog.scope
