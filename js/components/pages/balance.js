goog.provide('longa.ui.Balance');

goog.require('goog.asserts');
goog.require('goog.log');
goog.require('goog.ui.registry');
goog.require('longa.control.Report');
goog.require('longa.control.viz');
goog.require('longa.gen.dto.UserBalance');
goog.require('longa.strings');
goog.require('longa.template');
goog.require('longa.ui.Chart');
goog.require('longa.ui.CustomTrend');
goog.require('pstj.material.Button');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.material.RadioButton');
goog.require('pstj.material.RadioGroup');


/** @extends {pstj.material.Element} */
longa.ui.Balance = goog.defineClass(pstj.material.Element, {
  /**
   * @param {goog.ui.ControlContent=} opt_content Text caption or DOM structure
   *     to display as the content of the control (if any).
   * @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
   *     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
   * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
   *     document interaction.
   */
  constructor: function(opt_content, opt_renderer, opt_domHelper) {
    pstj.material.Element.call(this, opt_content, opt_renderer, opt_domHelper);
  },

  /** @inheritDoc */
  enterDocument: function() {
    goog.base(this, 'enterDocument');
    this.getHandler().listen(this, goog.ui.Component.EventType.CHANGE,
        this.handleRadioGroupChange);
    this.getHandler().listen(this, goog.ui.Component.EventType.ACTION,
        this.handleAction);
  },

  /**
   * Handles action event from children (usually buttons).
   * @param {goog.events.Event} e
   * @protected
   */
  handleAction: function(e) {
    if (e.target instanceof pstj.material.Button) {
      switch (e.target.getAction()) {
        case 'buy':
          // code
          break;
        case 'widthraw':
          var model = longa.data.balance;
          if (!goog.isNull(model)) {
            if (goog.asserts.assertInstanceof(model, longa.gen.dto.UserBalance)
                .balance > 0) {
              // TODO: imlement show balance widthrawal.
              console.log('Show widthdawal');
            } else {
              longa.control.Toaster.getInstance().addToast(
                  longa.strings.NoSufficientBalanceForWidthdrawal(
                      null).toString(), null, null);
            }
          }
          break;
      }
    }
  },

  /**
   * Handles the selection of a new radio button in the radio group.
   * @param {goog.events.Event} e The CHANGE event coming from the radiogroup.
   * @protected
   */
  handleRadioGroupChange: function(e) {
    var idx = this.getRadioGroup().getSelectedIndex();
    if (idx != -1) {
      this.getChart().setSelectedIndex(idx);
    }
  },

  /**
   * Getter for the radio group element in the balance sheet.
   * @protected
   * @return {!pstj.material.RadioGroup}
   */
  getRadioGroup: function() {
    var idx = this.getRenderer().getRadioGroupIndex();
    return goog.asserts.assertInstanceof(this.getChildAt(idx),
        pstj.material.RadioGroup);
  },

  /**
   * Getter for the chart element.
   * @protected
   * @return {!longa.ui.Chart}
   */
  getChart: function() {
    var idx = this.getRenderer().getChartIndex();
    return goog.asserts.assertInstanceof(this.getChildAt(idx),
        longa.ui.Chart);
  },

  /** @override */
  getRenderer: function() {
    return goog.asserts.assertInstanceof(goog.base(this, 'getRenderer'),
        longa.ui.BalanceRenderer);
  },

  /**
   * Tell the balance sheet to load a new reporting set.
   */
  loadReportingData: function() {
    goog.Promise.all([
      longa.control.Report.getInstance().loadReport(longa.data.user.accountid),
      longa.control.viz.load()
    ]).then(function(results) {
      var data = /** @type {!longa.gen.dto.ReportList} */ (results[0]);
      this.getChart().setModel(data);
    }, null, this);
  }
});


/** @extends {pstj.material.ElementRenderer} */
longa.ui.BalanceRenderer = goog.defineClass(pstj.material.ElementRenderer, {
  constructor: function() {
    pstj.material.ElementRenderer.call(this);
    /**
     * @private
     * @type {goog.debug.Logger}
     */
    this.logger_ = goog.log.getLogger('longa.ui.BalanceRenderer');
  },

  /** @override */
  getCssClass: function() {
    return longa.ui.BalanceRenderer.CSS_CLASS;
  },

  /** @override */
  getTemplate: function(model) {
    return longa.template.UserBalance(model);
  },

  /** @override */
  generateTemplateData: function(instance) {
    var model = instance.getModel();
    if (!goog.isNull(model)) {
      return goog.asserts.assertInstanceof(model, longa.gen.dto.UserBalance);
    } else if (!goog.isNull(longa.data.balance)) {
      return goog.asserts.assertInstanceof(longa.data.balance,
          longa.gen.dto.UserBalance);
    } else {
      goog.log.warning(this.logger_, 'Rendering Balance sheet with empty data');
      return new longa.gen.dto.UserBalance();
    }
  },

  /**
   * Getter for the index at which the radio group is in the component tree of
   * the balance sheet used. Balance sheet should always have a radio group
   * for the data viewer.
   * @return {!number}
   */
  getRadioGroupIndex: function() {
    return 1;
  },

  /**
   * Returns the index of the charts element in the template.
   * @return {!number}
   */
  getChartIndex: function() {
    return 0;
  },

  /** @override */
  getStructuralCssClass: function() {
    return goog.getCssName('longa-app-balance');
  },

  statics: {
    /**
     * @final
     * @type {string}
     */
    CSS_CLASS: goog.getCssName('longa-app-user-balance')
  }
});
goog.addSingletonGetter(longa.ui.BalanceRenderer);

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(longa.ui.Balance,
    longa.ui.BalanceRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    longa.ui.BalanceRenderer.CSS_CLASS, function() {
      return new longa.ui.Balance(null);
    });
