/**
 * @fileoverview Provides a virtual list that is pre-bound to the provider
 * record list data.
 */

goog.provide('longa.ui.ProviderRecordList');
goog.provide('longa.ui.ProviderRecordListRenderer');

goog.require('goog.array');
goog.require('goog.ui.Component.State');
goog.require('goog.ui.registry');
goog.require('longa.ds.Screen');
goog.require('longa.ds.Topic');
goog.require('longa.ui.ProviderRecord');
goog.require('pstj.control.Control');
goog.require('pstj.ds.DtoBase.EventType');
goog.require('pstj.ds.Sortable');
goog.require('pstj.material.List');
goog.require('pstj.material.ListRenderer');


/** @extends {pstj.material.List} */
longa.ui.ProviderRecordList = goog.defineClass(pstj.material.List, {
  /**
   * @param {goog.ui.ControlContent=} opt_content Text caption or DOM structure
   *     to display as the content of the control (if any).
   * @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
   *     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
   * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
   *     document interaction.
   */
  constructor: function(opt_content, opt_renderer, opt_domHelper) {
    pstj.material.List.call(this, opt_content, opt_renderer, opt_domHelper);
    /**
     * Our control instance. We use it to monitor for when the
     * view is shown right after a resize so we can adjust.
     * @type {pstj.control.Control}
     * @final
     * @private
     */
    this.control_ = new pstj.control.Control(this);
    /**
     * Flag if we are currently shown. e need this so we can trigger resize
     * only when we can relayout.
     * @private
     * @type {boolean}
     */
    this.isShown_ = false;
    /**
     * Flag - if we need to recalculate the size of the view.
     * This happens when the vew is resized.
     *
     * By default we are dirty as we are display:none being a page item.
     *
     * @private
     * @type {boolean}
     */
    this.isDirty_ = true;

    this.control_.init();
    // When we show this exact screen and if we are marked 'dirty'
    // call on resize to recalculate styling.
    this.control_.listen(longa.ds.Topic.SHOW_SCREEN, function(s) {
      this.isShown_ = (s == longa.ds.Screen.FEED);
      if (this.isShown_ && this.isDirty_) {
        goog.async.nextTick(function() {
          this.onResize();
          this.isDirty_ = false;
        }, this);
      }
    });
    this.setItemHeight(50);
    this.setCreateListItem(function() {
      return new longa.ui.ProviderRecord();
    });
  },

  /** @override */
  addModelListeneres: function() {
    this.getHandler().listen(this.getModel(),
        pstj.ds.DtoBase.EventType.CHANGE, this.handleModelChange_);
  },

  /** @override */
  removeModelListeners: function() {
    this.getHandler().unlisten(this.getModel(),
        pstj.ds.DtoBase.EventType.CHANGE, this.handleModelChange_);
  },

  /**
   * Overrides the model so we are sure its a sellers list.
   * @return {?pstj.ds.Sortable} [description]
   */
  getModel: function() {
    var model = goog.base(this, 'getModel');
    if (!goog.isNull(model)) {
      return goog.asserts.assertInstanceof(model, pstj.ds.Sortable);
    } else return null;
  },

  /**
   * Handler for when the seller list changes.
   * @param {goog.events.Event} e
   * @private
   */
  handleModelChange_: function(e) {
    this.updateModelLength();
    this.initialize();
  },

  /** @override */
  getModelCount: function() {
    return this.getModel().list.length;
  },

  /** @override */
  setModelForItemInternal: function(item, index) {
    item.setModel(this.getModel().list[index]);
  },

  /**
   * Handle resize events.
   */
  onResize: function() {
    this.setHeight(goog.style.getSize(this.getElement()).height);
    this.initialize();
  }
});


/** @extends {pstj.material.ListRenderer} */
longa.ui.ProviderRecordListRenderer = goog.defineClass(
    pstj.material.ListRenderer, {
      constructor: function() {
        pstj.material.ListRenderer.call(this);
      },

      /** @override */
      getCssClass: function() {
        return longa.ui.ProviderRecordListRenderer.CSS_CLASS;
      },

      /** @override */
      getTemplate: function(model) {
        return longa.template.Page(model);
      },

      /** @override */
      getStructuralCssClass: function() {
        return goog.getCssName('material-list');
      },

      statics: {
        /**
         * @final
         * @type {string}
         */
        CSS_CLASS: goog.getCssName('longa-app-prl')
      }
    });
goog.addSingletonGetter(longa.ui.ProviderRecordListRenderer);

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(longa.ui.ProviderRecordList,
    longa.ui.ProviderRecordListRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    longa.ui.ProviderRecordListRenderer.CSS_CLASS, function() {
      return new longa.ui.ProviderRecordList(null);
    });
