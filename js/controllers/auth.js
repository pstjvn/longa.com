goog.provide('longa.control.Auth');

goog.require('longa.ds.Topic');
goog.require('longa.gen.dto.LoginDetails');
goog.require('longa.rpc');
goog.require('pstj.control.Control');

goog.scope(function() {
// var T = longa.ds.Topic;
// var rpc = longa.rpc.instance;


/** @extends {pstj.control.Control} */
longa.control.Auth = goog.defineClass(pstj.control.Control, {
  /** @param {Object=} opt_context The context to use. */
  constructor: function(opt_context) {
    pstj.control.Control.call(this, opt_context);
    // this.delayShowLogin_ = new goog.async.Delay(function() {
    //   this.push(T.USER_REQUESTED_LOGIN);
    // }, 3000, this);
  }

  // /** @override */
  // init: function() {
  //   goog.base(this, 'init');

  //   // handle the form submitions
  //   this.getHandler()
  //       .listen(this.login, goog.ui.Component.EventType.ACTION,
  //           this.handleLoginPressed)
  //       .listen(this.recover, goog.ui.Component.EventType.ACTION,
  //           this.handleRecoveryPressed)
  //       .listen(this.reg, goog.ui.Component.EventType.ACTION,
  //           this.handleRegisterPressed);
  // },

  // /**
  //  * Supports moving between auth states internally (via links in the forms).
  //  * @param {goog.events.Event} e The tap event.
  //  * @protected
  //  */
  // handleTapsOnElements: function(e) {
  //   e.stopPropagation();
  //   var el = e.getSourceElement();
  //   if (goog.dom.classlist.contains(el, goog.getCssName('linklike'))) {
  //     switch (goog.dom.dataset.get(el, 'request')) {
  //       case 'register':
  //         this.push(T.SHOW_SCREEN, longa.ds.Screen.REGISTER);
  //         break;
  //       case 'recovery':
  //         this.push(T.SHOW_SCREEN, longa.ds.Screen.RECOVER);
  //         break;
  //       case 'login':
  //         this.push(T.SHOW_SCREEN, longa.ds.Screen.LOGIN);
  //         break;
  //       default: throw new Error(
  //           'You must have forgot to set request attribute');
  //     }
  //   }
  // },


  // /**
  //  * Handles the press of the login button in the UI.
  //  * @param {goog.events.Event} e The login form submit event.
  //  */
  // handleLoginPressed: function(e) {
  //   if (this.login.isValid()) {

  //     this.login.setEnabled(false);
  //     this.login.showRecoveryLink(false);
  //     this.login.removeError();

  //     var details = new longa.gen.dto.LoginDetails();
  //     details.username = this.login.getUsername();
  //     details.password = this.login.getPassword();

  //     rpc.login(details)
  //       .then(this.handleLoginSuccess, this.handleLoginFailure, this)
  //       .thenAlways(this.handleLoginEnd, this);

  //     // after the request is sent...
  //     if (this.login.isKeepCredentials()) {
  //       // TODO: Store login info if checked
  //     }
  //   } else {

  //     this.login.setError('Username and passowrd are required');
  //     this.login.showRecoveryLink(true);
  //   }
  // },

  // /**
  //  * Handles successfull login.
  //  * @param {longa.gen.dto.User} result
  //  */
  // handleLoginSuccess: function(result) {
  //   this.push(T.USER_AUTHENTICATED);
  //   console.log('We have been logged in!', result);
  // },

  // /**
  //  * Handles errors thrown while performing login.
  //  * @param {*} error
  //  */
  // handleLoginFailure: function(error) {
  //   goog.asserts.assertInstanceof(error, Error);
  //   this.login.setError(error.message);
  //   this.login.showRecoveryLink(true);
  // },

  // /**
  //  * Called always when server request for login completes.
  //  */
  // handleLoginEnd: function() {
  //   this.login.setEnabled(true);
  // },

  // /**
  //  * Handles the pressing of the recovery button on recovery form.
  //  * @param {goog.events.Event} e
  //  * @protected
  //  */
  // handleRecoveryPressed: function(e) {
  //   if (this.recover.isValid()) {
  //     this.recover.setEnabled(false);
  //     rpc.recover(this.recover.getEmail())
  //         .then(this.handleRecoverySuccess, this.handleRecoveryFailure, this)
  //         .thenAlways(this.handleRecoveryEnd, this);
  //   }
  // },

  // handleRecoverySuccess: function(success) {
  //   this.recover.setError('Please, check your e-mail!');
  //   this.delayShowLogin_.start();
  // },

  // handleRecoveryFailure: function(error) {
  //   goog.asserts.assertInstanceof(error, Error);
  //   this.recover.setError(error.message);
  // },

  // handleRecoveryEnd: function() {
  //   this.recover.setEnabled(true);
  // },

  // handleRegisterPressed: function(e) {
  //   e.stopPropagation();
  //   this.reg.setEnabled(false);
  // }
});
goog.addSingletonGetter(longa.control.Auth);

});  // goog.scope
