/**
 * @fileoverview  Provides a common list header component that can be used to
 * sort lists.
 *
 * For sorting to work you must bind the instance to an instance of
 * the Sortable class so that we can call its sorting.
 *
 * Note that selecting a selectable item in the list header does not bind
 * to sort index automatically, instead we listen on the model for sorting
 * so we are always reflecting the actual sorting.
 */
goog.provide('longa.ui.ListHeader');
goog.provide('longa.ui.ListHeaderRenderer');

goog.require('goog.asserts');
goog.require('goog.ui.registry');
goog.require('longa.template');
goog.require('pstj.ds.DtoBase.EventType');
goog.require('pstj.ds.Sortable');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.material.IconContainer');
goog.require('pstj.material.icon');


/** @extends {pstj.material.Element} */
longa.ui.ListHeader = goog.defineClass(pstj.material.Element, {
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
     * The index currently used to do sorting in the data model bound to
     * this component.
     *
     * Note that this index always reflects the model sort index.
     *
     * @type {!number}
     * @protected
     */
    this.currentSelectedIndex = -1;
    this.setAllowTextSelection(false);
  },

  /** @override */
  onTap: function(e) {
    e.stopPropagation();
    var idx = this.indexOfChild(/** @type {!goog.ui.Component} */(e.target));
    if (idx != -1) {
      this.getModel().sort(idx);
    }
  },

  /**
   * Sets the model to automatically listen for sorting changes on.
   * @override
   */
  setModel: function(model) {
    goog.base(this, 'setModel', goog.asserts.assertInstanceof(model,
        pstj.ds.Sortable));
    this.getHandler().listen(model, pstj.ds.DtoBase.EventType.CHANGE,
        this.onModelChangeHandler_);
  },

  /**
   * Aserts that the model is indeed a sortable.
   * @return {!pstj.ds.Sortable}
   */
  getModel: function() {
    return goog.asserts.assertInstanceof(goog.base(this, 'getModel'),
        pstj.ds.Sortable);
  },

  /**
   * Handles the changes in the sortable instance. We use the event to update
   * the sortable view state in the header.
   * @param {goog.events.Event} e
   * @private
   */
  onModelChangeHandler_: function(e) {
    if (this.isInDocument()) {
      this.setSorting(this.getModel().getKey(), this.getModel().getAsc());
    }
  },

  /**
   * Sets / updates the sorting view.
   * @protected
   * @param {!number} index The index of the sorting child.
   * @param {boolean} asc If the sorting is ascending.
   */
  setSorting: function(index, asc) {
    if (index != this.currentSelectedIndex && this.currentSelectedIndex != -1) {
      goog.asserts.assertInstanceof(
          this.getChildAt(this.currentSelectedIndex).getChildAt(0),
          pstj.material.IconContainer).setIcon(
          pstj.material.icon.Name.NONE);
    }
    this.currentSelectedIndex = index;
    if (this.currentSelectedIndex != -1) {
      goog.asserts.assertInstanceof(
          this.getChildAt(this.currentSelectedIndex).getChildAt(0),
          pstj.material.IconContainer).setIcon(
          asc ? pstj.material.icon.Name.ARROW_DROP_DOWN :
              pstj.material.icon.Name.ARROW_DROP_UP);
    }
  }
});


/** @extends {pstj.material.ElementRenderer} */
longa.ui.ListHeaderRenderer = goog.defineClass(pstj.material.ElementRenderer, {
  constructor: function() {
    pstj.material.ElementRenderer.call(this);
  },

  /** @override */
  getCssClass: function() {
    return longa.ui.ListHeaderRenderer.CSS_CLASS;
  },

  /** @override */
  getTemplate: function(model) {
    return longa.template.ListHeader(model);
  },

  statics: {
    /**
     * @final
     * @type {string}
     */
    CSS_CLASS: goog.getCssName('longa-app-list-header')
  }
});
goog.addSingletonGetter(longa.ui.ListHeaderRenderer);

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(longa.ui.ListHeader,
    longa.ui.ListHeaderRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    longa.ui.ListHeaderRenderer.CSS_CLASS, function() {
      return new longa.ui.ListHeader(null);
    });
