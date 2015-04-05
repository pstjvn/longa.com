/**
 * @fileoverview Object to represents a unique used in the system.
 *
 * The account username type and id are stored here. This class is very basic
 * and is used to construct the more complex classes.
 *
 * It is also used to identify the currently logged in user.
 */

goog.provide('longa.ds.User');
goog.provide('longa.ds.User.UserType');

goog.require('pstj.ds.DtoBase');

goog.scope(function() {
var DTO = pstj.ds.DtoBase;


/** @extends {DTO} */
longa.ds.User = goog.defineClass(DTO, {
  constructor: function() {
    DTO.call(this);
    /** @type {string} */
    this.username = '';
    /** @type {string} */
    this.usertype = '';
    /** @type {number} */
    this.acctid = 0;
  },

  /** @override */
  toJSON: function() {
    return {
      'username': this.username,
      'usertype': this.usertype,
      'acctid': this.acctid
    };
  },

  /** @override */
  fromJSON: function(map) {
    this.acctid = goog.asserts.assertNumber(map['acctid']);
    this.username = goog.asserts.assertString(map['username']);
    this.usertype = goog.asserts.assertString(map['userType']);
    goog.base(this, 'fromJSON', map);
  },

  statics: {
    /**
     * Maps the user types to constants.
     * @enum {string}
     */
    UserType: {
      INVESTOR: '1',
      SELLER: '2'
    }
  }

});

});  // goog.scope
