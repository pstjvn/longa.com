goog.provide('longa.ds.utils');

goog.require('longa.ds.AlertType');
goog.require('longa.ds.UserType');
goog.require('longa.gen.dto.Alert');

goog.scope(function() {
var _ = longa.ds.utils;
var AlertType = longa.ds.AlertType;
var UserType = longa.ds.UserType;


/**
 * Converts the alert type from string to an actual type.
 * @param {!longa.gen.dto.Alert} alert
 * @return {AlertType}
 */
_.getAlertType = function(alert) {
  switch (alert.type) {
    case 'SIGNAL': return AlertType.SIGNAL;
    case 'BALANCE': return AlertType.BALANCE;
    case 'PROVIDER': return AlertType.PROVIDER;
    default: throw new Error('Unknown alert type: ' + alert.type);
  }
};


/**
 * Converts the DTo usertype to actual user type in the app logic.
 * @param {!longa.gen.dto.User} user
 * @return {UserType}
 */
_.getUserType = function(user) {
  switch (user.usertype) {
    case '1': return UserType.INVESTOR;
    case '2': return UserType.SELLER;
    default: throw new Error('Unknown user type: ' + user.usertype);
  }
};


/**
 * Sorts the alerts list so that the newest alerts are first.
 * @param {!Array<longa.gen.dto.Alert>} alertlist
 */
_.sortAlerts = function(alertlist) {
  goog.array.sort(alertlist, _.defaultAlertSortFn_);
};


/**
 * Helper function to sort the alerts.
 * @param {longa.gen.dto.Alerts} alerts
 */
_.sortUserAlerts = function(alerts) {
  _.sortAlerts(alerts.alerts);
};


/**
 * Sorts the alerts by their ID in descending order.
 *
 * @private
 * @param {longa.gen.dto.Alert} a1
 * @param {longa.gen.dto.Alert} a2
 * @return {number}
 */
_.defaultAlertSortFn_ = function(a1, a2) {
  // Note that this differs from the default sort implementation, reverse order!
  if (a1.id < a2.id) res = 1;
  if (a1.id > a2.id) res = -1;
  return 0;
};

});  // goog.scope
