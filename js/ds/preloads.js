/**
 * @fileoverview Definitions for URIs that needs to bre preloaded and
 * prefedined loaders.
 *
 * Use them when considered needed to preload file bundles.
 */

goog.provide('longa.preload');

goog.require('goog.Promise');
goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.events');
goog.require('goog.labs.net.xhr');
goog.require('goog.net.EventType');
goog.require('goog.net.ImageLoader');
goog.require('goog.style');


/**
 * The images used in the start screen rotator / swiper.
 *
 * @private
 * @type {Array<string>}
 */
longa.preload.startScreenImages_ = [
  'assets/images/bull.jpg',
  'assets/images/b.jpg',
  'assets/images/c.jpg',
  'assets/images/hands.jpg',
  'assets/images/d.jpg'
];


/**
 * The images used by the swpier in FAQ view.
 *
 * @private
 * @type {Array<string>}
 */
longa.preload.faqImages_ = [
  'assets/images/1.png',
  'assets/images/2.jpg',
  'assets/images/3.jpg',
  'assets/images/4.jpg',
  'assets/images/5.jpg',
  'assets/images/6.jpg'
];


/**
 * Returns a promise that will complete / resolve when the images used in the
 * start screen get loaded.
 *
 * Note that the promise is created only once and the images start loading only
 * the first time they are required. After the first invocation the same promise
 * will be returned.
 *
 * @return {!goog.Promise<boolean>}
 */
longa.preload.preloadStartScreenImages = function() {
  if (goog.isNull(longa.preload.ssp_)) {
    var imageLoader = new goog.net.ImageLoader();
    goog.array.forEach(longa.preload.startScreenImages_, function(uri, i) {
      imageLoader.addImage(i.toString(), uri);
    });
    longa.preload.ssp_ = new goog.Promise(function(resolve, reject) {
      goog.events.listenOnce(imageLoader, goog.net.EventType.COMPLETE,
          function(_) {
            resolve(true);
          });
    });
    imageLoader.start();
  }
  return /** @type {!goog.Promise<boolean>} */ (longa.preload.ssp_);
};


/**
 * Returns a promise that will complete / resolve when the images used in the
 * FAQ screen get loaded.
 *
 * Note that the promise is created only once and the images start loading only
 * the first time they are required. After the first invocation the same promise
 * will be returned.
 *
 * @return {!goog.Promise<boolean>}
 */
longa.preload.preloadFaqImages = function() {
  if (goog.isNull(longa.preload.fip_)) {
    var imageLoader = new goog.net.ImageLoader();
    goog.array.forEach(longa.preload.faqImages_, function(uri, i) {
      imageLoader.addImage(i.toString(), uri);
    });
    longa.preload.fip_ = new goog.Promise(function(resolve, reject) {
      var resolved = false;
      // Resolve this promise no later than 1 second after it was created
      // We do this to avoid user wating on slower networks.
      setTimeout(function() {
        if (!resolved) {
          resolved = true;
          resolve(false);
        }
      }, 1000);
      // Also listen for actual image loading, it might happen faster than 1s.
      goog.events.listenOnce(imageLoader, goog.net.EventType.COMPLETE,
          function(_) {
            if (!resolved) {
              resolved = true;
              resolve(true);
            }
          });
    });
    imageLoader.start();
  }
  return /** @type {!goog.Promise<boolean>} */ (longa.preload.fip_);
};


/**
 * Returns the promise of installing the app styles in tghe document.
 *
 * The first time its called it will fetch the styles and install them and
 * any subsequent calls will return the same promise.
 *
 * @return {!goog.Promise<boolean>}
 */
longa.preload.installStyles = function() {
  if (goog.isNull(longa.preload.styles_)) {
    // Fiddling with the styles source for development. In production this will
    // be squashed into direct assignment.
    var source = '';

    if (COMPILED) {
      if (goog.isString(goog.global['APP_STYLES_DEBUG'])) {
        source = goog.asserts.assertString(goog.global['APP_STYLES_DEBUG']);
      } else {
        source = goog.asserts.assertString(goog.global['APP_STYLES_COMPILED']);
      }
    } else {
      source = goog.asserts.assertString(goog.global['APP_STYLES']);
    }

    longa.preload.styles_ = goog.labs.net.xhr.get(source)
        .then(function(response) {
          goog.style.installStyles(response);
          return true;
        });
  }
  return goog.asserts.assertInstanceof(longa.preload.styles_, goog.Promise);
};


/**
 * Returns a promise that will resolve to boolean when all apis needed for
 * charts visualization are loaded in document.
 *
 * @return {!goog.Promise<boolean>}
 */
longa.preload.installVizualizationApis = function() {
  if (goog.isNull(longa.preload.viz_)) {

    var scriptElement = goog.dom.createDom('script', {
      'type': 'text/javascript',
      'src': 'https://www.google.com/jsapi?callback=_preloadAPI.onJSAPILoad'
    });

    longa.preload.viz_ = new goog.Promise(function(resolve, reject) {
      goog.exportSymbol('_preloadAPI.onJSAPILoad', function() {
        // At this point the GAPI gloader is loaded, now load the viz.
        // resolve the promise when vizualization is in document.
        goog.global['google']['load']('visualization', '1.0', {
          'packages': ['corechart'],
          'callback': function() {
            resolve(true);
          }
        });
      });
    });

    // Start the whole thing
    document.head.appendChild(scriptElement);
  }
  return goog.asserts.assertInstanceof(longa.preload.viz_, goog.Promise);
};


/**
 * The promise for GAPIs loading.
 * @type {goog.Promise<boolean>}
 * @private
 */
longa.preload.viz_ = null;


/**
 * @private
 * @type {goog.Promise<boolean>}
 */
longa.preload.styles_ = null;


/**
 * @type {goog.Promise<boolean>}
 * @private
 */
longa.preload.ssp_ = null;


/**
 * @type {goog.Promise<boolean>}
 * @private
 */
longa.preload.fip_ = null;
