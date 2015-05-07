goog.provide('longa.ui.Main');

goog.require('goog.ui.registry');
goog.require('longa.ui.Faq');
goog.require('longa.ui.MainHeader');
goog.require('longa.ui.Menu');
goog.require('longa.ui.Page');
goog.require('longa.ui.Pages');
goog.require('longa.ui.SideHeader');
goog.require('longa.ui.Terms');
goog.require('longa.ui.UserAuth');
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
    this.drawer_ = new pstj.material.DrawerPanel();

    this.sidePanel = null;
    this.mainPanel = null;

    this.sideHeaderPanel = new pstj.material.HeaderPanel();

    this.mainHeaderPanel = new pstj.material.HeaderPanel();
    this.mainHeaderPanel.setType('waterfall');

    this.sideHeader = new longa.ui.SideHeader();
    this.mainHeader = new longa.ui.MainHeader();

    this.terms = new longa.ui.Terms();
    this.faq = new longa.ui.Faq();

    // Sidebar config
    this.userAuth = new longa.ui.UserAuth();
    this.menu = new longa.ui.Menu();

    this.refreshButton = new pstj.material.Fab();
    this.refreshButton.addClassName(
        goog.getCssName('longa-app-refresh-button'));
    this.refreshButton.setTransitioning(true);
    this.refreshButton.setUseInk(true);
    this.refreshButton.setIcon(pstj.material.icon.Name.MENU);

    this.mainPages = new longa.ui.Pages();

    this.faqWrapper = new longa.ui.Page();
    this.faqWrapper.addChild(this.faq, true);

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

    this.mainPages.addChild(this.faqWrapper, true);
    this.mainPages.addChild(this.termsWrapper, true);

    this.sideHeaderPanel.getMain().addChild(this.userAuth, true);
    this.sideHeaderPanel.getMain().addChild(this.menu, true);
    this.sideHeaderPanel.getMain().addChild(this.refreshButton, true);

    this.mainHeaderPanel.getMain().addChild(this.mainPages, true);
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
