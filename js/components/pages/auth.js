goog.provide('longa.ui.Auth');

goog.require('goog.dom.classlist');
goog.require('goog.dom.dataset');
goog.require('goog.ui.registry');
goog.require('longa.control.Auth');
goog.require('longa.ds.Topic');
goog.require('longa.gen.dto.LoginDetails');
goog.require('longa.template');
goog.require('longa.ui.LoginForm');
goog.require('longa.ui.Page');
goog.require('longa.ui.Pages');
goog.require('longa.ui.RecoverForm');
goog.require('longa.ui.RegistrationForm');
goog.require('pstj.material.Button');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');


/** @extends {pstj.material.Element} */
longa.ui.Auth = goog.defineClass(pstj.material.Element, {
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
     * The controller for this widget.
     * @type {!longa.control.Auth}
     * @protected
     */
    this.control = longa.control.Auth.getInstance();
    this.control.setScope(this);
    this.control.listen(longa.ds.Topic.SHOW_SCREEN, function(screen) {
      goog.asserts.assertNumber(screen);
      if (screen > 99 && screen < 103) {
        var s = screen - 100;
        this.getPages().setSelectedIndex(s);
      }
    });

    this.control.listen(longa.ds.Topic.USER_AUTH_CHANGED, function() {
      // Basically - reenable login screen action button once we complete.
      this.getLoginForm_().setEnabled(true);
    });

    this.control.listen(longa.ds.Topic.USER_AUTH_FAILED, function(err) {
      goog.asserts.assertInstanceof(err, Error);
      this.getLoginForm_().showRecoveryLink(true);
      this.getLoginForm_().setError(err.message);
    });

    // Configure for logging out automatically.
    this.control.listen(longa.ds.Topic.USER_AUTH_FORGET, function() {
      this.getLoginForm_().clear();
      this.control.logout();
    });
  },

  /** @override */
  addMaterialChildren: function() {
    goog.base(this, 'addMaterialChildren');
    // this.loginPage = goog.asserts.assertInstanceof(
    //     this.getChildAt(0).getChildAt(0), longa.ui.Page);
    // this.registrationPage = goog.asserts.assertInstanceof(
    //     this.getChildAt(0).getChildAt(1), longa.ui.Page);
    // this.recoverPage = goog.asserts.assertInstanceof(
    //     this.getChildAt(0).getChildAt(2), longa.ui.Page);
  },

  /** @override */
  enterDocument: function() {
    goog.base(this, 'enterDocument');
    this.getHandler()
      .listen(this, pstj.agent.Pointer.EventType.TAP, this.handleTaps_)
      .listen(this.getLoginForm_(), goog.ui.Component.EventType.ACTION,
        this.handleLoginFormSubmit_);
  },

  /**
   * @private
   * @param {!goog.events.Event} e The action event object.
   */
  handleLoginFormSubmit_: function(e) {
    var login = this.getLoginForm_();
    if (e.target instanceof pstj.material.Button ||
        e.target instanceof pstj.material.InputBase) {
      login.removeError();
      if (login.isValid()) {
        login.setEnabled(false);
        var detail = new longa.gen.dto.LoginDetails();
        detail.username = login.getUsername();
        detail.password = login.getPassword();
        this.control.login(detail, login.isKeepCredentials());
      } else {
        login.setError('Username/password must be valid');
      }
    }
  },

  /**
   * @private
   * @param {!pstj.agent.PointerEvent} e The pointer event.
   */
  handleTaps_: function(e) {
    e.stopPropagation();
    var el = e.getSourceElement();
    if (goog.dom.classlist.contains(el, goog.getCssName('linklike'))) {
      switch (goog.dom.dataset.get(el, 'request')) {
        case 'register':
          this.control.push(longa.ds.Topic.SHOW_SCREEN,
              longa.ds.Screen.REGISTER);
          break;
        case 'recovery':
          this.control.push(longa.ds.Topic.SHOW_SCREEN,
              longa.ds.Screen.RECOVER);
          break;
        case 'login':
          this.control.push(longa.ds.Topic.SHOW_SCREEN,
              longa.ds.Screen.LOGIN);
          break;
        default: throw new Error(
            'You must have forgot to set request attribute');
      }
    }
  },

  /**
   * Getter for the pages widget.
   * @protected
   * @return {!longa.ui.Pages}
   */
  getPages: function() {
    return goog.asserts.assertInstanceof(this.getChildAt(0), longa.ui.Pages);
  },

  /**
   * Provides seamless access to the login form.
   * @return {!longa.ui.LoginForm}
   * @private
   */
  getLoginForm_: function() {
    return goog.asserts.assertInstanceof(
        this.getPages().getChildAt(0).getChildAt(0),
        longa.ui.LoginForm);
  },

  /**
   * Access to the registration form.
   * @return {!longa.ui.RegistrationForm}
   * @private
   */
  getRegistrationForm_: function() {
    return goog.asserts.assertInstanceof(
        this.getPages().getChildAt(1).getChildAt(0),
        longa.ui.RegistrationForm);
  },

  /**
   * @return {!longa.ui.RecoverForm}
   * @private
   */
  getRecoverForm_: function() {
    return goog.asserts.assertInstanceof(
        this.getPages().getChildAt(2).getChildAt(0),
        longa.ui.RecoverForm);
  }
});


/** @extends {pstj.material.ElementRenderer} */
longa.ui.AuthRenderer = goog.defineClass(pstj.material.ElementRenderer, {
  constructor: function() {
    pstj.material.ElementRenderer.call(this);
  },

  /** @override */
  getCssClass: function() {
    return longa.ui.AuthRenderer.CSS_CLASS;
  },

  /** @override */
  getTemplate: function(model) {
    return longa.template.Auth(model);
  },

  statics: {
    /**
     * @final
     * @type {string}
     */
    CSS_CLASS: goog.getCssName('longa-app-auth')
  }
});
goog.addSingletonGetter(longa.ui.AuthRenderer);

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(longa.ui.Auth,
    longa.ui.AuthRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    longa.ui.AuthRenderer.CSS_CLASS, function() {
      return new longa.ui.Auth(null);
    });
