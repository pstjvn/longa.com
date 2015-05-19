goog.provide('longa.ui.Main');

goog.require('goog.async.Delay');
goog.require('goog.log');
goog.require('goog.ui.registry');
goog.require('longa.data');
goog.require('longa.ds.Screen');
goog.require('longa.ds.Topic');
goog.require('longa.ui.Alerts');
goog.require('longa.ui.Auth');
goog.require('longa.ui.Balance');
goog.require('longa.ui.Faq');
goog.require('longa.ui.MainHeader');
goog.require('longa.ui.Menu');
goog.require('longa.ui.Page');
goog.require('longa.ui.Pages');
goog.require('longa.ui.SideHeader');
goog.require('longa.ui.Terms');
goog.require('longa.ui.UserAuth');
goog.require('pstj.control.Control');
goog.require('pstj.material.DrawerPanel');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.material.Fab');
goog.require('pstj.material.HeaderPanel');
goog.require('pstj.material.icon');


/** @extends {pstj.material.Element} */
longa.ui.Main = goog.defineClass(pstj.material.Element, {
  /**
   * @param {goog.ui.ControlContent=} opt_content Text caption or DOM structure
   *     to display as the content of the control (if any).
   * @param {pstj.material.DrawerPanelRenderer=} opt_renderer Renderer used to
   *     render or  decorate the component; defaults to {@link
   *     pstj.material.DrawerPanelRenderer}.
   * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
   *     document interaction.
   */
  constructor: function(opt_content, opt_renderer, opt_domHelper) {
    pstj.material.Element.call(this, opt_content, opt_renderer, opt_domHelper);
    /**
     * @type {goog.debug.Logger}
     * @private
     * @final
     */
    this.logger_ = goog.log.getLogger('longa.ui.Main');

    /**
     * Delays the toggling of the sidebar in order to create more smooth
     * user experience.
     * @private
     * @type {goog.async.Delay}
     */
    this.delayShowSidebar_ = new goog.async.Delay(function() {
      this.drawer_.open();
    }, 200, this);

    this.delayHideSidebar_ = new goog.async.Delay(function() {
      this.drawer_.close();
    }, 200, this);

    // Configure the main with a main controller.
    this.control = new pstj.control.Control(this);
    this.control.init();

    // Handle screen switches on top level (screens).
    this.control.listen(longa.ds.Topic.SHOW_SCREEN, function(s) {
      // Whenever we show a new screen we need to close the drawer
      this.delayHideSidebar_.start();

      // We should be able to switch screens from here.
      if (s > 99 && s < 103) {
        goog.log.info(this.logger_, 'Switching to login view');
        this.mainPages.setSelectedIndex(0);
      } else if (s >= 0 && s < 10) {
        this.mainPages.setSelectedIndex(s);
      }
    });


    // handle presses on the MENU button on top of main header.
    this.control.listen(longa.ds.Topic.SHOW_MENU, function() {
      goog.log.info(this.logger_, 'Show the menu by request');
      this.delayShowSidebar_.start();
    });

    this.control.listen(longa.ds.Topic.USER_AUTH_CHANGED, function() {
      if (longa.ds.utils.isKnownUser()) {
        this.control.push(longa.ds.Topic.SHOW_SCREEN, longa.ds.Screen.BALANCE);
      } else {
        // if the user is unknown (i.e. logout) destroy the balance sheets.
        this.destroyMainBalanceSheet_();
        this.control.push(longa.ds.Topic.SHOW_SCREEN, longa.ds.Screen.LOGIN);
      }
    });

    this.control.listen(longa.ds.Topic.USER_BALANCE_CHANGE, function() {
      this.destroyMainBalanceSheet_();
      if (!goog.isNull(longa.data.balance)) {
        var balance = new longa.ui.Balance();
        this.balanceWrapper.addChild(balance, true);
        balance.loadReportingData();
      }
    });


    // CONSTRUCTS THE UI, for now we prefer this way as it allows for
    // faster access to the subcomponents.
    this.drawer_ = new pstj.material.DrawerPanel();

    this.sidePanel = null;
    this.mainPanel = null;

    this.sideHeaderPanel = new pstj.material.HeaderPanel();

    this.mainHeaderPanel = new pstj.material.HeaderPanel();
    this.mainHeaderPanel.setType('waterfall');

    this.sideHeader = new longa.ui.SideHeader();
    this.mainHeader = new longa.ui.MainHeader();

    // Sidebar config
    this.userAuth = new longa.ui.UserAuth();
    this.menu = new longa.ui.Menu();
    this.refreshButton = new pstj.material.Fab();
    this.refreshButton.addClassName(
        goog.getCssName('longa-app-refresh-button'));
    this.refreshButton.setTransitioning(true);
    this.refreshButton.setUseInk(true);
    this.refreshButton.setIcon(pstj.material.icon.Name.RELOAD);

    // Main screens
    this.auth = new longa.ui.Auth();
    this.alerts = new longa.ui.Alerts();
    this.terms = new longa.ui.Terms();
    this.faq = new longa.ui.Faq();

    // Main UX pages, wrap the main screens
    this.mainPages = new longa.ui.Pages();

    // 0
    this.authWrapper = new longa.ui.Page();
    this.authWrapper.addChild(this.auth, true);
    // 1
    this.balanceWrapper = new longa.ui.Page();
    // 2
    this.serviceWrapper = new longa.ui.Page();
    // 3
    this.signalFeedWrapper = new longa.ui.Page();
    // 4
    this.signalsWrapper = new longa.ui.Page();
    // 5
    this.alertsWrapper = new longa.ui.Page();
    this.alertsWrapper.addChild(this.alerts, true);
    // 6
    this.profileWrapper = new longa.ui.Page();
    // 7
    this.faqWrapper = new longa.ui.Page();
    this.faqWrapper.addChild(this.faq, true);
    // 8
    this.termsWrapper = new longa.ui.Page();
    this.termsWrapper.addChild(this.terms, true);


  },

  /** @override */
  addMaterialChildren: function() {
    goog.base(this, 'addMaterialChildren');
    // Once we have the children we want to start building the tree.
    this.addChild(this.drawer_, true);
    this.drawer_.getDrawerPanel().addChild(this.sideHeaderPanel, true);
    this.drawer_.getMainPanel().addChild(this.mainHeaderPanel, true);

    this.mainHeaderPanel.getHeader().addChild(this.mainHeader, true);
    this.sideHeaderPanel.getHeader().addChild(this.sideHeader, true);

    // Add main screens
    this.mainPages.addChild(this.authWrapper, true);
    this.mainPages.addChild(this.balanceWrapper, true);
    this.mainPages.addChild(this.serviceWrapper, true);
    this.mainPages.addChild(this.signalFeedWrapper, true);
    this.mainPages.addChild(this.signalsWrapper, true);
    this.mainPages.addChild(this.alertsWrapper, true);
    this.mainPages.addChild(this.profileWrapper, true);
    this.mainPages.addChild(this.faqWrapper, true);
    this.mainPages.addChild(this.termsWrapper, true);

    // Add sidebar itesm.
    this.sideHeaderPanel.getMain().addChild(this.userAuth, true);
    this.sideHeaderPanel.getMain().addChild(this.menu, true);
    this.sideHeaderPanel.getMain().addChild(this.refreshButton, true);

    this.mainHeaderPanel.getMain().addChild(this.mainPages, true);
  },

  /** @private */
  destroyMainBalanceSheet_: function() {
    if (this.balanceWrapper.hasChildren()) {
      this.balanceWrapper.removeChildren();
    }
  }
});


/** @extends {pstj.material.ElementRenderer} */
longa.ui.MainRenderer = goog.defineClass(pstj.material.ElementRenderer, {
  constructor: function() {
    pstj.material.ElementRenderer.call(this);
  },

  /** @override */
  getCssClass: function() {
    return longa.ui.MainRenderer.CSS_CLASS;
  },

  /** @override */
  getTemplate: function(m) {
    return longa.template.MainApp(m);
  },

  statics: {
    /**
     * @final
     * @type {string}
     */
    CSS_CLASS: goog.getCssName('longa-main-app')
  }
});
goog.addSingletonGetter(longa.ui.MainRenderer);

goog.ui.registry.setDefaultRenderer(longa.ui.Main,
    longa.ui.MainRenderer);


goog.ui.registry.setDecoratorByClassName(
    longa.ui.MainRenderer.CSS_CLASS, function() {
      return new longa.ui.Main(null);
    });
