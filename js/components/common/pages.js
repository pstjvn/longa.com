goog.provide('longa.ui.Pages');

goog.require('goog.math.Size');
goog.require('goog.style');
goog.require('goog.ui.registry');
goog.require('longa.ui.Page');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');


/** @extends {pstj.material.Element} */
longa.ui.Pages = goog.defineClass(pstj.material.Element, {
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

    // Basic configuration.
    this.setSupportedState(goog.ui.Component.State.TRANSITIONING, true);
  },

  /**
   * Setter for the selected index.
   *
   * Note that is the index is out of bound the setter will be ignored and no
   * error will be thrown, but one will be logged.
   *
   * @param {number} idx The index to select.
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
      this.getChildAt(this.selectedIndex).setSelected(false);
      this.selectedIndex = idx;
      this.getChildAt(this.selectedIndex).setSelected(true);
      // TODO: Handle the index switching.
    }
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
    return longa.template.Pages(model);
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