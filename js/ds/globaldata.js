goog.provide('longa.data');

goog.require('longa.gen.dto.User');


/**
 * Provides static access to the current user using the app.
 * @type {!longa.gen.dto.User}
 */
longa.data.user = new longa.gen.dto.User();
