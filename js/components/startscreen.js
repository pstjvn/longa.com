goog.provide('longa.ui.StartScreen');

goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.registry');
goog.require('pstj.ds.dto.SwipetileList');
goog.require('pstj.material.Button');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.material.RadioButton');
goog.require('pstj.material.RadioGroup');
goog.require('pstj.widget.Swiper');


/** @extends {pstj.material.Element} */
longa.ui.StartScreen = goog.defineClass(pstj.material.Element, {
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
     * @private
     * @type {pstj.widget.Swiper}
     */
    this.swiper_ = null;
    /**
     * @private
     * @type {pstj.material.RadioGroup}
     */
    this.radiogroup_ = null;
  },

  /** @override */
  addMaterialChildren: function() {
    goog.base(this, 'addMaterialChildren');
    this.swiper_ = goog.asserts.assertInstanceof(
        this.getChildAt(this.getRenderer().getSwiperIndex()),
        pstj.widget.Swiper);
    this.radiogroup_ = goog.asserts.assertInstanceof(
        this.getChildAt(this.getRenderer().getRadioGroupIndex()),
        pstj.material.RadioGroup);
  },

  /** @override */
  enterDocument: function() {
    goog.base(this, 'enterDocument');
    this.getHandler().listen(this, goog.ui.Component.EventType.SELECT,
        this.handleSelection);
  },

  /**
   * Handles the selection in the swiper so we can match it in the
   * radio group.
   * @param {goog.events.Event} e The SELECT event.
   * @protected
   */
  handleSelection: function(e) {
    this.radiogroup_.getChildAt(
        this.swiper_.getSelectedIndex()).setChecked(true);
  },

  /** @override */
  getRenderer: function() {
    return goog.asserts.assertInstanceof(goog.base(this, 'getRenderer'),
        longa.ui.StartScreenRenderer);
  },

  /** @inheritDoc */
  disposeInternal: function() {
    goog.base(this, 'disposeInternal');
    this.radiogroup_ = null;
    this.swiper_ = null;
  }
});


/** @extends {pstj.material.ElementRenderer} */
longa.ui.StartScreenRenderer = goog.defineClass(pstj.material.ElementRenderer, {
  constructor: function() {
    pstj.material.ElementRenderer.call(this);
  },

  /** @override */
  getCssClass: function() {
    return longa.ui.StartScreenRenderer.CSS_CLASS;
  },

  /** @override */
  getTemplate: function(model) {
    return longa.template.StartScreen(model);
  },

  /**
   * Getter for the index in the template for the swiper.
   * @return {number}
   */
  getSwiperIndex: function() {
    return 0;
  },

  /**
   * Getter for the index in the template for the radio group.
   * @return {number}
   */
  getRadioGroupIndex: function() {
    return 2;
  },

  statics: {
    /**
     * @final
     * @type {string}
     */
    CSS_CLASS: goog.getCssName('longa-start-screen')
  }
});
goog.addSingletonGetter(longa.ui.StartScreenRenderer);

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(longa.ui.StartScreen,
    longa.ui.StartScreenRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    longa.ui.StartScreenRenderer.CSS_CLASS, function() {
      return new longa.ui.StartScreen(null);
    });

