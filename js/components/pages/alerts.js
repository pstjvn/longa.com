goog.provide('longa.ui.Alerts');

goog.require('goog.asserts');
goog.require('goog.ui.Control');
goog.require('goog.ui.registry');
goog.require('longa.data');
goog.require('pstj.ds.DtoBase.EventType');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');


/** @extends {pstj.material.Element} */
longa.ui.Alerts = goog.defineClass(pstj.material.Element, {
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
  },

  /** @override  */
  enterDocument: function() {
    goog.base(this, 'enterDocument');
    this.getHandler().listen(longa.data.alerts,
        pstj.ds.DtoBase.EventType.CHANGE, this.onModelChange_);
  },

  /**
   * @private
   * @param {goog.events.Event} e The change event from the model.
   */
  onModelChange_: function(e) {
    var parent = this.getParent();
    if (!goog.isNull(parent) &&
        goog.asserts.assertInstanceof(parent, goog.ui.Control).isSelected()) {
      // We do not want to destroy the view, so instead
      // we will show info and action button to reload.
    } else {
      // We are not in the view, directly re-render.
    }
  }
});


/** @extends {pstj.material.ElementRenderer} */
longa.ui.AlertsRenderer = goog.defineClass(pstj.material.ElementRenderer, {
  constructor: function() {
    pstj.material.ElementRenderer.call(this);
  },

  /** @override */
  getCssClass: function() {
    return longa.ui.AlertsRenderer.CSS_CLASS;
  },

  /** @override */
  getTemplate: function(model) {
    return longa.template.Alerts(model);
  },

  /** @override */
  generateTemplateData: function(control) {
    return longa.data.alerts;
  },

  statics: {
    /**
     * @final
     * @type {string}
     */
    CSS_CLASS: goog.getCssName('longa-app-alerts')
  }
});
goog.addSingletonGetter(longa.ui.AlertsRenderer);

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(longa.ui.Alerts,
    longa.ui.AlertsRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    longa.ui.AlertsRenderer.CSS_CLASS, function() {
      return new longa.ui.Alerts(null);
    });
