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

  // The current user is changed
  // EIther a user has been authenticated or the known user lost its
  // authentication
  USER_AUTH_CHANGED: 'user-auth-changed',
  // User requested to forget the login details (i.e. log out)
  USER_AUTH_FORGET: 'user-auth-forget',
  // Server auth failed.
  USER_AUTH_FAILED: 'user-auth-fail',
  // The skip button on the start screen was pressed.
  // This is basically the user wants to get ot the app.
  USER_REQUESTED_SKIP_INTRO: 'ursi',
  // One of the menu items was selected.
  // This is the primary way for the user to navigate between the screens,
  MENU_SELECTED: 'menu-selected',
  // Direct access to secrtain screen - could be user action or server action.
  SHOW_SCREEN: 'show-screen',
  // Someone needs access to the menu.
  // This is usually pushed in narrow view when the user wants to go to
  // navigation/menu.
  SHOW_MENU: 'show-menu'
};
