goog.provide('longa.ds.Alert');

goog.require('goog.asserts');
goog.require('pstj.ds.DtoBase');

goog.scope(function() {
var DTO = pstj.ds.DtoBase;
var a = goog.asserts;


/** @extends {DTO} */
longa.ds.Alert = goog.defineClass(DTO, {
  constructor: function() {
    DTO.call(this);
    /** @type {number} */
    this.id = 0;
    /** @type {string} */
    this.username = '';
    /** @type {number} */
    this.acctid = 0;
    /** @type {longa.ds.Alert.Type} */
    this.type = longa.ds.Alert.Type.UNKNOWN;
    /** @type {longa.ds.Alert.Status} */
    this.status = longa.ds.Alert.Status.UNREAD;
    /** @type {string} */
    this.date = '';
    /** @type {string} */
    this.text = '';
  },

  /** @override */
  fromJSON: function(map) {
    this.id = a.assertNumber(map['alert_id']);
    this.username = a.assertString(map['username']);
    this.acctid = a.assertNumber(map['provider_acctid']);
    this.date = a.assertString(map['alert_date']);
    this.text = a.assertString(map['alert_text']);

    // handle types.
    a.assertString(map['alert_type']);
    switch (map['alert_type']) {
      case longa.ds.Alert.Type.SIGNAL:
        this.type = longa.ds.Alert.Type.SIGNAL;
        break;
      case longa.ds.Alert.Type.BALANCE:
        this.type = longa.ds.Alert.Type.BALANCE;
        break;
      case longa.ds.Alert.Type.PROVIDER:
        this.type = longa.ds.Alert.Type.PROVIDER;
        break;
      default: throw new Error('Unkown alert type: ' + map['alert_type']);
    }

    // Handle status.
    a.assertString(map['status']);
    switch (map['status']) {
      case longa.ds.Alert.Status.UNREAD:
        this.status = longa.ds.Alert.Status.UNREAD;
        break;
      case longa.ds.Alert.Status.READ:
        this.status = longa.ds.Alert.Status.READ;
        break;
      default: throw new Error('Unknown alert status: ' + map['status']);
    }

    goog.base(this, 'fromJSON', map);
  },

  statics: {
    /**
     * The types of alerts we support currently.
     * @enum {string}
     */
    Type: {
      UNKNOWN: 'UNKNOWN',
      SIGNAL: 'SIGNAL',
      BALANCE: 'BALANCE',
      PROVIDER: 'PROVIDER'
    },

    /**
     * The known statuses for the alerts.
     * @enum {string}
     */
    Status: {
      UNREAD: 'unread',
      READ: 'read'
    }
  }
});


});  // goog.scope
