/**
 * @fileoverview Provides.
 */

goog.provide('longa.ui.UserAuth');
goog.provide('longa.ui.UserAuthRenderer');

goog.require('goog.style');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.registry');
goog.require('longa.ds.Screen');
goog.require('longa.ds.Topic');
goog.require('longa.ds.utils');
goog.require('longa.template.components');
goog.require('longa.ui.Control');
goog.require('pstj.material.Button');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.material.IconButton');
goog.require('pstj.material.IconContainer');
goog.require('pstj.material.icon');


/** @extends {longa.ui.Control} */
longa.ui.UserAuth = goog.defineClass(longa.ui.Control, {
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

    // Configure controller.
    this.getController().listen(longa.ds.Topic.USER_AUTH_CHANGED,
        this.setVisibleSectionByUser);
  },

  /**
   * Updates the visibility of the widget based on the current user.
   * @private
   */
  setVisibleSectionByUser: function() {
    var hasUser = longa.ds.utils.isKnownUser();
    var sections = this.querySelectorAll('section');
    goog.style.setElementShown(sections[0], !hasUser);
    goog.style.setElementShown(sections[1], hasUser);
    if (hasUser) {
      goog.dom.setTextContent(this.getElementByClass(goog.getCssName(
          this.getRenderer().getCssClass(), 'username')),
          longa.data.user.username);

      if (longa.ds.utils.isInvestor()) {
        goog.dom.classlist.swap(this.getElementByClass(goog.getCssName(
            this.getRenderer().getCssClass(), 'usertype')),
            goog.getCssName('seller'),
            goog.getCssName('investor'));
      } else {
        goog.dom.classlist.swap(this.getElementByClass(goog.getCssName(
            this.getRenderer().getCssClass(), 'usertype')),
            goog.getCssName('investor'),
            goog.getCssName('seller'));
      }
    }
  },

  /** @override */
  enterDocument: function() {
    goog.base(this, 'enterDocument');
    this.setVisibleSectionByUser();
    this.getHandler().listen(this, goog.ui.Component.EventType.ACTION,
        this.handleAction_);
  },

  /**
   * Handles the action events from pressed buttons. The buttons must have
   * names actions.
   *
   * @param {goog.events.Event} e The ACTION event.
   * @private
   */
  handleAction_: function(e) {
    var button = goog.asserts.assertInstanceof(e.target, pstj.material.Button);
    switch (button.getAction()) {
      case 'login':
        this.getController().push(
            longa.ds.Topic.SHOW_SCREEN, longa.ds.Screen.LOGIN);
        break;
      case 'logout':
        this.getController().push(longa.ds.Topic.USER_AUTH_FORGET);
        break;
      default: throw new Error('Unknown action name: ' + button.getAction());
    }
  }
});


/** @extends {pstj.material.ElementRenderer} */
longa.ui.UserAuthRenderer = goog.defineClass(pstj.material.ElementRenderer, {
  constructor: function() {
    pstj.material.ElementRenderer.call(this);
  },

  /** @inheritDoc */
  getCssClass: function() {
    return longa.ui.UserAuthRenderer.CSS_CLASS;
  },

  /** @inheritDoc */
  getTemplate: function(model) {
    return longa.template.components.UserAuth(model);
  },

  statics: {
    /**
     * @final
     * @type {string}
     */
    CSS_CLASS: goog.getCssName('longa-app-userauth')
  }
});
goog.addSingletonGetter(longa.ui.UserAuthRenderer);

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(longa.ui.UserAuth,
    longa.ui.UserAuthRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    longa.ui.UserAuthRenderer.CSS_CLASS, function() {
      return new longa.ui.UserAuth(null);
    });
