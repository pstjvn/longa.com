
// This code is auto generate, please do not edit.

goog.provide('longa.gen.dto.Alert');

goog.require('goog.asserts');
goog.require('pstj.ds.DtoBase');


goog.scope(function() {
var a = goog.asserts;


/**
 * Describes a single alert for this user
 * @extends {pstj.ds.DtoBase}
 */
longa.gen.dto.Alert = goog.defineClass(pstj.ds.DtoBase, {
  constructor: function() {
    pstj.ds.DtoBase.call(this);
    /**@type {!number} */
    this.id = 0;
    /**@type {!string} */
    this.text = '';
    /**@type {!string} */
    this.type = '';
    /**@type {!string} */
    this.date = '';
    /**@type {!number} */
    this.accountid = 0;
    /**@type {!string} */
    this.username = '';
    /**@type {!boolean} */
    this.read = false;
  },

  /**@override */
  fromJSON: function(map) {
    this.id = a.assertNumber(map['alert_id']);
    this.text = a.assertString(map['alert_text']);
    this.type = a.assertString(map['alert_type']);
    this.date = a.assertString(map['alert_date']);
    this.accountid = a.assertNumber(map['provider_acctid']);
    this.username = a.assertString(map['username']);
    this.read = !!(a.assertNumber(map['read']));
    goog.base(this, 'fromJSON', map);
  },

  /**@override */
  toJSON: function() {
    return {
      'alert_id': this.id,
      'alert_text': this.text,
      'alert_type': this.type,
      'alert_date': this.date,
      'provider_acctid': this.accountid,
      'username': this.username,
      'read': parseFloat(this.read)
    };
  }
});
});  // goog.scope

