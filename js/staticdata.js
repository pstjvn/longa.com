/**
 * @fileoverview Provides some static (manually editable) data for the app.
 */

goog.provide('longa.staticdata');


goog.scope(function() {
var _ = longa.staticdata;


/**
 * Static list of images and headlines to use on a swiper screen when
 * startinc the app.
 * @type {Array<Object<string, string>>}
 * @const
 */
_.startPageTiles = [
  {
    'src': 'http://longa.com/images/bull.jpg',
    'text': 'The ultimate stock signal marketplace'
  }, {
    'src': 'http://longa.com/images/b.jpg',
    'text': 'Where investors meet successful signal traders'
  }, {
    'src': 'http://longa.com/images/c.jpg',
    'text': 'Make money from stock investments'
  }, {
    'src': 'http://longa.com/images/hands.jpg',
    'text': 'Follow the best investment strategy'
  }, {
    'src': 'http://longa.com/images/d.jpg',
    'text': 'Sell your trading ideas and make money'
  }
];


/**
 * The tiles in the main header
 * @const
 * @type {!Array<!string>}
 */
_.HeaderTiles = [
  'Login',
  'Balance',
  'Signal Feed',
  'My Signals',
  'Alerts',
  'Profile',
  'FAQ',
  'Terms of Service'
];

});  // goog.scope
