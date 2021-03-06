/**
 * @fileoverview Provides pages widget that can host any number of 'page' items
 * and switch between them, possibly animating the transition.
 */

goog.provide('longa.ui.Pages');
goog.provide('longa.ui.PagesRenderer');

goog.require('goog.math.Size');
goog.require('goog.style');
goog.require('goog.ui.registry');
goog.require('longa.template.pages');
goog.require('longa.ui.Control');
goog.require('longa.ui.Page');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.material.HeaderPanel');


/** @extends {longa.ui.Control} */
longa.ui.Pages = goog.defineClass(longa.ui.Control, {
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
    /**
     * The size od the parent element.
     * @type {goog.math.Size}
     * @private
     */
    this.parentSize_ = null;
    /**
     * The default selected child index.
     * @type {number}
     * @protected
     */
    this.selectedIndex = 0;
    /**
     * We need a logger as the logic here is a bit complex...
     * @private
     * @type {goog.log.Logger}
     */
    this.logger_ = goog.log.getLogger('longa.ui.Pages');
    /**
     * If we should use animation when switching between pages.
     *
     * When animation is used the developer should use CSS animations to set
     * things up, here we only assure that:
     * a) the display flag is set and layout is forced
     * b) the display flag is set to none after the end of the transition
     *
     * This means that is your transition does not end (i.e. you do not have
     * CSS transition applied to the element it will not be hidden as expected)
     *
     * @private
     * @type {boolean}
     */
    this.useAnimation_ = false;
    /**
     * Cahce for the index to apply with animation.
     * @private
     * @type {number}
     */
    this.nextIndexToApply_ = this.selectedIndex;
    // Basic configuration.
    this.setSupportedState(goog.ui.Component.State.TRANSITIONING, true);
  },

  /**
   * @protected
   * @param {boolean} enable
   */
  setUseAnimation: function(enable) {
    this.useAnimation_ = enable;
  },

  /**
   * Setter for the selected index.
   *
   * Note that is the index is out of bound the setter will be ignored and no
   * error will be thrown, but one will be logged.
   *
   * @param {number} idx The index to select.
   * @suppress {uselessCode}
   */
  setSelectedIndex: function(idx) {
    if (idx < 0 || idx > this.getChildCount() - 1) {
      goog.log.error(this.logger_, 'Attempted to set an index that is out' +
          ' of bound: ' + idx);
    } else if (idx == this.selectedIndex) {
      goog.log.info(this.logger_, 'Set index to the already selected one');
    } else {
      if (goog.isNull(this.parentSize_)) {
        goog.log.warning(this.logger_,
            'Cannot use animation, no parent size set');
      }
      this.nextIndexToApply_ = idx;
      if (this.useAnimation_) {
        this.setTransitioning(true);
        this.getChildAt(this.nextIndexToApply_).getElement().offsetWidth;
        this.getHandler().listenOnce(
            this.getChildAt(this.nextIndexToApply_).getElementStrict(),
            goog.events.EventType.TRANSITIONEND,
            this.onTransitionEnd);
        this.getRaf().start();
      } else {
        this.getRaf().fire();
      }
    }
  },

  /** @inheritDoc */
  onRaf: function(ts) {
    this.getChildAt(this.selectedIndex).setSelected(false);
    this.selectedIndex = this.nextIndexToApply_;
    this.getChildAt(this.selectedIndex).setSelected(true);
  },

  /** @override */
  decorateInternal: function(el) {
    goog.base(this, 'decorateInternal', el);
    if (el.hasAttribute('animate')) this.useAnimation_ = true;
  },

  /**
   * Handles the end of the transition for a subpage.
   * @param {goog.events.Event} e The DOM transition end event.
   * @protected
   */
  onTransitionEnd: function(e) {
    this.setTransitioning(false);
  },

  /**
   * Provides access to the currently selected index.
   * @return {number}
   */
  getSelectedIndex: function() {
    return this.selectedIndex;
  },

  /** @override */
  addMaterialChildren: function() {
    goog.base(this, 'addMaterialChildren');
    if (!this.getChildAt(this.selectedIndex).isSelected()) {
      this.getChildAt(this.selectedIndex).setSelected(true);
    }
  }
});


/** @extends {pstj.material.ElementRenderer} */
longa.ui.PagesRenderer = goog.defineClass(pstj.material.ElementRenderer, {
  constructor: function() {
    pstj.material.ElementRenderer.call(this);
  },

  /** @override */
  getCssClass: function() {
    return longa.ui.PagesRenderer.CSS_CLASS;
  },

  /** @override */
  getTemplate: function(model) {
    return longa.template.pages.Pages(model);
  },

  /**
   * Given the component instance attempts to determine the size of the
   * container it is put in. The container MUST be of of min-width so
   * the animations will work as expected.
   * @override
   */
  initializeDom: function(instance) {
    goog.asserts.assertInstanceof(instance, longa.ui.Pages);
    var parent = goog.dom.getParentElement(instance.getElementStrict());
    if (goog.isNull(parent)) {
      throw new Error('Element does not have a parent');
    }
    instance.parentSize_ = goog.style.getSize(parent);
  },

  statics: {
    /**
     * @final
     * @type {string}
     */
    CSS_CLASS: goog.getCssName('longa-app-pages')
  }
});
goog.addSingletonGetter(longa.ui.PagesRenderer);

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(longa.ui.Pages,
    longa.ui.PagesRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    longa.ui.PagesRenderer.CSS_CLASS, function() {
      return new longa.ui.Pages(null);
    });
