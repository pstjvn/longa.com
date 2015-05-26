
// This code is auto generate, please do not edit.

goog.provide('longa.gen.dto.Service');

goog.require('goog.asserts');
goog.require('pstj.ds.DtoBase');


goog.scope(function() {
var a = goog.asserts;


/**
 * Describes the service for provider
 * @extends {pstj.ds.DtoBase}
 */
longa.gen.dto.Service = goog.defineClass(pstj.ds.DtoBase, {
  constructor: function() {
    pstj.ds.DtoBase.call(this);
    /** @type {string} */
    this.run = '';
    /** @type {!string} */
    this.description = '';
    /** @type {!number} */
    this.minimumBalanceRequired = 0;
    /** @type {!number} */
    this.profitCharge = 0;
    /** @type {!boolean} */
    this.status = false;
    /** @type {!number} */
    this.serviceid = 0;
    /** @type {!boolean} */
    this.paid = false;
  },

  /** @override */
  fromJSON: function(map) {
    this.run = a.assertString((goog.isString(map['run']) ?
        map['run'] : ''));
    this.description = a.assertString(map['descr']);
    this.minimumBalanceRequired = a.assertNumber(map['min_balance']);
    this.profitCharge = a.assertNumber(map['pip_charge']);
    this.status = !!(a.assertNumber(map['serv_status']));
    this.serviceid = parseFloat(a.assertString(map['serv_id']));
    this.paid = !!(a.assertNumber(map['paid']));
    goog.base(this, 'fromJSON', map);
  },

  /** @override */
  toJSON: function() {
    return {
      'run': this.run,
      'descr': this.description,
      'min_balance': this.minimumBalanceRequired,
      'pip_charge': this.profitCharge,
      'serv_status': (this.status ? 1 : 0),
      'serv_id': this.serviceid.toString(),
      'paid': (this.paid ? 1 : 0)
    };
  }
});
});  // goog.scope

