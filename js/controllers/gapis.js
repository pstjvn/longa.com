goog.provide('longa.control.Viz_');
goog.provide('longa.control.viz');

goog.require('goog.Promise');
goog.require('goog.dom');
goog.require('goog.log');
goog.require('longa.control.Toaster');
goog.require('longa.strings');
goog.require('pstj.control.Control');


/**
 * @extends {pstj.control.Control}
 * @private
 */
longa.control.Viz_ = goog.defineClass(pstj.control.Control, {
  /**
   * @private
   */
  constructor: function() {
    pstj.control.Control.call(this);
    /**
     * @private
     * @type {goog.debug.Logger}
     */
    this.logger_ = goog.log.getLogger('longa.control.viz');
    /**
     * A propmise to return for users who want to execute after the
     * APIs have been loaded.
     * @type {goog.Promise<boolean>}
     */
    this.promise = null;
    this.init();
  },

  /** @override */
  init: function() {
    this.promise = this.loadVizAPI_();
  },

  /**
   * Starts the preloading of the google JSAPI lib.
   *
   * @private
   * @return {!goog.Promise<boolean>}
   */
  loadJSAPI_: function() {
    goog.log.info(this.logger_, 'Start loading JSAPI');
    var scriptElement = goog.dom.createDom('script', {
      'type': 'text/javascript',
      'src': 'https://www.google.com/jsapi?callback=_preloadAPI.onJSAPILoad'
    });

    return new goog.Promise(function(resolve, reject) {
      goog.exportSymbol('_preloadAPI.onJSAPILoad', function() {
        resolve(true);
      });
      document.head.appendChild(scriptElement);
    });
  },

  /**
   * Preloader for the charts API.
   *
   * @private
   * @return {!goog.Promise<boolean>}
   */
  loadVizAPI_: function() {
    return this.loadJSAPI_().then(function(_) {
      goog.log.info(this.logger_, 'JSAPI loaded');
      return (new goog.Promise(function(resolve, reject) {
        // we are now sure the JSAPI is there, load charts.
        goog.global['google']['load']('visualization', '1.0', {
          'packages': ['corechart'],
          'callback': function() {
            resolve(true);
          }
        });
      })).then(
          // Success loading vizualization
          function(_) {
            goog.log.info(this.logger_, 'Vizualization API loaded');
          },
          // Failed loading vizualization.
          function(e) {
            longa.control.Toaster.getInstance().addToast(
                longa.strings.CannotLoadGoogleAPIs(null).toString(),
                null, null);
          },
          this);
    }, function(e) {
      longa.control.Toaster.getInstance().addToast(
          longa.strings.CannotLoadGoogleAPIs(null).toString(),
          null, null);
    }, this);
  }
});


/**
 * Reference to the promise.
 * @private
 * @type {goog.Promise<boolean>}
 */
longa.control.viz.promise_ = null;


/**
 * Returns a promise that will be fulfilled when APIs are loaded.
 * @return {!goog.Promise<boolean>}
 */
longa.control.viz.load = function() {
  if (goog.isNull(longa.control.viz.promise_)) {
    longa.control.viz.promise_ = (new longa.control.Viz_()).promise;
  }
  return goog.asserts.assertInstanceof(longa.control.viz.promise_,
      goog.Promise);
};
