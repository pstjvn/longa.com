/**
 * @fileoverview Provides the main view and all its subviews for the app.
 *
 * In this control we dispatch the views.
 */

goog.provide('longa.control.Main');

goog.require('longa.ds.Screen');
goog.require('longa.ds.Topic');
goog.require('longa.ui.Main');
goog.require('pstj.control.Control');

goog.scope(function() {


/** @extends {pstj.control.Control} */
longa.control.Main = goog.defineClass(pstj.control.Control, {
  constructor: function() {
    pstj.control.Control.call(this);
    this.view_ = new longa.ui.Main();
    this.init();
  },

  /** @override */
  init: function() {
    goog.base(this, 'init');
    this.listen(longa.ds.Topic.MENU_SELECTED, function(data) {
      // Switch between the view here
      console.log('data: ', data);
    });

    this.listen(longa.ds.Topic.SHOW_SCREEN, function(screen) {
      console.log('Requested to show screen: ' + screen);
    });
  },

  show: function() {
    this.view_.render(document.body);
  }
});

});  // goog.scope
