goog.provide('longa.ds.Topic');

goog.require('goog.events');
goog.require('goog.pubsub.TopicId');


/**
 * The pub/sub topics for this application.
 * @type {!goog.pubsub.TopicId<undefined>}
 */
longa.ds.Topic.USER_REQUESTED_LOGIN = new goog.pubsub.TopicId(
    goog.events.getUniqueId('url'));


/**
 * The pub/sub topics for this application.
 * @type {!goog.pubsub.TopicId<undefined>}
 */
longa.ds.Topic.USER_REQUESTED_REGISTRATION = new goog.pubsub.TopicId(
    goog.events.getUniqueId('urr'));


/**
 * The pub/sub topics for this application.
 * @type {!goog.pubsub.TopicId<undefined>}
 */
longa.ds.Topic.USER_REQUESTED_ACCOUNT_RECOVERY = new goog.pubsub.TopicId(
    goog.events.getUniqueId('urar'));


/**
 * The pub/sub topics for this application.
 * @type {!goog.pubsub.TopicId<undefined>}
 */
longa.ds.Topic.USER_AUTHENTICATED = new goog.pubsub.TopicId(
    goog.events.getUniqueId('ua'));


/**
 * The current user is changed, either a user has been authenticated or the
 * known user lost its authentication.
 * @type {!goog.pubsub.TopicId<undefined>}
 */
longa.ds.Topic.USER_AUTH_CHANGED = new goog.pubsub.TopicId(
    goog.events.getUniqueId('user-auth-changed'));


/**
 * User requested to forget the login details (i.e. log out)
 * @type {!goog.pubsub.TopicId<undefined>}
 */
longa.ds.Topic.USER_AUTH_FORGET = new goog.pubsub.TopicId(
    goog.events.getUniqueId('user-auth-forget'));


/**
 * Server auth failed.
 * @type {!goog.pubsub.TopicId<Error>}
 */
longa.ds.Topic.USER_AUTH_FAILED = new goog.pubsub.TopicId(
    goog.events.getUniqueId('user-auth-fail'));


/**
 * The skip button on the start screen was pressed.
 * This is basically the user wants to get ot the app.
 * @type {!goog.pubsub.TopicId<undefined>}
 */
longa.ds.Topic.USER_REQUESTED_SKIP_INTRO = new goog.pubsub.TopicId(
    goog.events.getUniqueId('ursi'));


/**
 * One of the menu items was selected.
 * This is the primary way for the user to navigate between the screens,
 * @type {!goog.pubsub.TopicId<undefined>}
 */
longa.ds.Topic.MENU_SELECTED = new goog.pubsub.TopicId(
    goog.events.getUniqueId('menu-selected'));


/**
 * Direct access to secrtain screen - could be user action or server action.
 * @type {!goog.pubsub.TopicId<!longa.ds.Screen|number>}
 */
longa.ds.Topic.SHOW_SCREEN = new goog.pubsub.TopicId(
    goog.events.getUniqueId('show-screen'));


/**
 * Someone needs access to the menu.
 * This is usually pushed in narrow view when the user wants to go to
 * navigation/menu.
 * @type {!goog.pubsub.TopicId<undefined>}
 */
longa.ds.Topic.SHOW_MENU = new goog.pubsub.TopicId(
    goog.events.getUniqueId('show-menu'));


/**
 * The DTO for user balance has changed.
 * @type {!goog.pubsub.TopicId<undefined>}
 */
longa.ds.Topic.USER_BALANCE_CHANGE = new goog.pubsub.TopicId(
    goog.events.getUniqueId('user-balance-change'));


/**
 * Used when a control encounters an error and cannot resolve it on its own.
 * @type {!goog.pubsub.TopicId<!Error>}
 */
longa.ds.Topic.CONTROL_ERROR = new goog.pubsub.TopicId(
    goog.events.getUniqueId('control-error'));


/**
 * Used to announce a user selected a particular feed.
 * @type {!goog.pubsub.TopicId<!longa.gen.dto.SellerBalance>}
 */
longa.ds.Topic.FEED_SELECTED = new goog.pubsub.TopicId(
    goog.events.getUniqueId('feed-select'));
