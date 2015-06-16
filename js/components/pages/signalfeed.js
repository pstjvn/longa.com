/**
 * @fileoverview Dummy wraper for the provider record list.
 *
 * It also hosts the sorting widget used to filter the data records.
 */
goog.provide('longa.ui.SignalFeed');
goog.provide('longa.ui.SignalFeedRenderer');

goog.require('goog.ui.registry');
goog.require('longa.ds.Screen');
goog.require('longa.ds.Topic');
goog.require('longa.ds.sellers');
goog.require('longa.template');
goog.require('longa.ui.Control');
goog.require('longa.ui.ListHeader');
goog.require('longa.ui.ProviderRecordList');
goog.require('pstj.control.Control');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.material.EventMap');


/** @extends {longa.ui.Control} */
longa.ui.SignalFeed = goog.defineClass(longa.ui.Control, {
  /**
   * @param {goog.ui.ControlContent=} opt_content Text caption or DOM structure
   *     to display as the content of the control (if any).
   * @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
   *     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
   * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
   *     document interaction.
   */
  constructor: function(opt_content, opt_renderer, opt_domHelper) {
    longa.ui.Control.call(this, opt_content, opt_renderer, opt_domHelper);
    this.setAutoEventsInternal(pstj.material.EventMap.EventFlag.TAP);
  },

  /**
   * Set the data model on the sorting list header.
   * @override
   */
  enterDocument: function() {
    goog.base(this, 'enterDocument');
    this.getChildAt(0).setModel(longa.ds.sellers);
    this.getChildAt(1).getChildAt(0).setModel(longa.ds.sellers);
    this.getHandler().listen(this.getChildAt(1).getChildAt(0),
        pstj.material.EventType.RIPPLE_END,
        this.onListAnimationEnd_);
  },

  /**
   * Handles the ripple animation end as we want to swich screens at this point.
   * @param {goog.events.Event} e The RIPPLE_END event.
   * @protected
   */
  onListAnimationEnd_: function(e) {
    this.getController().push(longa.ds.Topic.SHOW_SCREEN,
        longa.ds.Screen.FEED_DETAILS);
  }
});


/** @extends {pstj.material.ElementRenderer} */
longa.ui.SignalFeedRenderer = goog.defineClass(pstj.material.ElementRenderer, {
  constructor: function() {
    pstj.material.ElementRenderer.call(this);
  },

  /** @override */
  getCssClass: function() {
    return longa.ui.SignalFeedRenderer.CSS_CLASS;
  },

  /** @override */
  getTemplate: function(model) {
    return longa.template.SignalFeed(model);
  },

  statics: {
    /**
     * @final
     * @type {string}
     */
    CSS_CLASS: goog.getCssName('longa-app-feed')
  }
});
goog.addSingletonGetter(longa.ui.SignalFeedRenderer);

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(longa.ui.SignalFeed,
    longa.ui.SignalFeedRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    longa.ui.SignalFeedRenderer.CSS_CLASS, function() {
      return new longa.ui.SignalFeed(null);
    });
