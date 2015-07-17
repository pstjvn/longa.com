goog.provide('longa.ui.MySignals');
goog.provide('longa.ui.MySignalsRenderer');

goog.require('goog.ui.registry');
goog.require('longa.ds.mysignals');
goog.require('longa.ui.SignalList');
goog.require('longa.ui.SignalListRenderer');


/** @extends {longa.ui.SignalList} */
longa.ui.MySignals = goog.defineClass(longa.ui.SignalList, {
  /**
   * @param {goog.ui.ControlContent=} opt_content Text caption or DOM structure
   *     to display as the content of the control (if any).
   * @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
   *     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
   * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
   *     document interaction.
   */
  constructor: function(opt_content, opt_renderer, opt_domHelper) {
    longa.ui.SignalList.call(this, opt_content, opt_renderer, opt_domHelper);
    this.setModel(longa.ds.mysignals);
  }
});


/** @extends {longa.ui.SignalListRenderer} */
longa.ui.MySignalsRenderer = goog.defineClass(longa.ui.SignalListRenderer, {
  constructor: function() {
    longa.ui.SignalListRenderer.call(this);
  },

  /** @override */
  getCssClass: function() {
    return longa.ui.MySignalsRenderer.CSS_CLASS;
  },

  /** @override */
  getStructuralCssClass: function() {
    return longa.ui.SignalListRenderer.CSS_CLASS;
  },

  /** @override */
  getTemplate: function(model) {
    return longa.template.SignalList(model);
  },

  statics: {
    /**
     * @final
     * @type {string}
     */
    CSS_CLASS: goog.getCssName('longa-app-my-signals')
  }
});
goog.addSingletonGetter(longa.ui.MySignalsRenderer);

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(longa.ui.MySignals,
    longa.ui.MySignalsRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    longa.ui.MySignalsRenderer.CSS_CLASS, function() {
      return new longa.ui.MySignals(null);
    });
