/**
 * @fileoverview Provides sortable interface for static list of signals
 * generated from DTO.
 */
goog.provide('longa.ds.Signals');
goog.provide('longa.ds.mysignals');

goog.require('longa.data');
goog.require('pstj.ds.Sortable');


/** @extends {pstj.ds.Sortable<!longa.gen.dto.Signal>} */
longa.ds.Signals = goog.defineClass(pstj.ds.Sortable, {
  constructor: function(data_source) {
    pstj.ds.Sortable.call(this, data_source);
  },

  /** @override */
  getList: function() {
    return /** @type {!longa.gen.dto.Signals} */(this.dataSource).signals;
  },

  /** @override */
  sortInternal: function(key, asc) {
    var list = this.list;
    switch (key) {
      case 0:
        list.sort(function(a, b) {
          if (a.symbol < b.symbol) {
            return (asc) ? -1 : 1;
          } else if (a.symbol > b.symbol) {
            return (asc) ? 1 : -1;
          }
          return 0;
        });
        break;
      case 1:
        list.sort(function(a, b) {
          if (a.change < b.change) {
            return (asc) ? -1 : 1;
          } else if (a.change > b.change) {
            return (asc) ? 1 : -1;
          }
          return 0;
        });
        break;
      case 2:
        list.sort(function(a, b) {
          if (a.openPrice < b.openPrice) {
            return (asc) ? -1 : 1;
          } else if (a.openPrice > b.openPrice) {
            return (asc) ? 1 : -1;
          }
          return 0;
        });
        break;
      default: throw new Error('Cannot sort by key index: ' + key);
    }
  }
});


/**
 * Single instance, used to reference the sorted and ready to display
 * list of signals for the current user.
 *
 * @type {!longa.ds.Signals}
 * @final
 */
longa.ds.mysignals = new longa.ds.Signals(longa.data.mysignals);
