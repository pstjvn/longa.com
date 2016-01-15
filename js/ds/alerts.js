goog.provide('longa.ds.Alerts');

goog.require('goog.array');
goog.require('goog.log');
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

  },

  /**
   * @protected
   * @type {goog.debug.Logger}
   */
  logger: goog.log.getLogger('longa.ds.Alerts'),

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
          goog.log.error(this.logger,
              'Alerts returned overlap with existing ones');
          throw new Error('Alerts returned overlap with existing ones');
        }
      }
      // If the newest received alert is not read then we need to find
      // the first N unread alerts to show in the badge.
      if (!this.isRead_(collection.alerts[0])) {
        var count = 0;
        for (var i = 0; i < collection.alerts.length; i++) {
          if (this.isRead_(collection.alerts[i])) {
            break;
          } else {
            count++;
          }
        }
        this.unreadCount_ = count;
      } else {
        this.unreadCount_ = 0;
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
