goog.provide('longa.ds.Sellers_');
goog.provide('longa.ds.sellers');

goog.require('longa.data');
goog.require('pstj.ds.Sortable');


/**
 * @extends {pstj.ds.Sortable<!longa.gen.dto.SellerBalance>}
 * @private
 */
longa.ds.Sellers_ = goog.defineClass(pstj.ds.Sortable, {
  /** @param {!pstj.ds.DtoBase} data_source */
  constructor: function(data_source) {
    pstj.ds.Sortable.call(this, data_source);
  },

  /** @inheritDoc */
  getList: function() {
    return /** @type {!longa.gen.dto.Sellers} */(this.dataSource).sellers;
  },

  /** @override */
  sortInternal: function(key, asc) {
    var list = this.getList();
    switch (key) {
      case 0:
        list.sort(function(a, b) {
          if (a.username < b.username) {
            return (asc) ? -1 : 1;
          } else if (a.username > b.username) {
            return (asc) ? 1 : -1;
          }
          return 0;
        });
        break;
      case 1:
        list.sort(function(a, b) {
          if (a.profitLossRatio < b.profitLossRatio) {
            return (asc) ? -1 : 1;
          } else if (a.profitLossRatio > b.profitLossRatio) {
            return (asc) ? 1 : -1;
          }
          return 0;
        });
        break;
      case 2:
        list.sort(function(a, b) {
          if (a.memberCount < b.memberCount) {
            return (asc) ? -1 : 1;
          } else if (a.memberCount > b.memberCount) {
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
 * list of sellers (with their balance data).
 *
 * @type {!longa.ds.Sellers_}
 * @final
 */
longa.ds.sellers = new longa.ds.Sellers_(longa.data.sellers);
