/**
 * @fileoverview  Provides the component for adding new signals.
 */
goog.provide('longa.ui.AddSignal');
goog.provide('longa.ui.AddSignalRenderer');

goog.require('goog.ui.registry');
goog.require('longa.gen.dto.NewSignal');
goog.require('longa.template');
goog.require('longa.ui.BuyCredit');
goog.require('longa.ui.BuyCreditRenderer');
goog.require('longa.ui.ErrorMessage');
goog.require('pstj.material.Button');
goog.require('pstj.material.Fab');
goog.require('pstj.material.Input');
goog.require('pstj.material.RadioGroup');


/** @extends {longa.ui.BuyCredit} */
longa.ui.AddSignal = goog.defineClass(longa.ui.BuyCredit, {
  /**
   * @param {goog.ui.ControlContent=} opt_content Text caption or DOM structure
   *     to display as the content of the control (if any).
   * @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
   *     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
   * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
   *     document interaction.
   */
  constructor: function(opt_content, opt_renderer, opt_domHelper) {
    longa.ui.BuyCredit.call(this, opt_content, opt_renderer, opt_domHelper);
    this.ownScreen = longa.ds.Screen.SIGNALS_ADD;
  },

  /** @override */
  handleInputChange: function(e) {
    if (e.target instanceof pstj.material.Input) {
      this.getSubmitButton().setEnabled(!e.target.isEmpty());
    }
  },

  /** @override */
  submitHandler: function() {
    if (!this.getInput().isEmpty()) {
      this.setEnabled(false);
      var values = this.collectValues();
      values.run = 'open_signal';
      var ns = new longa.gen.dto.NewSignal();
      try {
        ns.fromJSON(values);
      } catch (e) {
        this.setError(longa.strings.InvalidSignalParameters(null).toString());
        this.setEnabled(true);
        return;
      }

      longa.signals.addSignal(ns).thenAlways(this.restoreButton, this);
    }
  },

  /** @override */
  handleActionButtons: function(e) {
    var button = goog.asserts.assertInstanceof(e.target, pstj.material.Button);
    if (button.getAction() == 'goback') {
      this.getController().push(longa.ds.Topic.SHOW_SCREEN,
          longa.ds.Screen.SIGNALS);
    } else {
      this.submitHandler();
    }
  },

  /**
   * Collects the values from known form elements.
   * @return {!Object<!string, !string>}
   */
  collectValues: function() {
    var result = {};
    this.forEachChild(function(child) {
      if (child instanceof pstj.material.Input ||
          child instanceof pstj.material.RadioGroup) {
        result[child.name] = child.getValue();
      }
    });
    return result;
  }
});


/** @extends {longa.ui.BuyCreditRenderer} */
longa.ui.AddSignalRenderer = goog.defineClass(longa.ui.BuyCreditRenderer, {
  constructor: function() {
    longa.ui.BuyCreditRenderer.call(this);
  },

  /** @override */
  getCssClass: function() {
    return longa.ui.AddSignalRenderer.CSS_CLASS;
  },

  /** @override */
  getStructuralCssClass: function() {
    return goog.getCssName('longa-app-buy-credit');
  },

  /** @override */
  getTemplate: function(model) {
    return longa.template.AddSignal(model);
  },

  statics: {
    /**
     * @final
     * @type {string}
     */
    CSS_CLASS: goog.getCssName('longa-app-addsignal')
  }
});
goog.addSingletonGetter(longa.ui.AddSignalRenderer);

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(longa.ui.AddSignal,
    longa.ui.AddSignalRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    longa.ui.AddSignalRenderer.CSS_CLASS, function() {
      return new longa.ui.AddSignal(null);
    });
