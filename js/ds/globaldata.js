goog.provide('longa.data');

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
