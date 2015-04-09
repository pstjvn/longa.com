
// This code is auto generate, please do not edit.

goog.provide('longa.gen.dto.LoginDetails');

goog.require('goog.asserts');
goog.require('pstj.ds.DtoBase');


goog.scope(function() {
var a = goog.asserts;


/**
 * DTO for user credentials when logging
 * @extends {pstj.ds.DtoBase}
 */
longa.gen.dto.LoginDetails = goog.defineClass(pstj.ds.DtoBase, {
  constructor: function() {
    pstj.ds.DtoBase.call(this);
    /**
     * The username to submit to the login
     * @type {!string}
     */
    this.username = '';
    /**
     * The password to use
     * @type {!string}
     */
    this.password = '';
    /**
     * The run procedure to call on the server when logging
     * @type {!string}
     */
    this.run = '';
  },

  /**@override */
  fromJSON: function(map) {
    this.username = a.assertString(map['username']);
    this.password = a.assertString(map['password']);
    this.run = a.assertString(map['run']);
    goog.base(this, 'fromJSON', map);
  },

  /**@override */
  toJSON: function() {
    return {
      'username': this.username,
      'password': this.password,
      'run': this.run
    };
  }
});
});  // goog.scope

