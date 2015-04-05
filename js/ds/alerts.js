goog.provide('longa.ds.Alerts');

goog.require('goog.asserts');
goog.require('goog.async.Delay');
goog.require('longa.ds.Alert');
goog.require('pstj.ds.DtoBase');

goog.scope(function() {
var DTO = pstj.ds.DtoBase;
var Alert = longa.ds.Alert;
var a = goog.asserts;


/** @extends {DTO} */
longa.ds.Alerts = goog.defineClass(DTO, {
  constructor: function() {
    DTO.call(this);
    /**
     * The list of allerts curently we have in our disposal.
     * @type {Array<Alert>}
     * @final
     */
    this.alerts = [];
    /**
     * How much time we should wait in seconds before we try to
     * update the list.
     * @type {number}
     */
    this.updateDelay = 0;
    /**
     * @type {!goog.async.Delay}
     * @private
     */
    this.delayedSort_ = new goog.async.Delay(this.sort_, 100, this);
    /**
     * The sort function to use when performing sorting
     * of the list. It should be a standard sort function for array.
     *
     * @type {function(Alert, Alert): number}
     * @private
     */
    this.sortFn_ = longa.ds.Alerts.DefaultSort;
    /**
     * The ID of the most recent alert we have from the server. used
     * for retrieving only newer alerts while the app is working.
     * @type {number}
     */
    this.lastAlertId = 0;
  },

  /**
   * Sets the sort function to be used when sorting the listing.
   * @param {function(Alert, Alert): number} fn
   */
  setSortFucntion: function(fn) {
    this.sortFn_ = fn;
    this.sort_();
  },

  /** @override */
  fromJSON: function(map) {
    this.updateDelay = a.assertNumber(map['delay']);
    goog.array.forEach(a.assertArray(map['alert']), function(alert) {
      this.addAlert(alert);
    }, this);
    goog.base(this, 'fromJSON', map);
  },

  /**
   * Allows for independent adding of alerts to the listing, without destroying
   * the already existing instances in the list. This is used to update the
   * list while th app is working.
   *
   * @param {Object<string, *>} alert
   */
  addAlert: function(alert) {
    var a = new Alert();
    a.fromJSON(alert);
    this.alerts.push(a);
    this.delayedSort_.start();
  },

  /**
   * Returns the number of Alert items in the list.
   * @return {number}
   */
  getCount: function() {
    return this.alerts.length;
  },

  /**
   * Adds another {@code longa.ds.Alerts} instance to the current one and
   * merges its alerts with it.
   *
   * Note that this also triggers resortingof the list.
   *
   * @param {longa.ds.Alerts} alerts
   */
  concat: function(alerts) {
    this.updateDelay = alerts.updateDelay;
    goog.array.extend(this.alerts, alerts.alerts);
    this.delayedSort_.start();
  },

  /**
   * Performs the intrinsic sorting and emits a sort event
   * when completed.
   */
  sort_: function() {
    if (!goog.isNull(this.sortFn_)) {
      goog.array.sort(this.alerts, this.sortFn_);
      // At this point we are pretty sure that the largest ID
      // is in the beginning (default sorting) so we set it.
      this.lastAlertId = this.alerts[0].id;
      this.dispatchEvent(pstj.ds.DtoBase.EventType.SORT);
    }
  },

  statics: {
    /**
     * Comparision function for alerts.
     *
     * NOTE: The default sorting order is <b>REVERSED</b> as it is
     * required by the application logic! Also be noted that after each
     * sorting the last alert id is updated, if you change the
     * sorting order you <b>MUST</b> update the setter for the
     * last alert id, otherwise you will get duplicates from the server.
     *
     * @final
     * @param {Alert} a1
     * @param {Alert} a2
     * @return {number}
     */
    DefaultSort: function(a1, a2) {
      var res = 0;
      if (a1.id < a2.id) res = -1;
      if (a1.id > a2.id) res = 1;
      if (res != 0) res = res * -1;
      return res;
    }
  }
});


});  // goog.scope
