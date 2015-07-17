goog.provide('longa.ui.Alerts');
goog.provide('longa.ui.AlertsRenderer');

goog.require('goog.array');
goog.require('goog.asserts');
goog.require('goog.ui.Control');
goog.require('goog.ui.registry');
goog.require('longa.control.Alerts');
goog.require('longa.control.Toaster');
goog.require('longa.data');
goog.require('longa.ds.Screen');
goog.require('longa.ds.Topic');
goog.require('longa.ds.utils');
goog.require('longa.template');
goog.require('longa.ui.Alert');
goog.require('pstj.control.Control');
goog.require('pstj.ds.DtoBase.EventType');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.material.EventMap');


/** @extends {pstj.material.Element} */
longa.ui.Alerts = goog.defineClass(pstj.material.Element, {
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
     * The last index in the list: by default its the 'head' of the list.
     * @type {number}
     * @private
     */
    this.lastDisplayedIndex_ = 0;
    /**
     * The currently displayed section.
     * @type {number}
     * @private
     */
    this.currentSection_ = 0;
    /**
     * The next screen to show on tap && ripple end.
     * @type {number}
     * @private
     */
    this.nextScreen_ = -1;
    /**
     * The control used to communicate with the rest of the app.
     * @type {pstj.control.Control}
     * @private
     */
    this.control_ = new pstj.control.Control(this);
    this.control_.init();
    this.setAutoEventsInternal(
        pstj.material.EventMap.EventFlag.PRESS |
        pstj.material.EventMap.EventFlag.TAP);
  },

  /** @override  */
  enterDocument: function() {
    goog.base(this, 'enterDocument');
    this.getHandler().listen(longa.data.alerts,
        pstj.ds.DtoBase.EventType.CHANGE, this.onModelChange_);
    this.getHandler().listen(this, goog.ui.Component.EventType.ACTION,
        this.handleActionButton_);
    this.getHandler().listen(this, pstj.material.EventType.RIPPLE_END,
        this.handleEnd_);
  },

  /**
   * @private
   * @param {!goog.events.Event} e
   */
  handleEnd_: function(e) {
    if (this.nextScreen_ != -1) {
      this.control_.push(longa.ds.Topic.SHOW_SCREEN, this.nextScreen_);
      this.nextScreen_ = -1;
    }
  },

  /** @override */
  onPress: function(e) {
    this.nextScreen_ = -1;
  },

  /** @override */
  onTap: function(e) {
    if (e.target instanceof longa.ui.Alert) {
      var model = e.target.getModel();
      if (!goog.isNull(model)) {
        switch (model.type) {
          case 'SYSTEM':
            break;
          case 'BALANCE':
            this.nextScreen_ = longa.ds.Screen.BALANCE;
            break;
          case 'PROFILE':
            this.nextScreen_ = longa.ds.Screen.PROFILE;
            break;
          case 'SIGNAL':
            this.nextScreen_ = longa.ds.Screen.SIGNALS;
            break;
          case 'PROVIDER':
            this.nextScreen_ = (longa.ds.utils.isSeller() ?
                longa.ds.Screen.SERVICE : longa.ds.Screen.FEED);
            break;
        }
      }
    }
  },

  /**
   * @private
   * @param {goog.events.Event} e
   */
  handleActionButton_: function(e) {
    longa.control.Alerts.getInstance().getOld();
  },

  /** @private */
  appendAlerts_: function() {
    // find the index that is missing and
    var endIndex = goog.array.findIndex(
        longa.data.alerts.alerts, function(alert) {
          if (alert.id < this.lastDisplayedIndex_) return true;
          return false;
        }, this);
    if (endIndex == -1) {
      goog.array.forEach(longa.data.alerts.alerts, function(alert) {
        var el = new longa.ui.Alert();
        el.setModel(alert);
        this.getChildAt(1).addChild(el, true);
      }, this);
    } else {
      for (var i = endIndex; i > -1; i--) {
        var element = new longa.ui.Alert();
        element.setModel(longa.data.alerts.alerts[i]);
        this.getChildAt(1).addChildAt(element, 0, true);
      }
    }
    this.lastDisplayedIndex_ = longa.data.alerts.alerts[0].id;
  },

  /**
   * @private
   * @param {goog.events.Event} e The change event from the model.
   */
  onModelChange_: function(e) {
    if (longa.data.alerts.alerts.length == 0) {
      // No alerts (possibly the user logged out.)
      this.showSection(0);
      // clear data from list
      this.getChildAt(1).removeChildren();
    } else {
      // we have some alerts.
      this.showSection(1);
      if (this.lastDisplayedIndex_ < longa.data.alerts.alerts[0].id) {
        // we need to render some results.
        // if we are currently in view first ask the user, else directly
        // append alerts
        if (!goog.isNull(this.getParent()) && this.getParent().isSelected()) {
          if (this.lastDisplayedIndex_ == 0) {
            this.appendAlerts_();
          } else {
            // currently alerts are shown - ask the user first
            longa.control.Toaster.getInstance().addToast(
                longa.template.ToastForNewAlerts(null).toString(),
                function() {
                  this.appendAlerts_();
                },
                this,
                longa.template.ShowNewAlerts(null).toString());
          }
        } else {
          this.appendAlerts_();
          // ask the user to navigate to the new alerts.
          longa.control.Toaster.getInstance().addToast(
              longa.template.ToastForNewAlerts(null).toString(),
              function() {
                this.control_.push(longa.ds.Topic.SHOW_SCREEN,
                    longa.ds.Screen.ALERTS);
              },
              this,
              longa.template.ToastForNewAlertsButton(null).toString());
        }
      }
    }
  },

  /**
   * Shows a specific section of alerts.
   * @param {number} idx The index of the section to show.
   */
  showSection: function(idx) {
    if (idx != this.currentSection_) {
      this.currentSection_ = idx;
      this.getRenderer().showSection(this, idx);
    }
  },

  /**
   * Overrides the renderer getter.
   * @return {longa.ui.AlertsRenderer}
   */
  getRenderer: function() {
    return goog.asserts.assertInstanceof(goog.base(this, 'getRenderer'),
        longa.ui.AlertsRenderer);
  }
});


/** @extends {pstj.material.ElementRenderer} */
longa.ui.AlertsRenderer = goog.defineClass(pstj.material.ElementRenderer, {
  constructor: function() {
    pstj.material.ElementRenderer.call(this);
  },

  /** @override */
  getCssClass: function() {
    return longa.ui.AlertsRenderer.CSS_CLASS;
  },

  /** @override */
  getTemplate: function(model) {
    return longa.template.Alerts(model);
  },

  /** @override */
  generateTemplateData: function(control) {
    return null;
  },

  /**
   * Sets the currently visible section in UI. The other section will be hidden.
   * @param {longa.ui.Alerts} sheet
   * @param {number} index The index of the section to show.
   */
  showSection: function(sheet, index) {
    if (index < 0 || index > 1) throw new Error('Section index out of bound');
    goog.array.forEach(sheet.getElementsByClass(goog.getCssName(
        this.getCssClass(), 'section')), function(section, idx) {
          goog.style.setElementShown(section, idx == index);
        });
  },

  statics: {
    /**
     * @final
     * @type {string}
     */
    CSS_CLASS: goog.getCssName('longa-app-alerts')
  }
});
goog.addSingletonGetter(longa.ui.AlertsRenderer);

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(longa.ui.Alerts,
    longa.ui.AlertsRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    longa.ui.AlertsRenderer.CSS_CLASS, function() {
      return new longa.ui.Alerts(null);
    });
