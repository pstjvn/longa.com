goog.provide('longa.control.Report');

goog.require('longa.rpc');
goog.require('longa.strings');
goog.require('pstj.control.Control');


/** @extends {pstj.control.Control} */
longa.control.Report = goog.defineClass(pstj.control.Control, {
  constructor: function() {
    pstj.control.Control.call(this);
    this.init();
  },

  /**
   * Load the report data for specific account.
   * @param {number} accountid The Account ID of the user we want to get
   * reporting data for.
   * @return {!goog.Promise<longa.gen.dto.ReportList>}
   */
  loadReport: function(accountid) {
    return longa.rpc.getReport(accountid).then(function(list) {
      return list;
    }, function(e) {
      longa.control.Toaster.getInstance().addToast(
          longa.strings.ErrorLoadingReport(null).toString(),
          null, null);
    });
  }
});
goog.addSingletonGetter(longa.control.Report);
