goog.provide('longa.ui.ErrorMessage');

goog.require('goog.async.Delay');
goog.require('goog.ui.Component.State');
goog.require('goog.ui.registry');
goog.require('longa.template');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');

goog.scope(function() {
var E = pstj.material.Element;
var ER = pstj.material.ElementRenderer;


/** @extends {E} */
longa.ui.ErrorMessage = goog.defineClass(E, {
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
    /**
     * The current message to show.
     * @type {!string}
     */
    this.message = '';
    /**
     * @type {goog.async.Delay}
     * @private
     */
    this.disableDelayed_ = new goog.async.Delay(this.hideMessage, 5000, this);
    this.registerDisposable(this.disableDelayed_);

    this.setSupportedState(goog.ui.Component.State.DISABLED, true);
    this.setEnabled(false);
  },

  /**
   * Show a new error message.
   * @param {string} message
   */
  showMessage: function(message) {
    this.message = message;
    this.setContent(this.message);
    this.setEnabled(true);
    // this.disableDelayed_.start();
  },

  /**
   * Hide the current message.
   */
  hideMessage: function() {
    this.setEnabled(false);
  }
});


/** @extends {ER} */
longa.ui.ErrorMessageRenderer = goog.defineClass(ER, {
  constructor: function() {
    ER.call(this);
  },

  /** @override */
  getTemplate: function(model) {
    return longa.template.ErrorMessage(model);
  },

  /** @override */
  generateTemplateData: function(instance) {
    return null;
  },

  /** @override */
  getCssClass: function() {
    return longa.ui.ErrorMessageRenderer.CSS_CLASS;
  },

  statics: {
    /**
     * @type {string}
     * @final
     */
    CSS_CLASS: goog.getCssName('longa-error-message')
  }
});

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(longa.ui.ErrorMessage,
    longa.ui.ErrorMessageRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    longa.ui.ErrorMessageRenderer.CSS_CLASS, function() {
      return new longa.ui.ErrorMessage(null);
    });

});  // goog.scope
