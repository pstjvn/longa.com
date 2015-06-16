/**
 * @fileoverview Provides the sidebar menu for the app.
 *
 * The app menu contains custom menu items as well, make sure to require
 * custom menu items in the require list so they can be correctly decorated.
 */

goog.provide('longa.ui.Menu');
goog.provide('longa.ui.MenuRenderer');

goog.require('goog.ui.Component');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.registry');
goog.require('longa.ds.UserType');
goog.require('longa.ds.utils');
goog.require('longa.template.menu');
goog.require('longa.ui.Control');
goog.require('longa.ui.MenuItem');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.material.MenuItem');


/** @extends {longa.ui.Control} */
longa.ui.Menu = goog.defineClass(longa.ui.Control, {
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
     * Reference to the current selection (selected child - menu item).
     *
     * @type {goog.ui.Component}
     * @private
     */
    this.selectedChild_ = null;

    // Allow us to match the menu to the currently used screen
    this.getController().listen(longa.ds.Topic.SHOW_SCREEN, function(screen) {
      if (screen > 99) {
        this.clearSelection();
        return;
      } else if (screen > 9) {
        screen = parseInt(screen.toString()[0], 10);
      }
      this.getChildAt(goog.asserts.assertNumber(screen)).setSelected(true);
    });
    // Force update of menus visible to match the current user when AUTH
    // is changed.
    this.getController().listen(longa.ds.Topic.USER_AUTH_CHANGED, function() {
      this.updateVisibleMenusPerUsertype();
    });
  },

  /** @override */
  addMaterialChildren: function() {
    goog.base(this, 'addMaterialChildren');

    // The first child in the menu is the login. We use custom control to
    // trigger that so we hide it here.
    this.getChildAt(0).setVisible(false);

    // Find the default selected child
    for (var i = 0; i < this.getChildCount(); i++) {
      if (this.getChildAt(i).isSelected()) {
        this.selectedChild_ = this.getChildAt(i);
        break;
      }
    }
    this.updateVisibleMenusPerUsertype();
  },

  /**
   * Grabs the global user currently set and updates the menus to match the
   * user type.
   *
   * When the user is unknown (not logged in) we only enable public data
   * related menus.
   *
   * We also differentiate between user types and show / hide only the relevant
   * menu items.
   *
   * @protected
   */
  updateVisibleMenusPerUsertype: function() {
    var usertype = longa.ds.utils.getCurrentUserType();

    // enable all menus first and then disable the ones we need.
    if (usertype == longa.ds.UserType.UNKNONW) {
      this.disableAuthedMenus(true);
      this.setMenusForInvestor(true);
    } else if (usertype == longa.ds.UserType.INVESTOR) {
      this.disableAuthedMenus(false);
      this.setMenusForInvestor(true);
    } else {
      this.disableAuthedMenus(false);
      this.setMenusForInvestor(false);
    }
  },

  /**
   * Disables the menus that should be accerssible only to authenticated users.
   * @protected
   * @param {boolean} disabled If true the menus should be disabled.
   */
  disableAuthedMenus: function(disabled) {
    goog.array.forEach([1, 2, 4, 5, 6], function(idx) {
      this.getChildAt(idx).setEnabled(!disabled);
    }, this);
  },

  /**
   * Shows / hides the menus according to the user type.
   * @protected
   * @param {boolean} isInvestor If true the user is assumed to be investor.
   */
  setMenusForInvestor: function(isInvestor) {
    this.getChildAt(2).setVisible(!isInvestor);
    this.getChildAt(3).setVisible(isInvestor);
  },

  /** @override */
  enterDocument: function() {
    goog.base(this, 'enterDocument');
    this.getHandler().listen(this, goog.ui.Component.EventType.SELECT,
        this.handleSelectionEvent);
  },

  /**
   * We handle the selection so only a single item can be selected at a time.
   *
   * @protected
   * @param {goog.events.Event} e The SELECTED event.
   */
  handleSelectionEvent: function(e) {
    if (e.target != this.selectedChild_) {
      if (!goog.isNull(this.selectedChild_)) {
        this.selectedChild_.setSelected(false);
      }
      this.selectedChild_ = goog.asserts.assertInstanceof(e.target,
          goog.ui.Component);
      this.getController().push(longa.ds.Topic.SHOW_SCREEN,
          this.indexOfChild(this.selectedChild_));
    }
  },

  /**
   * We are calling this method when a view that is not in the menu is
   * being displayed.
   *
   * In our case this category is either the 'login' or one of the user
   * dependent entries.
   *
   * @protected
   */
  clearSelection: function() {
    if (!goog.isNull(this.selectedChild_)) {
      this.selectedChild_.setSelected(false);
      this.selectedChild_ = null;
    }
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
    return longa.template.menu.Menu(model);
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
