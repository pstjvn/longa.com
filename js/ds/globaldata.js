goog.provide('longa.data');

goog.require('longa.ds.Alerts');
goog.require('longa.gen.dto.Profile');
goog.require('longa.gen.dto.Sellers');
goog.require('longa.gen.dto.Service');
goog.require('longa.gen.dto.User');


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
 * @type {longa.gen.dto.UserBalance}
 */
longa.data.balance = null;


/**
 * Configure the images that you want preloaded.
 * @type {Array<string>}
 */
longa.data.preloadImages = [
  'assets/images/bull.jpg',
  'assets/images/b.jpg',
  'assets/images/c.jpg',
  'assets/images/hands.jpg',
  'assets/images/d.jpg'
];


/**
 * The images used by the swpier in FAQ page.
 * @type {Array<string>}
 */
longa.data.preloadFaqImages = [
  'assets/images/1.png',
  'assets/images/2.jpg',
  'assets/images/3.jpg',
  'assets/images/4.jpg',
  'assets/images/5.jpg',
  'assets/images/6.jpg'
];


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
