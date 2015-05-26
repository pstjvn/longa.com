
// This code is auto generate, please do not edit.

goog.provide('longa.gen.dto.Profile');

goog.require('goog.asserts');
goog.require('pstj.ds.DtoBase');


goog.scope(function() {
var a = goog.asserts;


/**
 * Represents the user profile tokens
 * @extends {pstj.ds.DtoBase}
 */
longa.gen.dto.Profile = goog.defineClass(pstj.ds.DtoBase, {
  constructor: function() {
    pstj.ds.DtoBase.call(this);
    /** @type {string} */
    this.run = '';
    /** @type {!string} */
    this.firstName = '';
    /** @type {!string} */
    this.lastName = '';
    /** @type {!string} */
    this.address = '';
    /** @type {!string} */
    this.city = '';
    /** @type {!string} */
    this.state = '';
    /** @type {!string} */
    this.country = '';
    /** @type {!string} */
    this.company = '';
    /** @type {!string} */
    this.email = '';
    /** @type {!string} */
    this.phone = '';
    /** @type {!string} */
    this.pp_email = '';
    /** @type {string} */
    this.password = '';
    /** @type {string} */
    this.confirmPassword = '';
  },

  /** @override */
  fromJSON: function(map) {
    this.run = a.assertString((goog.isString(map['run']) ?
        map['run'] : ''));
    this.firstName = a.assertString(map['fname']);
    this.lastName = a.assertString(map['lname']);
    this.address = a.assertString(map['address']);
    this.city = a.assertString(map['city']);
    this.state = a.assertString(map['state']);
    this.country = a.assertString(map['country']);
    this.company = a.assertString(map['company']);
    this.email = a.assertString(map['email']);
    this.phone = a.assertString(map['phone']);
    this.pp_email = a.assertString(map['pp_email']);
    this.password = a.assertString((goog.isString(map['password']) ?
        map['password'] : ''));
    this.confirmPassword = a.assertString((goog.isString(map['cpassword']) ?
        map['cpassword'] : ''));
    goog.base(this, 'fromJSON', map);
  },

  /** @override */
  toJSON: function() {
    return {
      'run': this.run,
      'fname': this.firstName,
      'lname': this.lastName,
      'address': this.address,
      'city': this.city,
      'state': this.state,
      'country': this.country,
      'company': this.company,
      'email': this.email,
      'phone': this.phone,
      'pp_email': this.pp_email,
      'password': this.password,
      'cpassword': this.confirmPassword
    };
  }
});
});  // goog.scope

