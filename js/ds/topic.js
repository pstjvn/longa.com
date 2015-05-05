goog.provide('longa.ds.Topic');


/**
 * The pub/sub topics for this application.
 * @enum {string}
 */
longa.ds.Topic = {
  USER_REQUESTED_LOGIN: 'url',
  USER_REQUESTED_REGISTRATION: 'urr',
  USER_REQUESTED_ACCOUNT_RECOVERY: 'urar',
  USER_AUTHENTICATED: 'ua',
  USER_AUTH_LOST: 'ual',
  USER_REQUESTED_SKIP_INTRO: 'ursi',
  MENU_SELECTED: 'ms',
  // Direct access to secrtain screen
  SHOW_SCREEN: 'ss'
};
