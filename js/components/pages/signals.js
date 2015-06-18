goog.provide('longa.ui.Signals');
goog.provide('longa.ui.SignalsRenderer');

goog.require('goog.ui.registry');
goog.require('longa.ds.mysignals');
goog.require('longa.template');
goog.require('longa.ui.AddSignal');
goog.require('longa.ui.ListHeader');
goog.require('longa.ui.MySignals');
goog.require('longa.ui.Pages');
goog.require('longa.ui.PagesRenderer');


/** @extends {longa.ui.Pages} */
longa.ui.Signals = goog.defineClass(longa.ui.Pages, {
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
  },

  /** @override */
  addMaterialChildren: function() {
    goog.base(this, 'addMaterialChildren');
    this.getChildAt(0)
        .getChildAt(0)
        .getChildAt(0)
        .getChildAt(0).setModel(longa.ds.mysignals);
  },

  /** @override */
  enterDocument: function() {
    goog.base(this, 'enterDocument');
    this.getController().listen(longa.ds.Topic.SHOW_SCREEN, function(screen) {
      if (screen == longa.ds.Screen.SIGNALS) {
        this.setSelectedIndex(0);
      } else if (screen == longa.ds.Screen.SIGNALS_ADD) {
        this.setSelectedIndex(1);
      }
    });
    this.getHandler().listen(this, goog.ui.Component.EventType.ACTION,
        this.handleAction);
  },

  /**
   * Handles an action event from internal pages.
   * @param {goog.events.Event} e The ACTION event.
   * @protected
   */
  handleAction: function(e) {
    var target = e.target;
    if (target instanceof pstj.material.Button) {
      var action = target.getAction();
      if (action == 'add') {
        this.getController().push(longa.ds.Topic.SHOW_SCREEN,
            longa.ds.Screen.SIGNALS_ADD);
      }
    }
  }
});


/** @extends {longa.ui.PagesRenderer} */
longa.ui.SignalsRenderer = goog.defineClass(longa.ui.PagesRenderer, {
  constructor: function() {
    longa.ui.PagesRenderer.call(this);
  },

  /** @override */
  getCssClass: function() {
    return longa.ui.SignalsRenderer.CSS_CLASS;
  },

  /** @override */
  getTemplate: function(model) {
    return longa.template.Signals(model);
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
    CSS_CLASS: goog.getCssName('longa-app-signal-pages')
  }
});
goog.addSingletonGetter(longa.ui.SignalsRenderer);

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(longa.ui.Signals,
    longa.ui.SignalsRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    longa.ui.SignalsRenderer.CSS_CLASS, function() {
      return new longa.ui.Signals(null);
    });
