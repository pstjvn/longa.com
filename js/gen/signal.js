
// This code is auto generate, please do not edit.

goog.provide('longa.gen.dto.Signal');

goog.require('goog.asserts');
goog.require('pstj.ds.DtoBase');


goog.scope(function() {
var a = goog.asserts;


/**
 * Describes a single signal for buy/sell
 * @extends {pstj.ds.DtoBase}
 */
longa.gen.dto.Signal = goog.defineClass(pstj.ds.DtoBase, {
  constructor: function() {
    pstj.ds.DtoBase.call(this);
    /** @type {!number} */
    this.id = 0;
    /** @type {!string} */
    this.username = '';
    /** @type {!string} */
    this.symbol = '';
    /** @type {!number} */
    this.openPrice = 0;
    /** @type {number} */
    this.closePrice = 0;
    /** @type {!number} */
    this.change = 0;
    /** @type {!number} */
    this.charge = 0;
    /** @type {!string} */
    this.type = '';
    /** @type {!boolean} */
    this.status = false;
    /** @type {!number} */
    this.currentPrice = 0;
    /** @type {!boolean} */
    this.seller = false;
    /** @type {!string} */
    this.openTimestamp = '';
    /** @type {string} */
    this.closeTimestamp = '';
  },

  /** @override */
  fromJSON: function(map) {
    this.id = a.assertNumber(map['signal_id']);
    this.username = a.assertString(map['username']);
    this.symbol = a.assertString(map['symbol']);
    this.openPrice = a.assertNumber(map['open']);
    this.closePrice = a.assertNumber((goog.isNumber(map['close']) ?
        map['close'] : 0));
    this.change = a.assertNumber(map['pl_change']);
    this.charge = a.assertNumber(map['charge']);
    this.type = a.assertString(map['type']);
    this.status = !!(a.assertNumber(map['status']));
    this.currentPrice = a.assertNumber(map['cur_price']);
    this.seller = a.assertBoolean(map['seller']);
    this.openTimestamp = a.assertString(map['open_time']);
    this.closeTimestamp = a.assertString((goog.isString(map['close_time']) ?
        map['close_time'] : ''));
    goog.base(this, 'fromJSON', map);
  },

  /** @override */
  toJSON: function() {
    return {
      'signal_id': this.id,
      'username': this.username,
      'symbol': this.symbol,
      'open': this.openPrice,
      'close': this.closePrice,
      'pl_change': this.change,
      'charge': this.charge,
      'type': this.type,
      'status': (this.status ? 1 : 0),
      'cur_price': this.currentPrice,
      'seller': this.seller,
      'open_time': this.openTimestamp,
      'close_time': this.closeTimestamp
    };
  }
});
});  // goog.scope

