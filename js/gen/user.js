
// This code is auto generate, please do not edit.

goog.provide('longa.gen.dto.User');

goog.require('goog.asserts');
goog.require('pstj.ds.DtoBase');


goog.scope(function() {
var a = goog.asserts;


/**
 * DTO for user credentials
 * @extends {pstj.ds.DtoBase}
 */
longa.gen.dto.User = goog.defineClass(pstj.ds.DtoBase, {
  constructor: function() {
    pstj.ds.DtoBase.call(this);
    /**
     * The username as seen in the UI / as registered
     * @type {!string}
     */
    this.username = '';
    /**
     * The usertype, 0 is unknown, 1 is investor, 2 is seller
     * @type {!string}
     */
    this.usertype = '';
    /**
     * Unique identifier for user account id
     * @type {!number}
     */
    this.accountid = 0;
  },

  /** @override */
  fromJSON: function(map) {
    this.username = a.assertString(map['username']);
    this.usertype = a.assertString(map['usertype']);
    this.accountid = a.assertNumber(map['acctid']);
    goog.base(this, 'fromJSON', map);
  },

  /** @override */
  toJSON: function() {
    return {
      'username': this.username,
      'usertype': this.usertype,
      'acctid': this.accountid
    };
  }
});
});  // goog.scope

