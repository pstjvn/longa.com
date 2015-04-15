goog.provide('longa.control.Auth');

goog.require('goog.dom.classlist');
goog.require('goog.dom.dataset');
goog.require('goog.events');
goog.require('longa.ds.Topic');
goog.require('longa.gen.dto.LoginDetails');
goog.require('longa.rpc');
goog.require('longa.ui.LoginForm');
goog.require('longa.ui.RegistrationForm');
goog.require('pstj.control.Control');

goog.scope(function() {
var events = goog.events;
var T = longa.ds.Topic;
var rpc = longa.rpc.instance;


/** @extends {pstj.control.Control} */
longa.control.Auth = goog.defineClass(pstj.control.Control, {
  constructor: function() {
    pstj.control.Control.call(this);
    this.login = new longa.ui.LoginForm();
    this.reg = new longa.ui.RegistrationForm();
    this.recover = null;
    this.init();
  },

  /** @override */
  init: function() {
    goog.base(this, 'init');
    // handle the login form component.
    events.listen(this.login,
        longa.ui.LoginForm.EventType.CALL_LOGIN, this.handleLoginPressed,
        undefined, this);

    events.listen(this.login, pstj.agent.Pointer.EventType.TAP,
        this.handleTapsOnElements, undefined, this);

    // Listen to global request for login.
    this.listen(T.USER_REQUESTED_LOGIN, this.handleShowLogin);
    this.listen(T.USER_REQUESTED_REGISTRATION, this.handleShowRegistration);
    this.listen(T.USER_REQUESTED_ACCOUNT_RECOVERY, this.handleShowRecovery);
  },

  handleTapsOnElements: function(e) {
    e.stopPropagation();
    var el = e.getSourceElement();
    if (goog.dom.classlist.contains(el, goog.getCssName('linklike'))) {
      switch (goog.dom.dataset.get(el, 'request')) {
        case 'register':
          this.push(T.USER_REQUESTED_REGISTRATION);
          break;
        case 'recovery':
          this.push(T.USER_REQUESTED_ACCOUNT_RECOVERY);
          break;
        case 'login':
          this.push(T.USER_REQUESTED_LOGIN);
          break;
        default: throw new Error(
            'You must have forgot to set request attribute');
      }
    }
  },

  /**
   * Shows the corresponding procedure on the screen.
   */
  handleShowLogin: function() {
    var div = goog.dom.createDom('div', goog.getCssName('auth-container'));
    document.body.appendChild(div);
    this.login.render(div);
  },

  handleShowRegistration: function() {
    var div = goog.dom.createDom('div', goog.getCssName('auth-container'));
    document.body.appendChild(div);
    this.reg.render(div);
  },

  handleShowRecovery: function() {
    console.log('Show recovery');
  },


  /**
   * Handles the press of the login button in the UI.
   * @param {goog.events.Event} e The login form submit event.
   */
  handleLoginPressed: function(e) {
    if (this.login.isValid()) {

      this.login.showRecoveryLink(false);
      this.login.removeError();

      var details = new longa.gen.dto.LoginDetails();
      details.username = this.login.getUsername();
      details.password = this.login.getPassword();

      rpc.login(details)
        .then(this.handleLoginSuccess, this.handleLoginFailure, this)
        .thenAlways(this.handleLoginEnd, this);

      // after the request is sent...
      if (this.login.isKeepCredentials()) {
        // TODO: Store login info if checked
      }
    } else {

      this.login.setError('Username and passowrd are required');
      this.login.showRecoveryLink(true);
    }
  },

  /**
   * Handles successfull login.
   * @param {longa.gen.dto.User} result
   */
  handleLoginSuccess: function(result) {
    console.log('We have been logged in!', result);
  },

  /**
   * Handles errors thrown while performing login.
   * @param {*} error
   */
  handleLoginFailure: function(error) {
    goog.asserts.assertInstanceof(error, Error);
    this.login.setError(error.message);
    this.login.showRecoveryLink(true);
  },

  /**
   * Called always when server request for login completes.
   */
  handleLoginEnd: function() {
    this.login.setEnabled(true);
  }
});

});  // goog.scope
