goog.provide('longa.ui.UserAuth');

goog.require('goog.async.Delay');
goog.require('goog.style');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.registry');
goog.require('longa.ds.Screen');
goog.require('longa.ds.Topic');
goog.require('pstj.control.Control');
goog.require('pstj.material.Button');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.material.IconButton');
goog.require('pstj.material.IconContainer');
goog.require('pstj.material.icon');


/** @extends {pstj.material.Element} */
longa.ui.UserAuth = goog.defineClass(pstj.material.Element, {
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
     * Flag for the delayed pushes.
     * @type {boolean}
     * @private
     */
    this.pushLogin_ = false;
    /**
     * @private
     * @type {goog.async.Delay}
     */
    this.delay_ = new goog.async.Delay(function() {
      if (this.pushLogin_) {
        this.control_.push(longa.ds.Topic.SHOW_SCREEN, longa.ds.Screen.LOGIN);
      } else {
        this.control_.push(longa.ds.Topic.USER_AUTH_FORGET);
      }
    }, 100, this);
    /**
     * @private
     * @type {pstj.control.Control}
     */
    this.control_ = new pstj.control.Control(this);
    this.control_.init();
    this.control_.listen(longa.ds.Topic.USER_AUTH_CHANGED,
        this.setVisibleSectionByUser);
    this.registerDisposable(this.delay_);
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
   * Handles the clicks on the buttons.
   * @param {goog.events.Event} e The ACTION event.
   * @private
   */
  handleAction_: function(e) {
    if (e.target == this.getChildAt(0)) {
      this.pushLogin_ = true;
    } else {
      this.pushLogin_ = false;
    }
    this.delay_.start();
  }
});


/** @extends {pstj.material.ElementRenderer} */
longa.ui.UserAuthRenderer = goog.defineClass(pstj.material.ElementRenderer, {
  constructor: function() {
    pstj.material.ElementRenderer.call(this);
  },

  /** @override */
  getCssClass: function() {
    return longa.ui.UserAuthRenderer.CSS_CLASS;
  },

  /** @override */
  getTemplate: function(model) {
    return longa.template.UserAuth(model);
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
