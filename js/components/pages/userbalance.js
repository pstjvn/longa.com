goog.provide('longa.ui.UserBalance');
goog.provide('longa.ui.UserBalanceRenderer');

goog.require('goog.asserts');
goog.require('goog.async.Delay');
goog.require('goog.log');
goog.require('goog.ui.registry');
goog.require('longa.control.Report');
goog.require('longa.control.viz');
goog.require('longa.data');
goog.require('longa.ds.Screen');
goog.require('longa.ds.Topic');
goog.require('longa.gen.dto.UserBalance');
goog.require('longa.strings');
goog.require('longa.template');
goog.require('longa.ui.Chart');
goog.require('longa.ui.CustomTrend');
goog.require('pstj.control.Control');
goog.require('pstj.material.Button');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.material.RadioButton');
goog.require('pstj.material.RadioGroup');


/** @extends {pstj.material.Element} */
longa.ui.UserBalance = goog.defineClass(pstj.material.Element, {
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
    /**
     * Control instance to use to talk to the control bus.
     *
     * @private
     * @type {!pstj.control.Control}
     * @final
     */
    this.control_ = new pstj.control.Control(this);
    this.control_.init();

    this.registerDisposable(this.control_);
  },

  /**
   * Accessor for the controller object
   * @return {!pstj.control.Control}
   */
  getController: function() {
    return this.control_;
  },

  /** @inheritDoc */
  enterDocument: function() {
    goog.base(this, 'enterDocument');
    // If we already have a model, load the reporting for it.
    if (!goog.isNull(this.getModel())) {
      this.loadReportingData(this.getAccountID());
    }

    this.getHandler().listen(this, goog.ui.Component.EventType.CHANGE,
        this.handleRadioGroupChange);
    this.getHandler().listen(this, goog.ui.Component.EventType.ACTION,
        this.handleAction);
  },

  /**
   * Getter for the account id in the model for this component. In our case
   * it is the globally logged in user.
   *
   * If you use different DTO or datasource you need to override this.
   *
   * @protected
   * @return {!number}
   */
  getAccountID: function() {
    return longa.data.user.accountid;
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
          this.control_.push(longa.ds.Topic.SHOW_SCREEN,
              longa.ds.Screen.BALANCE_BUY);
          break;
        case 'widthraw':
          var model = this.getModel();
          if (!goog.isNull(model)) {
            if (goog.asserts.assertInstanceof(model, longa.gen.dto.UserBalance)
                .balance > 0) {
              this.control_.push(longa.ds.Topic.SHOW_SCREEN,
                  longa.ds.Screen.BALANCE_WIDHTRAW);
            } else {
              longa.control.Toaster.getInstance().addToast(
                  longa.strings.NoSufficientBalanceForWidthdrawal(
                      null).toString(), null, null);
            }
          }
          break;
        default: throw new Error('Unhandled button action: ' +
            e.target.getAction());
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

  /**
   * @override
   * @return {longa.ui.UserBalanceRenderer}
   */
  getRenderer: function() {
    return goog.asserts.assertInstanceof(goog.base(this, 'getRenderer'),
        longa.ui.UserBalanceRenderer);
  },

  /**
   * Tell the balance sheet to load a new reporting set.
   * @param {!number} acctid The account id to load report for.
   */
  loadReportingData: function(acctid) {
    goog.Promise.all([
      longa.control.Report.getInstance().loadReport(acctid)
    ]).then(function(results) {
      var data = /** @type {!longa.gen.dto.ReportList} */ (results[0]);
      this.getChart().setModel(data);
    }, null, this);
  }
});


/** @extends {pstj.material.ElementRenderer} */
longa.ui.UserBalanceRenderer = goog.defineClass(pstj.material.ElementRenderer, {
  constructor: function() {
    pstj.material.ElementRenderer.call(this);
  },

  /**
   * @protected
   * @type {goog.debug.Logger}
   */
  logger: goog.log.getLogger('longa.ui.UserBalanceRenderer'),

  /** @override */
  getCssClass: function() {
    return longa.ui.UserBalanceRenderer.CSS_CLASS;
  },

  /** @override */
  getTemplate: function(model) {
    return longa.template.UserBalance(goog.asserts.assertInstanceof(
        model, longa.gen.dto.UserBalance));
  },

  /** @override */
  generateTemplateData: function(instance) {
    var model = instance.getModel();
    if (!goog.isNull(model)) {
      return goog.asserts.assertInstanceof(model, longa.gen.dto.UserBalance);
    } else {
      goog.log.warning(this.logger, 'Rendering Balance sheet with empty data');
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
goog.addSingletonGetter(longa.ui.UserBalanceRenderer);

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(longa.ui.UserBalance,
    longa.ui.UserBalanceRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    longa.ui.UserBalanceRenderer.CSS_CLASS, function() {
      return new longa.ui.UserBalance(null);
    });
