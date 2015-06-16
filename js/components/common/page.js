/**
 * @fileoverview Provides virtual page to be embedded in 'Pages' widget.
 *
 * A page can be selected (potentially animating the transition).
 *
 * Pages that are not currently selected are by default styles with
 * 'display:none' to make the layout tree smaller.
 */

goog.provide('longa.ui.Page');
goog.provide('longa.ui.PageRenderer');

goog.require('goog.array');
goog.require('goog.ui.Component.State');
goog.require('goog.ui.registry');
goog.require('longa.template.pages');
goog.require('longa.ui.Control');
goog.require('pstj.material.ElementRenderer');


/** @extends {longa.ui.Control} */
longa.ui.Page = goog.defineClass(longa.ui.Control, {
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
    this.setSupportedState(goog.ui.Component.State.SELECTED, true);
  },

  /**
   * Intentionally dispose of the children, we are not going to use them again.
   * @override
   */
  removeChildren: function() {
    var children = goog.base(this, 'removeChildren');
    goog.array.forEach(children, function(component) {
      goog.dispose(component);
    });
    return children;
  }
});


/** @extends {pstj.material.ElementRenderer} */
longa.ui.PageRenderer = goog.defineClass(pstj.material.ElementRenderer, {
  constructor: function() {
    pstj.material.ElementRenderer.call(this);
  },

  /** @override */
  getCssClass: function() {
    return longa.ui.PageRenderer.CSS_CLASS;
  },

  /** @override */
  getTemplate: function(model) {
    return longa.template.pages.Page(model);
  },

  statics: {
    /**
     * @final
     * @type {string}
     */
    CSS_CLASS: goog.getCssName('longa-app-page')
  }
});
goog.addSingletonGetter(longa.ui.PageRenderer);

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(longa.ui.Page,
    longa.ui.PageRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    longa.ui.PageRenderer.CSS_CLASS, function() {
      return new longa.ui.Page(null);
    });
