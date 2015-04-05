/**
 * @fileoverview Instanciates the app.
 *
 * We also configure the logging here.
 *
 * @author regardingscot@gmail.com (Peter StJ)
 */

goog.provide('app');

goog.require('goog.debug.Console');
goog.require('longa.App');


// If this is a debug build use the logger
if (goog.DEBUG) {
  (new goog.debug.Console()).setCapturing(true);
  goog.log.getLogger('longa.App').setLevel(goog.log.Level.ALL);
  goog.log.getLogger('longa.rpc').setLevel(goog.log.Level.ALL);
}


// Init the app.
(new longa.App()).performAuth();
