goog.provide('longa.ui.MainHeader');
goog.provide('longa.ui.MainHeaderRenderer');

goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.registry');
goog.require('longa.ds.Topic');
goog.require('longa.template.components');
goog.require('longa.ui.Control');
goog.require('longa.ui.Page');
goog.require('longa.ui.Pages');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.material.IconContainer');


/** @extends {longa.ui.Control} */
longa.ui.MainHeader = goog.defineClass(longa.ui.Control, {
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
    // Handle the screen changes - basically figure out which main screen it is
    // and update the header.
    this.getController().listen(longa.ds.Topic.SHOW_SCREEN, function(screen) {
      if (screen > 99) {
        // This is login -> select the first
        this.getChildAt(1).setSelectedIndex(0);
      } else if (screen > 9) {
        // This is one of the inner screens
        screen = parseInt(screen.toString()[0], 10);
        this.getChildAt(1).setSelectedIndex(screen);
      } else {
        this.getChildAt(1).setSelectedIndex(
            goog.asserts.assertNumber(screen));
      }
    });
  },

  /** @override */
  enterDocument: function() {
    goog.base(this, 'enterDocument');
    this.getHandler()
      .listen(this, goog.ui.Component.EventType.ACTION, function(e) {
          this.getController().push(longa.ds.Topic.SHOW_MENU);
        });
  }
});


/** @extends {pstj.material.ElementRenderer} */
longa.ui.MainHeaderRenderer = goog.defineClass(pstj.material.ElementRenderer, {
  constructor: function() {
    pstj.material.ElementRenderer.call(this);
  },

  /** @override */
  getTemplate: function(m) {
    return longa.template.components.MainHeader(m);
  },

  /** @override */
  getCssClass: function() {
    return longa.ui.MainHeaderRenderer.CSS_CLASS;
  },

  statics: {
    /**
     * @final
     * @type {string}
     */
    CSS_CLASS: goog.getCssName('longa-main-header')
  }
});
goog.addSingletonGetter(longa.ui.MainHeaderRenderer);

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(longa.ui.MainHeader,
    longa.ui.MainHeaderRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    longa.ui.MainHeaderRenderer.CSS_CLASS, function() {
      return new longa.ui.MainHeader(null);
    });
