/**
 * @fileoverview Provides the whole app's UI as a single starting point.
 *
 * The static parts of the app are pre-configured in the template as well as the
 * main scaffolding.
 *
 * If you edit the template make sure that all elements used in the template
 * are required here to be sure that the element's files get loaded and
 * thus registered in the ui registry for the decoration to work correclty.
 */

goog.provide('longa.ui.App');
goog.provide('longa.ui.AppRenderer');

goog.require('goog.ui.registry');
goog.require('longa.ds.Topic');
goog.require('longa.template.app');
goog.require('longa.ui.Activities');
goog.require('longa.ui.Control');
goog.require('longa.ui.MainHeader');
goog.require('longa.ui.Menu');
goog.require('longa.ui.UserAuth');
goog.require('pstj.material.DrawerPanel');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.material.Fab');
goog.require('pstj.material.HeaderPanel');
goog.require('pstj.material.Panel');


/** @extends {longa.ui.Control} */
longa.ui.App = goog.defineClass(longa.ui.Control, {
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
  },

  /** @override */
  enterDocument: function() {
    goog.base(this, 'enterDocument');
    this.getController().listen(longa.ds.Topic.SHOW_MENU, function() {
      /** @type {!pstj.material.DrawerPanel} */ (this.getChildAt(0)).open();
    });
    this.getController().listen(longa.ds.Topic.SHOW_SCREEN, function(screen) {
      /** @type {!pstj.material.DrawerPanel} */ (this.getChildAt(0)).close();
    });
  }
});


/** @extends {pstj.material.ElementRenderer} */
longa.ui.AppRenderer = goog.defineClass(pstj.material.ElementRenderer, {
  constructor: function() {
    pstj.material.ElementRenderer.call(this);
  },

  /** @inheritDoc */
  getTemplate: function(model) {
    return longa.template.app.Longa(null);
  },

  /** @inheritDoc */
  getCssClass: function() {
    return longa.ui.AppRenderer.CSS_CLASS;
  },

  statics: {
    /**
     * @final
     * @type {!string}
     */
    CSS_CLASS: goog.getCssName('longa-app')
  }
});
goog.addSingletonGetter(longa.ui.AppRenderer);

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(longa.ui.App,
    longa.ui.AppRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    longa.ui.AppRenderer.CSS_CLASS, function() {
      return new longa.ui.App(null);
    });
