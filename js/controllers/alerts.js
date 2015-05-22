/**
 * @fileoverview Control to manages and handles the alerts in the system.
 *
 * It will automatically start reloading the alerts after the first get
 * command and will also automtically stop retrieval when the user
 * changed signal is detected (assuming user log out).
 */

goog.provide('longa.control.Alerts');

goog.require('goog.async.Delay');
goog.require('longa.control.Toaster');
goog.require('longa.data');
goog.require('longa.ds.utils');
goog.require('longa.rpc');
goog.require('longa.storage');
goog.require('pstj.control.Control');


/** @extends {pstj.control.Control} */
longa.control.Alerts = goog.defineClass(pstj.control.Control, {
  constructor: function() {
    pstj.control.Control.call(this);
    /**
     * @type {goog.debug.Logger}
     * @private
     * @final
     */
    this.logger_ = goog.log.getLogger('longa.control.Alerts');
    /**
     * Reference to the alert loader used to continuously load alerts.
     * @type {goog.async.Delay}
     * @private
     */
    this.alertLoader_ = null;
    /**
     * Delay to use to re-get the alerts.
     * @type {number}
     * @private
     */
    this.alertLoadingDelay_ = longa.control.Alerts.DefaultDelay;
    this.init();
  },

  /** @inheritDoc */
  init: function() {
    goog.base(this, 'init');
    this.listen(longa.ds.Topic.USER_AUTH_CHANGED, function() {
      if (longa.ds.utils.isKnownUser()) {
        // start alert retrieval
        // TODO: this is better left in the main controller so it can
        // actually know when all initial loading is done.
        // this.get();
      } else {
        // cancel alerts
        this.destroyAlertLoader_();
        longa.data.alerts.clear();
      }
    });
  },

  /**
   * Calls rpc for alert updates.
   * @return {goog.Promise<!longa.gen.dto.Alerts>}
   */
  get: function() {
    goog.log.info(this.logger_, 'Attempting alerts retrieval');
    var last = longa.storage.getLastAlertIndex();
    return longa.rpc.getAlerts(last)
        .then(this.onLoad_, this.onFail_, this);
  },

  /**
   * Handles the loading of alerts. Note that alerts are constantly queried and
   * only the new alert instances need to be added to the list and not
   * to replace the whole Alerts instance. However the server will always return
   * a new Alerts instance, thus you need to manually merge the alerts array.
   *
   * @protected
   * @param {!longa.gen.dto.Alerts} alerts
   * @return {!longa.gen.dto.Alerts}
   */
  onLoad_: function(alerts) {
    goog.log.info(this.logger_, 'Retrieved ' + alerts.alerts.length +
        ' new alerts');
    // If in the meantime while wating for the alerts the user logged out
    // we want to skip all operations on the data.
    if (longa.ds.utils.isKnownUser()) {
      // if we have response - reset the delay.
      var delay = alerts.delay * 1000;
      this.createAlertLoader_(delay);
      if (alerts.alerts.length > 0) {
        longa.storage.setLastAlertIndex(alerts.alerts[0].id);
      }
      try {
        longa.data.alerts.merge(alerts);
      } catch (e) {
        goog.log.error(this.logger_, e.message);
        // TODO: show something useful to the user.
      }
    }
    return alerts;
  },

  /**
   * Handles the error from loading new alerts.
   * @protected
   * @param {*} e The error that occured from loading the alerts.
   */
  onFail_: function(e) {
    goog.log.error(this.logger_, e.message);
    this.createAlertLoader_(this.alertLoadingDelay_);
    longa.control.Toaster.getInstance().addToast(
        'Could not update alerts.', null, null);
  },

  /**
   * Called when the alerts get loaded and we have potentially new delay.
   * @param {!number} delay The delay to use.
   * @private
   */
  createAlertLoader_: function(delay) {
    if (delay != this.alertLoadingDelay_) {
      this.destroyAlertLoader_();
      this.alertLoadingDelay_ = delay;
    }
    if (goog.isNull(this.alertLoader_)) {
      this.alertLoader_ = new goog.async.Delay(this.onAlertUpdateFired,
          this.alertLoadingDelay_, this);
    }
    this.alertLoader_.start();
  },

  /**
   * Removes the alert loader - this should happen when the user logs out
   * and we no longer should receive alerts.
   *
   * When a new user logs in the alert loading will be triggered by
   * retrieveAll.
   *
   * @private
   */
  destroyAlertLoader_: function() {
    if (!goog.isNull(this.alertLoader_)) {
      goog.dispose(this.alertLoader_);
      this.alertLoader_ = null;
    }
    this.alertLoadingDelay_ = longa.control.Alerts.DefaultDelay;
  },

  /**
   * Called when the delay for new alert loading elapses - time to load alert.
   * @protected
   */
  onAlertUpdateFired: function() {
    this.get();
  },

  /**
   * Loads the old alerts.
   */
  getOld: function() {
    this.destroyAlertLoader_();
    return longa.rpc.getAlerts(0).then(this.onLoad_, this.onFail_, this);
  },

  statics: {
    /**
     * The default delay between alert retrieval.
     * @type {number}
     * @const
     */
    DefaultDelay: 5 * 60 * 1000
  }
});
goog.addSingletonGetter(longa.control.Alerts);
