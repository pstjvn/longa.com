goog.provide('longa.ds.Topic');


/**
 * The pub/sub topics for this application.
 * @enum {string}
 */
longa.ds.Topic = {
  // Deprecate those.
  USER_REQUESTED_LOGIN: 'url',
  USER_REQUESTED_REGISTRATION: 'urr',
  USER_REQUESTED_ACCOUNT_RECOVERY: 'urar',
  USER_AUTHENTICATED: 'ua',

  // When the auth is changed (i.e. this is server action)
  USER_AUTH_CHANGED: 'uac',

  // User requested to forget the login details (i.e. log out)
  USER_AUTH_FORGET: 'uaf',

  // When user pressed the skip button on the intro.
  USER_REQUESTED_SKIP_INTRO: 'ursi',

  // When the user clicked on one of the active menus on the right
  MENU_SELECTED: 'ms',

  // Direct access to secrtain screen - could be user action or server action.
  SHOW_SCREEN: 'ss',
  SHOW_MENU: 'sm'
};
