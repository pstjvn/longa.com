/**
 * @fileoverview Provides an element that is able to render the reporting
 * data for an account as a chart.
 */

goog.provide('longa.ui.Chart');
goog.provide('longa.ui.ChartRenderer');

goog.require('goog.array');
goog.require('goog.ui.registry');
goog.require('longa.gen.dto.ReportList');
goog.require('longa.preload');
goog.require('longa.strings');
goog.require('longa.template');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');


/** @extends {pstj.material.Element} */
longa.ui.Chart = goog.defineClass(pstj.material.Element, {
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
     * The currently selected index of data sets to display.
     * @type {number}
     * @private
     */
    this.selectedIndex_ = 0;
    /**
     * Pre-composited data sets for displaying.
     * @type {Array<Array<Array<*>>>}
     * @private
     */
    this.sets_ = [];
    /**
     * The data tables to use.
     * @type {Array<google.visualization.DataTable>}
     * @private
     */
    this.dataTables_ = [];
    /**
     * Reference to the chart.
     * @type {google.visualization.LineChart}
     * @protected
     */
    this.chart = null;
    /**
     * Flag if there is no data to display.
     * @type {boolean}
     * @private
     */
    this.nodata_ = true;
    this.lastPromise_ = null;
  },

  /**
   * Setter for the data set to display.
   * @param {number} idx The index of the data to show.
   */
  setSelectedIndex: function(idx) {
    if (idx < 0 || idx > 3) {
      throw new Error('Selected index is out of bound');
    }
    this.selectedIndex_ = idx;
    this.updateChart_();
  },

  /**
   * Redraws the chart if data is present.
   * @private
   */
  updateChart_: function() {
    if (!this.nodata_ && !goog.isNull(this.chart)) {
      this.showOverlay_(false);
      longa.ui.Chart.Options['title'] = longa.ui.Chart.Names_[
          this.selectedIndex_];
      this.chart.draw(
          goog.asserts.assertObject(
              this.dataTables_[this.selectedIndex_]),
          longa.ui.Chart.Options);
    } else {
      this.showOverlay_(true);
    }
  },

  /**
   * Shows/hides the overlay.
   * @param {boolean} show
   * @private
   */
  showOverlay_: function(show) {
    goog.style.setElementShown(this.getRenderer().getOverlay(
        this.getElementStrict()), show);
  },

  /** @inheritDoc */
  disposeInternal: function() {
    goog.base(this, 'disposeInternal');
    this.chart = null;
    goog.array.clear(this.sets_);
    goog.array.clear(this.dataTables_);
    this.sets_ = null;
    this.dataTables_ = null;
  },

  /**
   * @override
   * @return {longa.gen.dto.ReportList}
   */
  getModel: function() {
    var model = goog.base(this, 'getModel');
    if (!goog.isNull(model)) {
      return goog.asserts.assertInstanceof(model, longa.gen.dto.ReportList);
    } else {
      return null;
    }
  },

  /** @override */
  setModel: function(model) {
    if (!goog.isNull(this.lastPromise_)) this.lastPromise_.cancel();
    if (goog.isNull(model)) {
      this.nodata_ = true;
      goog.array.clear(this.sets_);
      goog.array.clear(this.dataTables_);
      this.updateChart_();
    } else {
      goog.base(this, 'setModel', model);
      goog.asserts.assertInstanceof(model, longa.gen.dto.ReportList);
      // Precompisite data sets.
      goog.array.clear(this.sets_);
      goog.array.clear(this.dataTables_);

      if (goog.array.isEmpty(model.items)) {
        this.nodata_ = true;
        this.updateChart_();
      } else {
        this.nodata_ = false;

        var date = longa.strings.Date(null).toString();
        this.sets_.push([
          [
            date,
            longa.ui.Chart.Names_[0]
          ]
        ], [
          [
            date,
            longa.ui.Chart.Names_[1]
          ]
        ], [
          [
            date,
            longa.ui.Chart.Names_[2]
          ]
        ], [
          [
            date,
            longa.ui.Chart.Names_[3]
          ]
        ]);
        goog.array.forEach(model.items, function(record) {
          this.sets_[0].push([record.date, record.profitLossRatio]);
          this.sets_[1].push([record.date, record.signalCount]);
          this.sets_[2].push([record.date, record.charge]);
          this.sets_[3].push([record.date, record.memberCount]);
        }, this);

        this.lastPromise_ = longa.preload.installVizualizationApis().then(
            this.composeDataTable_, null, this);
      }
    }
  },

  /** @private */
  composeDataTable_: function() {
    goog.array.forEach(this.sets_, function(dataset, index) {
      this.dataTables_.push(google.visualization.arrayToDataTable(
          /** @type {!Array<Array<*>>} */(dataset)));
    }, this);
    this.updateChart_();
  },

  /** @override */
  enterDocument: function() {
    goog.base(this, 'enterDocument');
    longa.preload.installVizualizationApis().then(function() {
      this.chart = new google.visualization.LineChart(
          this.getContentElement());
    }, null, this).thenCatch(function() {
      goog.dom.setTextContent(
          this.getElementByClass(
              goog.getCssName(this.getRenderer().getCssClass(), 'message')),
          longa.strings.loadingViz(null).toString());
      this.showOverlay_(true);
    }, this);
  },

  statics: {
    /**
     * The chart configuration options.
     * @type {!Object<string, ?>}
     * @final
     */
    Options: {
      'title': '',
      'width': 380,
      'height': 280,
      'series': {
        0: {
          'color': '#00796b',
          'lineWidth': 2,
          'pointShape': {
            'type': 'circle'
          }
        }
      },
      'pointSize': 3,
      'titleTextStyle': {
        'color': '#00796b',
        'fontSize': 14
      },
      'chartArea': {
        'left': 60,
        'top': 40,
        'width': 280,
        'height': 200
      },
      'animation': {
        'duration': 200
      },
      'hAxis': {
        'baselineColor': '#26a69a',
        'textStyle': {
          'color': '#00bfa5'
        },
        'gridlines': {
          'color': '#e0f2f1',
          'count': -1
        }
      },
      'vAxis': {
        'baselineColor': '#26a69a',
        'textStyle': {
          'color': '#00bfa5'
        },
        'gridlines': {
          'color': '#e0f2f1',
          'count': -1
        }
      },
      'legend': {
        'position': 'none'
      },
      'crosshair': {
        'trigger': 'both',
        'color': '#ff9800'
      }
    },

    /**
     * Statically available names for titles and columns.
     * @type {!Array<!string>}
     * @private
     */
    Names_: [
      longa.strings.Profit(null).toString(),
      longa.strings.Signals(null).toString(),
      longa.strings.Charge(null).toString(),
      longa.strings.Members(null).toString()
    ]
  }
});


/** @extends {pstj.material.ElementRenderer} */
longa.ui.ChartRenderer = goog.defineClass(pstj.material.ElementRenderer, {
  constructor: function() {
    pstj.material.ElementRenderer.call(this);
  },

  /** @override */
  getCssClass: function() {
    return longa.ui.ChartRenderer.CSS_CLASS;
  },

  /** @override */
  getTemplate: function(model) {
    return longa.template.Chart(null);
  },

  /** @override */
  getContentElement: function(el) {
    return goog.dom.getElementByClass(
        goog.getCssName(this.getCssClass(), 'content'), el);
  },

  /**
   * Getter for the overlay element.
   * @return {Element}
   */
  getOverlay: function(el) {
    return goog.dom.getElementByClass(goog.getCssName(this.getCssClass(),
        'overlay'), el);
  },

  statics: {
    /**
     * @final
     * @type {string}
     */
    CSS_CLASS: goog.getCssName('longa-app-chart')
  }
});
goog.addSingletonGetter(longa.ui.ChartRenderer);

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(longa.ui.Chart,
    longa.ui.ChartRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    longa.ui.ChartRenderer.CSS_CLASS, function() {
      return new longa.ui.Chart(null);
    });
