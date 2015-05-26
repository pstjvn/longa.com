
// This code is auto generate, please do not edit.

goog.provide('longa.gen.dto.RegistrationDetails');

goog.require('goog.asserts');
goog.require('goog.object');
goog.require('longa.gen.dto.Profile');


goog.scope(function() {
var a = goog.asserts;


/**
 * Represents registration details for a new user.
 * @extends {longa.gen.dto.Profile}
 */
longa.gen.dto.RegistrationDetails = goog.defineClass(longa.gen.dto.Profile, {
  constructor: function() {
    longa.gen.dto.Profile.call(this);
    /** @type {!string} */
    this.password = '';
    /** @type {!string} */
    this.rpassword = '';
    /** @type {!string} */
    this.type = '';
  },

  /** @override */
  fromJSON: function(map) {
    this.password = a.assertString(map['password']);
    this.rpassword = a.assertString(map['rpassword']);
    this.type = a.assertNumber(map['type']).toString();
    goog.base(this, 'fromJSON', map);
  },

  /** @override */
  toJSON: function() {
    var exports = {
      'password': this.password,
      'rpassword': this.rpassword,
      'type': parseFloat(this.type)
    };
    goog.object.extend(exports,
        a.assertObject(goog.base(this, 'toJSON')));
    return exports;
  }
});
});  // goog.scope

