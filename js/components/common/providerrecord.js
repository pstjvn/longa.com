goog.provide('longa.ui.ProviderRecord');
goog.provide('longa.ui.ProviderRecordRenderer');

goog.require('goog.dom');
goog.require('goog.style');
goog.require('goog.ui.registry');
goog.require('longa.ds.Topic');
goog.require('longa.gen.dto.SellerBalance');
goog.require('longa.sellers');
goog.require('longa.template');
goog.require('longa.ui.Trend');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.material.EventMap');
goog.require('pstj.material.EventType');
goog.require('pstj.material.IconContainer');
goog.require('pstj.material.Ripple');


/** @extends {pstj.material.Element} */
longa.ui.ProviderRecord = goog.defineClass(pstj.material.Element, {
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
     * Reference to specific element that needs updating when model changes.
     * @type {Element}
     * @private
     */
    this.icon_ = null;
    /**
     * Reference to specific element that needs updating when model changes.
     * @type {Element}
     * @private
     */
    this.username_ = null;
    /**
     * Reference to specific element that needs updating when model changes.
     * @type {Element}
     * @private
     */
    this.activesince_ = null;
    /**
     * Reference to specific element that needs updating when model changes.
     * @type {Element}
     * @private
     */
    this.total_ = null;
    /**
     * Reference to specific element that needs updating when model changes.
     * @type {Element}
     * @private
     */
    this.open_ = null;
    /**
     * Reference to specific element that needs updating when model changes.
     * @type {Element}
     * @private
     */
    this.subscribers_ = null;
    /**
     * Reference to specific element that needs updating when model changes.
     * @type {Element}
     * @private
     */
    this.charge_ = null;
    this.setAllowTextSelection(false);
    this.setUsePointerAgent(true);
    this.setAutoEventsInternal(
        pstj.material.EventMap.EventFlag.TAP);
  },

  /** @override */
  onTap: function(e) {
    this.getRipple().onTap(e);
    longa.sellers.push(longa.ds.Topic.FEED_SELECTED, this.getModel());
  },

  /**
   * @protected
   * @return {pstj.material.Ripple}
   */
  getRipple: function() {
    return goog.asserts.assertInstanceof(this.getChildAt(
        this.getChildCount() - 1), pstj.material.Ripple);
  },

  /**
   * When model is changed apply the model to the view.
   * @override
   */
  setModel: function(model) {
    if (!goog.isNull(this.getModel())) {
      this.getHandler().unlisten(/** @type {!pstj.ds.DtoBase} */(
          this.getModel()),
          pstj.ds.DtoBase.EventType.CHANGE, this.applyModel);
    }
    goog.base(this, 'setModel', model);
    this.applyModel(null);
    if (!goog.isNull(this.getModel())) {
      this.getHandler().listen(/** @type {!pstj.ds.DtoBase} */(this.getModel()),
          pstj.ds.DtoBase.EventType.CHANGE, this.applyModel);
    }
  },

  /** @override */
  addMaterialChildren: function() {
    goog.base(this, 'addMaterialChildren');
    this.getRenderer().assignFields(this);
  },

  /**
   * @override
   * @return {!longa.ui.ProviderRecordRenderer}
   */
  getRenderer: function() {
    return goog.asserts.assertInstanceof(goog.base(this, 'getRenderer'),
        longa.ui.ProviderRecordRenderer);
  },

  /**
   * Applies the model on the DOM.
   * @protected
   * @param {goog.events.Event} e Possibly the event for the change of a model.
   */
  applyModel: function(e) {
    if (this.isInDocument() && !goog.isNull(this.getModel())) {
      var model = goog.asserts.assertInstanceof(this.getModel(),
          longa.gen.dto.SellerBalance);
      /** @type {!longa.ui.Trend} */(
          this.getChildAt(0)).setValue(model.profitLossRatio);
      goog.style.setElementShown(this.icon_, model.isSubscribed);
      goog.dom.setTextContent(this.username_, model.username);
      goog.dom.setTextContent(this.activesince_, model.firstSignalDate);
      goog.dom.setTextContent(this.total_, model.signalCount);
      goog.dom.setTextContent(this.open_, model.openSignalCount);
      goog.dom.setTextContent(this.subscribers_, model.memberCount);
      goog.dom.setTextContent(this.charge_, model.charge);
    }
  },

  /** @override */
  enterDocument: function() {
    goog.base(this, 'enterDocument');
    this.applyModel(null);
  }
});


/** @extends {pstj.material.ElementRenderer} */
longa.ui.ProviderRecordRenderer = goog.defineClass(
    pstj.material.ElementRenderer, {
      constructor: function() {
        pstj.material.ElementRenderer.call(this);
      },

      /** @override */
      getCssClass: function() {
        return longa.ui.ProviderRecordRenderer.CSS_CLASS;
      },

      /** @override */
      getTemplate: function(model) {
        return longa.template.ProviderRecord(model);
      },

      /**
       * Finds the elements that need updating on new models.
       * @param {!longa.ui.ProviderRecord} control
       */
      assignFields: function(control) {
        var root = control.getElement();
        if (goog.isNull(root)) {
          throw new Error('Cannot find fields in null Node');
        }
        control.icon_ = control.getElementByClass(goog.getCssName(
            this.getCssClass(), 'icon'));
        control.username_ = control.getElementByClass(goog.getCssName(
            this.getCssClass(), 'username'));
        control.activesince_ = control.getElementByClass(goog.getCssName(
            this.getCssClass(), 'active-since'));
        control.total_ = control.getElementByClass(goog.getCssName(
            this.getCssClass(), 'total'));
        control.open_ = control.getElementByClass(goog.getCssName(
            this.getCssClass(), 'open'));
        control.subscribers_ = control.getElementByClass(goog.getCssName(
            this.getCssClass(), 'subscribers'));
        control.charge_ = control.getElementByClass(goog.getCssName(
            this.getCssClass(), 'charge'));
      },

      /** @override */
      generateTemplateData: function(instance) {
        return null;
      },

      statics: {
        /**
         * @final
         * @type {string}
         */
        CSS_CLASS: goog.getCssName('longa-app-seller-record')
      }
    });
goog.addSingletonGetter(longa.ui.ProviderRecordRenderer);

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(longa.ui.ProviderRecord,
    longa.ui.ProviderRecordRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    longa.ui.ProviderRecordRenderer.CSS_CLASS, function() {
      return new longa.ui.ProviderRecord(null);
    });
