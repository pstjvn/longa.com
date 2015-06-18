/**
 * @fileoverview Provides single place for the global data instances that
 * are expected to be read by data utilities and components / controls.
 */

goog.provide('longa.data');

goog.require('longa.ds.Alerts');
goog.require('longa.gen.dto.Profile');
goog.require('longa.gen.dto.Sellers');
goog.require('longa.gen.dto.Service');
goog.require('longa.gen.dto.Signals');
goog.require('longa.gen.dto.User');
goog.require('longa.gen.dto.UserBalance');


/**
 * Provides static access to the current user using the app.
 * @type {!longa.gen.dto.User}
 */
longa.data.user = new longa.gen.dto.User();


/**
 * Provides access to current user's balance sheet.
 *
 * When no user is logged in it will be null.
 *
 * @type {?longa.gen.dto.UserBalance}
 */
longa.data.balance = null;


/**
 * Global reference to the current et of alerts.
 * @type {longa.ds.Alerts}
 */
longa.data.alerts = new longa.ds.Alerts();


/**
 * Global access to profile information.
 * @type {longa.gen.dto.Profile}
 */
longa.data.profile = new longa.gen.dto.Profile();


/**
 * Reference the current user's service definition (for providers).
 * @type {?longa.gen.dto.Service}
 */
longa.data.service = new longa.gen.dto.Service();


/**
 * Global reference for the existing sellers.
 * @type {!longa.gen.dto.Sellers}
 */
longa.data.sellers = new longa.gen.dto.Sellers();


/**
 * Global reference to current user's list of signals.
 * @type {!longa.gen.dto.Signals}
 */
longa.data.mysignals = new longa.gen.dto.Signals();


/**
 * Globally accessible list of signals for a specific account.
 * Note that this is only data storage and it does not care about
 * which user has access to it, you should manage this in your controller
 * code.
 * @type {!longa.gen.dto.Signals}
 */
longa.data.currentSellerList = new longa.gen.dto.Signals();
