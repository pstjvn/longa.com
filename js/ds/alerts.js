goog.provide('longa.ds.Alerts');

goog.require('goog.array');
goog.require('longa.gen.dto.Alerts');


/** @extends {longa.gen.dto.Alerts} */
longa.ds.Alerts = goog.defineClass(longa.gen.dto.Alerts, {
  constructor: function() {
    longa.gen.dto.Alerts.call(this);
    /**
     * The number of unread messages. Note that this is not the
     * actual number of unread messages and is reset on each merge.
     * @type {number}
     * @private
     */
    this.unreadCount_ = 0;
    /**
     * @final
     * @private
     * @type {goog.debug.Logger}
     */
    this.logger_ = goog.log.getLogger('longa.ds.Alerts');
  },

  /**
   * Retrieves the current alerts cound
   * @return {number}
   */
  getCount: function() {
    return this.alerts.length;
  },

  /**
   * Getter for the number of unread messages.
   * @return {number}
   */
  getUnreadCound: function() {
    return this.unreadCount_;
  },

  /**
   * Merges a new set of alerts into the existing instance.
   * @param {longa.gen.dto.Alerts} collection The DTO alerts.
   */
  merge: function(collection) {
    if (collection.alerts.length > 0) {
      if (this.getCount() > 0) {
        if (this.alerts[0].id >= goog.array.peek(collection.alerts).id) {
          goog.log.error(this.logger_,
              'Alerts returned overlap with existing ones');
          throw new Error('Alerts returned overlap with existing ones');
        }
      }
      if (!this.isRead_(collection.alerts[0])) {
        this.unreadCount_ = collection.alerts.length;
      }
      goog.array.insertArrayAt(this.alerts, collection.alerts);
      this.handleChange();
    }
  },

  /**
   * Clears all stored alerts.
   */
  clear: function() {
    goog.array.clear(this.alerts);
    this.handleChange();
  },

  /**
   * Checks if the message is read.
   *
   * @private
   * @param {longa.gen.dto.Alert} alert The alert to check.
   * @return {boolean}
   */
  isRead_: function(alert) {
    return alert.read == 1;
  }
});
