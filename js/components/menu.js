goog.provide('longa.ui.Menu');

goog.require('goog.ui.Component');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.registry');
goog.require('pstj.control.Control');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.material.MenuItem');


/** @extends {pstj.material.Element} */
longa.ui.Menu = goog.defineClass(pstj.material.Element, {
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
     * Reference to the current selection.
     * @type {goog.ui.Component}
     * @private
     */
    this.selectedChild_ = null;
    this.control_ = new pstj.control.Control();
    this.control_.init();
    // Allow us to match the menu to the currently used screen
    this.control_.listen(longa.ds.Topic.SHOW_SCREEN, goog.bind(
        function(screen) {
          if (screen > 99) {
            this.clearSelection();
            return;
          } else if (screen > 9) {
            screen = parseInt(screen.toString()[0], 10);
          }
          this.getChildAt(goog.asserts.assertNumber(screen)).setSelected(true);
        }, this));
  },

  /** @override */
  addMaterialChildren: function() {
    goog.base(this, 'addMaterialChildren');
    var len = this.getChildCount() - 2;
    this.forEachChild(function(child, i) {
      if (i < len) {
        child.setEnabled(false);
      } else if (i == len) {
        child.setSelected(true);
        this.selectedChild_ = child;
      }
    }, this);
    this.getChildAt(2).setEnabled(true);
    this.getChildAt(0).setVisible(false);
  },

  /** @override */
  enterDocument: function() {
    goog.base(this, 'enterDocument');
    this.getHandler().listen(this, goog.ui.Component.EventType.SELECT,
        this.handleSelectionEvent);
  },

  /**
   * We handle the selection so only a single item can be selected at a time.
   * @param {goog.events.Event} e The SELECTED event.
   * @protected
   */
  handleSelectionEvent: function(e) {
    if (e.target != this.selectedChild_) {
      this.selectedChild_.setSelected(false);
      this.selectedChild_ = goog.asserts.assertInstanceof(e.target,
          goog.ui.Component);
      this.control_.push(longa.ds.Topic.SHOW_SCREEN,
          this.indexOfChild(this.selectedChild_));
    }
  },

  /**
   * Clear the selection, used when a view that is not in the menu is displayed.
   */
  clearSelection: function() {
    this.selectedChild_.setSelected(false);
    this.selectedChild_ = null;
  }
});


/** @extends {pstj.material.ElementRenderer} */
longa.ui.MenuRenderer = goog.defineClass(pstj.material.ElementRenderer, {
  constructor: function() {
    pstj.material.ElementRenderer.call(this);
  },

  /** @override */
  getCssClass: function() {
    return longa.ui.MenuRenderer.CSS_CLASS;
  },

  /** @override */
  getTemplate: function(model) {
    return longa.template.Menu(model);
  },

  statics: {
    /**
     * @final
     * @type {string}
     */
    CSS_CLASS: goog.getCssName('longa-app-menu')
  }
});
goog.addSingletonGetter(longa.ui.MenuRenderer);

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(longa.ui.Menu,
    longa.ui.MenuRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    longa.ui.MenuRenderer.CSS_CLASS, function() {
      return new longa.ui.Menu(null);
    });
