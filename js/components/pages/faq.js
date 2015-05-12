goog.provide('longa.ui.Faq');

goog.require('goog.ui.registry');
goog.require('pstj.control.Control');
goog.require('pstj.material.Button');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.widget.Swiper');


/** @extends {pstj.material.Element} */
longa.ui.Faq = goog.defineClass(pstj.material.Element, {
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
    this.control_ = new pstj.control.Control(this);
    this.control_.init();
  },

  /** @inheritDoc */
  enterDocument: function() {
    goog.base(this, 'enterDocument');
    this.getHandler().listen(this, goog.ui.Component.EventType.ACTION,
        function(e) {
          e.stopPropagation();
          this.control_.push(longa.ds.Topic.SHOW_SCREEN, longa.ds.Screen.FEED);
        });
  }
});


/** @extends {pstj.material.ElementRenderer} */
longa.ui.FaqRenderer = goog.defineClass(pstj.material.ElementRenderer, {
  constructor: function() {
    pstj.material.ElementRenderer.call(this);
  },

  /** @override */
  getCssClass: function() {
    return longa.ui.FaqRenderer.CSS_CLASS;
  },

  /** @override */
  getTemplate: function(model) {
    return longa.template.Faq(model);
  },

  statics: {
    /**
     * @final
     * @type {string}
     */
    CSS_CLASS: goog.getCssName('longa-app-faq')
  }
});
goog.addSingletonGetter(longa.ui.FaqRenderer);

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(longa.ui.Faq,
    longa.ui.FaqRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    longa.ui.FaqRenderer.CSS_CLASS, function() {
      return new longa.ui.Faq(null);
    });
