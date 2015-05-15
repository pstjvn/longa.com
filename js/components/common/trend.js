goog.provide('longa.ui.Trend');
goog.provide('longa.ui.TrendRenderer');

goog.require('goog.style');
goog.require('goog.ui.registry');
goog.require('longa.template');
goog.require('pstj.color');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.math.utils');


/** @extends {pstj.material.Element} */
longa.ui.Trend = goog.defineClass(pstj.material.Element, {
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
    /**
     * The value to color-code as trend.
     * @type {number}
     * @protected
     */
    this.value = 0;
  },

  /**
   * Update the element's value to trend on.
   * @param {number} val
   */
  setValue: function(val) {
    if (this.value != val) {
      if (val > 100) val = 100;
      if (val < -100) val = -100;
      this.value = val;
      this.getRenderer().applyValue(this);
    }
  },

  /**
   * Getter for the internal value.
   * @return {number}
   */
  getValue: function() {
    return this.value;
  },

  /**
   * @override
   * @return {longa.ui.TrendRenderer}
   */
  getRenderer: function() {
    return goog.asserts.assertInstanceof(goog.base(this, 'getRenderer'),
        longa.ui.TrendRenderer);
  },

  /** @inheritDoc */
  decorateInternal: function(el) {
    var value = el.getAttribute('value');
    if (!goog.isNull(value)) {
      this.value = parseFloat(value);
    }
    goog.base(this, 'decorateInternal', el);
  },

  /**
   * Makes sure that the current value is applied on the DOM once all children
   * are ready.
   * @override
   */
  addMaterialChildren: function() {
    goog.base(this, 'addMaterialChildren');
    this.getRenderer().applyValue(this);
  }
});


/** @extends {pstj.material.ElementRenderer} */
longa.ui.TrendRenderer = goog.defineClass(pstj.material.ElementRenderer, {
  constructor: function() {
    pstj.material.ElementRenderer.call(this);
  },

  /** @override */
  getCssClass: function() {
    return longa.ui.TrendRenderer.CSS_CLASS;
  },

  /** @inheritDoc */
  getTemplate: function(model) {
    return longa.template.Trend(model);
  },

  /** @override */
  generateTemplateData: function(instance) {
    var value = goog.asserts.assertInstanceof(instance, longa.ui.Trend)
        .getValue();
    return {
      value: value
    };
  },

  /**
   * Reflects the value in the DOM.
   * @param {longa.ui.Trend} instance The element instance.
   */
  applyValue: function(instance) {
    goog.style.setStyle(instance.getElementStrict(), 'backgroundColor',
        this.generateColor(instance.getValue()));
  },

  /**
   * The value to calculate color based on.
   * @param {number} value The value for which to generate the color.
   * @return {string}
   * @protected
   */
  generateColor: function(value) {
    var color = '';
    if (value > 0) color = longa.ui.TrendRenderer.Color.UP;
    else if (value < 0) color = longa.ui.TrendRenderer.Color.DOWN;
    else color = longa.ui.TrendRenderer.Color.NEUTRAL;

    // rebalance the value for edge cases (values between abt(n~1) and 0
    if (value > 0 && value < 1) value = 1;
    if (value < 0 && value > -1) value = -1;
    return pstj.color.hexToRgba(color, this.calculateOpacity(value));
  },

  /**
   * Calculates the value of the opacity using the cross rule mapping the
   * value from 0 to 100 to a scale from 0.4 to 1.0 (opacity).
   *
   * @param {number} value The trend value.
   * @return {number} The calculated opacity.
   * @protected
   */
  calculateOpacity: function(value) {
    if (value == 0) {
      return 0.5;
    } else {
      return pstj.math.utils.crossRule(0, 100, 0.4, 1, value);
    }
  },

  statics: {
    /**
     * @final
     * @type {string}
     */
    CSS_CLASS: goog.getCssName('longa-app-trend'),

    /**
     * @enum {string}
     */
    Color: {
      UP: '#008A00',
      DOWN: '#BE0000',
      NEUTRAL: '#CDCDCD'
    }
  }
});
goog.addSingletonGetter(longa.ui.TrendRenderer);


goog.ui.registry.setDefaultRenderer(longa.ui.Trend,
    longa.ui.TrendRenderer);


goog.ui.registry.setDecoratorByClassName(
    longa.ui.TrendRenderer.CSS_CLASS, function() {
      return new longa.ui.Trend(null);
    });
