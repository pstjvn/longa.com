goog.provide('longa.ds.Profile');

goog.require('goog.asserts');
goog.require('pstj.ds.DtoBase');

goog.scope(function() {
var DTO = pstj.ds.DtoBase;
var a = goog.asserts;


/** @extends {DTO} */
longa.ds.Profile = goog.defineClass(DTO, {
  constructor: function() {
    DTO.call(this);
    /** @type {string} */
    this.password = '';
    /** @type {string} */
    this.rpassword = '';
    /** @type {string} */
    this.firstName = '';
    /** @type {string} */
    this.lastName = '';
    /** @type {string} */
    this.companyName = '';
    /** @type {boolean} */
    this.isVerified = false;
    /** @type {string} */
    this.email = '';
    /** @type {string} */
    this.paypalEmail = '';
    /** @type {string} */
    this.phone = '';
    /** @type {string} */
    this.address = '';
    /** @type {string} */
    this.city = '';
    /** @type {string} */
    this.state = '';
    /** @type {string} */
    this.country = '';
  },

  /** @override */
  fromJSON: function(map) {
    // Password is never set server side! it should alwas be read
    // from the user UI.
    this.firstName = a.assertString(map['fname']);
    this.lastName = a.assertString(map['lname']);
    this.companyName = a.assertString(map['company']);
    this.isVerified = (a.assertString(map['verify']) == 'verified');
    this.email = a.assertString(map['email']);
    this.paypalEmail = a.assertString(map['pp_email']);
    this.phone = a.assertString(map['phone']);
    this.address = a.assertString(map['address']);
    this.city = a.assertString(map['city']);
    this.state = a.assertString(map['state']);
    this.country = a.assertString(map['country']);
    goog.base(this, 'fromJSON', map);
  },

  /** @override */
  toJSON: function() {
    // TODO: currently it seems that the password cannot be updated. Check with
    // server guy.
    return {
      // Server needs this in order to make sense of the request
      'run': 'profile',
      'fname': this.firstName,
      'lname': this.lastName,
      'company': this.companyName,
      'email': this.email,
      'pp_email': this.paypalEmail,
      'phone': this.phone,
      'address': this.address,
      'city': this.city,
      'state': this.state,
      'country': this.country
    };
  }
});
});  // goog.scope
