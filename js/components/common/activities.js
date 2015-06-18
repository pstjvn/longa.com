/**
 * @fileoverview Provides the main view for the app. It holds all 'screens' and
 * nested pages inside itslef and is responsible for switching between the main
 * views. Nested views should handle their state independently.
 */

goog.provide('longa.ui.Activities');

goog.require('goog.ui.registry');
goog.require('longa.ds.Topic');
goog.require('longa.template.app');
goog.require('longa.ui.Alerts');
goog.require('longa.ui.Auth');
goog.require('longa.ui.Balance');
goog.require('longa.ui.Faq');
goog.require('longa.ui.Feeds');
goog.require('longa.ui.Pages');
goog.require('longa.ui.PagesRenderer');
goog.require('longa.ui.Service');
goog.require('longa.ui.Signals');
goog.require('longa.ui.Terms');


/** @extends {longa.ui.Pages} */
longa.ui.Activities = goog.defineClass(longa.ui.Pages, {
  /**
   * @param {goog.ui.ControlContent=} opt_content Text caption or DOM structure
   *     to display as the content of the control (if any).
   * @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
   *     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
   * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
   *     document interaction.
   */
  constructor: function(opt_content, opt_renderer, opt_domHelper) {
    longa.ui.Pages.call(this, opt_content, opt_renderer, opt_domHelper);
    this.getController().listen(longa.ds.Topic.SHOW_SCREEN, function(screen) {
      // Hack around the screen selection, fewer checks...
      if (screen > 99 && screen < 103) {
        this.setSelectedIndex(0);
      } else if (screen >= 31 && screen <= 39) {
        this.setSelectedIndex(3);
      } else if (screen >= 0 && screen < 10) {
        this.setSelectedIndex(screen);
      }
    });
  }
});


/** @extends {longa.ui.PagesRenderer} */
longa.ui.ActivitiesRenderer = goog.defineClass(longa.ui.PagesRenderer, {
  constructor: function() {
    longa.ui.PagesRenderer.call(this);
  },

  /** @override */
  getCssClass: function() {
    return longa.ui.ActivitiesRenderer.CSS_CLASS;
  },

  /** @override */
  getTemplate: function(model) {
    return longa.template.app.Activities(null);
  },

  /** @override */
  getStructuralCssClass: function() {
    return longa.ui.PagesRenderer.CSS_CLASS;
  },

  statics: {
    /**
     * @final
     * @type {string}
     */
    CSS_CLASS: goog.getCssName('longa-app-activities')
  }
});
goog.addSingletonGetter(longa.ui.ActivitiesRenderer);

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(longa.ui.Activities,
    longa.ui.ActivitiesRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    longa.ui.ActivitiesRenderer.CSS_CLASS, function() {
      return new longa.ui.Activities(null);
    });
