goog.provide('longa.ui.Feeds');
goog.provide('longa.ui.FeedsRenderer');

goog.require('goog.dom.classlist');
goog.require('goog.ui.registry');
goog.require('longa.ds.Screen');
goog.require('longa.ds.Topic');
goog.require('longa.template');
goog.require('longa.ui.Pages');
goog.require('longa.ui.PagesRenderer');
goog.require('longa.ui.ProviderBalance');
goog.require('longa.ui.SignalFeed');
goog.require('pstj.control.Control');
goog.require('pstj.material.Fab');
goog.require('pstj.material.HeaderPanel');


/** @extends {longa.ui.Pages} */
longa.ui.Feeds = goog.defineClass(longa.ui.Pages, {
  /**
   * @param {goog.ui.ControlContent=} opt_content Text caption or DOM structure
   *     to display as the content of the control (if any).
   * @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
   *     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
   * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
   *     document interaction.
   */
  constructor: function(opt_content, opt_renderer, opt_domHelper) {
    longa.ui.Pages.call(this, opt_content, opt_renderer, opt_domHelper);
    /**
     * @private
     * @type {pstj.material.Fab}
     */
    this.button_ = null;
    this.getController().listen(longa.ds.Topic.FEED_SELECTED, function(model) {
      // When a new model is selected we immediately want to re-render the
      // provider balance sheet. The switching to the sheet should be done
      // when animation of ripple ends.
      this.renderProviderBalanceSheet(
          /** @type {!longa.gen.dto.SellerBalance} */ (model));
    });
    this.getController().listen(longa.ds.Topic.SHOW_SCREEN, function(s) {
      if (s == longa.ds.Screen.FEED) {
        if (this.selectedIndex != 0) {
          // the button is either visible up or down, do nothing
          // simply animate out the pages and after that remove
          // down class (button goes up without animation) and
          // apply scale down class (button is animated to 0px).
        }
        this.setSelectedIndex(0);
      } else if (s == longa.ds.Screen.FEED_DETAILS) {
        if (this.selectedIndex == 0) {
          // scale up the button after the animation ends
        } else if (this.selectedIndex == 2) {
          // animate the button back up together with page transition and
          // after transition on it ends remove down class from it.
        }
        this.setSelectedIndex(1);
      } else if (s == longa.ds.Screen.FEED_SIGNALS) {
        if (this.selectedIndex == 1) {
          // animate the button down together with page transition and
          // when button transition ends apply down class.
          goog.dom.classlist.swap(this.button_.getElement(), 'up', 'down');
          var pos = goog.style.getClientPosition(this.button_.getElement());
          goog.dom.classlist.swap(this.button_.getElement(), 'down', 'up');
          console.log(pos);
        }
        this.setSelectedIndex(2);
      }
    });
    this.setUseAnimation(true);
  },

  /** @override */
  onTransitionEnd: function(e) {
    goog.base(this, 'onTransitionEnd', e);
    if (this.selectedIndex == 1) {
      goog.dom.classlist.add(this.button_.getElement(), 'up');
    }
  },

  /**
   * Provded a dto for a seller provider renders anew the balance sheet.
   * @param {!longa.gen.dto.SellerBalance} balance
   * @private
   */
  renderProviderBalanceSheet: function(balance) {
    var holder = this.getBalanceSheetContainer();
    goog.array.forEach(holder.removeChildren(), function(child) {
      goog.dispose(child);
    });
    var providerBalance = new longa.ui.ProviderBalance();
    providerBalance.setModel(balance);
    holder.addChild(providerBalance, true);
  },

  /**
   * Getter for the component where to render the balance sheet.
   * @protected
   * @return {!goog.ui.Component}
   */
  getBalanceSheetContainer: function() {
    return goog.asserts.assertInstanceof(
        this.getChildAt(1).getChildAt(0).getChildAt(1), goog.ui.Component);
  },

  /** @inheritDoc */
  addMaterialChildren: function() {
    goog.base(this, 'addMaterialChildren');
    this.button_ = goog.asserts.assertInstanceof(this.getChildAt(3),
        pstj.material.Fab);
  }
});


/** @extends {longa.ui.PagesRenderer} */
longa.ui.FeedsRenderer = goog.defineClass(longa.ui.PagesRenderer, {
  constructor: function() {
    longa.ui.PagesRenderer.call(this);
  },

  /** @override */
  getCssClass: function() {
    return longa.ui.FeedsRenderer.CSS_CLASS;
  },

  /** @override */
  getTemplate: function(model) {
    return longa.template.Feeds(model);
  },

  /** @override */
  getStructuralCssClass: function() {
    return goog.getCssName('longa-app-pages');
  },

  statics: {
    /**
     * @final
     * @type {string}
     */
    CSS_CLASS: goog.getCssName('longa-app-feed-pages')
  }
});
goog.addSingletonGetter(longa.ui.FeedsRenderer);

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(longa.ui.Feeds,
    longa.ui.FeedsRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    longa.ui.FeedsRenderer.CSS_CLASS, function() {
      return new longa.ui.Feeds(null);
    });
