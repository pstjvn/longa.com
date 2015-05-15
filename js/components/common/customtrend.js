goog.provide('longa.ui.CustomTrend');

goog.require('goog.ui.registry');
goog.require('longa.template');
goog.require('longa.ui.Trend');
goog.require('longa.ui.TrendRenderer');


/** @extends {longa.ui.Trend} */
longa.ui.CustomTrend = goog.defineClass(longa.ui.Trend, {
  /**
   * @param {goog.ui.ControlContent=} opt_content Text caption or DOM structure
   *     to display as the content of the control (if any).
   * @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
   *     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
   * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
   *     document interaction.
   */
  constructor: function(opt_content, opt_renderer, opt_domHelper) {
    longa.ui.Trend.call(this, opt_content, opt_renderer, opt_domHelper);
  }
});


/** @extends {longa.ui.TrendRenderer} */
longa.ui.CustomTrendRenderer = goog.defineClass(longa.ui.TrendRenderer, {
  constructor: function() {
    longa.ui.TrendRenderer.call(this);
  },

  /** @override */
  getCssClass: function() {
    return longa.ui.CustomTrendRenderer.CSS_CLASS;
  },

  /** @override */
  getTemplate: function(model) {
    return longa.template.CustomTrend(model);
  },

  statics: {
    /**
     * @final
     * @type {string}
     */
    CSS_CLASS: goog.getCssName('longa-app-custom-trend')
  }
});
goog.addSingletonGetter(longa.ui.CustomTrendRenderer);

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(longa.ui.CustomTrend,
    longa.ui.CustomTrendRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    longa.ui.CustomTrendRenderer.CSS_CLASS, function() {
      return new longa.ui.CustomTrend(null);
    });
