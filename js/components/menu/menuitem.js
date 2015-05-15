goog.provide('longa.ui.MenuItem');

goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.style');
goog.require('goog.ui.registry');
goog.require('longa.data');
goog.require('longa.template');
goog.require('pstj.ds.DtoBase.EventType');
goog.require('pstj.material.MenuItem');
goog.require('pstj.material.MenuItemRenderer');


/** @extends {pstj.material.MenuItem} */
longa.ui.MenuItem = goog.defineClass(pstj.material.MenuItem, {
  /**
   * @param {goog.ui.ControlContent=} opt_content Text caption or DOM structure
   *     to display as the content of the control (if any).
   * @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
   *     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
   * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
   *     document interaction.
   */
  constructor: function(opt_content, opt_renderer, opt_domHelper) {
    pstj.material.MenuItem.call(this, opt_content, opt_renderer, opt_domHelper);
    /**
     * The value of the badge in the menu.
     * @type {!string}
     * @private
     */
    this.badgeValue_ = '';
  },

  /**
   * Getter for the current badge value.
   * @return {!string}
   */
  getBadge: function() {
    return this.badgeValue_;
  },

  /**
   * Setter for the badge value.
   * @param {!string} value The new value to show.
   */
  setBadge: function(value) {
    this.badgeValue_ = value;
    this.getRenderer().setBadge(this);
  },

  /** @inheritDoc */
  getRenderer: function() {
    return goog.asserts.assertInstanceof(goog.base(this, 'getRenderer'),
        longa.ui.MenuItemRenderer);
  },

  /** @inheritDoc */
  decorateInternal: function(el) {
    goog.base(this, 'decorateInternal', el);
    var value = goog.dom.getTextContent(
        this.getRenderer().getBadge(el));
    if (goog.string.isEmptyOrWhitespace(value)) {
      this.setBadge('');
    } else {
      this.badgeValue_ = value;
    }
  },

  /** @override */
  enterDocument: function() {
    this.getHandler().listen(longa.data.alerts,
        pstj.ds.DtoBase.EventType.CHANGE, this.handleAlertsChange_);
  },

  /**
   * Handles the change in alerts instance.
   * @param {goog.events.Event} e The CHANGE event from the Data collection.
   * @private
   */
  handleAlertsChange_: function(e) {
    this.setBadge(longa.data.alerts.getCount().toString());
  }
});


/** @extends {pstj.material.MenuItemRenderer} */
longa.ui.MenuItemRenderer = goog.defineClass(pstj.material.MenuItemRenderer, {
  constructor: function() {
    pstj.material.MenuItemRenderer.call(this);
  },

  /** @override */
  getCssClass: function() {
    return longa.ui.MenuItemRenderer.CSS_CLASS;
  },

  /** @override */
  getTemplate: function(model) {
    return longa.template.MenuItem(model);
  },

  /** @override */
  generateTemplateData: function(control) {
    var model = goog.base(this, 'generateTemplateData', control);
    model.badge = control.getBadge();
    return model;
  },

  /**
   * Updates the badge value in the DOM.
   * @param {longa.ui.MenuItem} control The instance we are updateing.
   */
  setBadge: function(control) {
    var value = control.getBadge();
    var el = this.getBadge(control.getElement());
    goog.style.setElementShown(el, !goog.string.isEmptyOrWhitespace(value));
    goog.dom.setTextContent(el, value);
  },

  /**
   * Finds the badge element inside the DOM tree.
   * @param {Element} el The root element of the DOM.
   * @return {Element}
   * @protected
   */
  getBadge: function(el) {
    return goog.dom.getElementByClass(goog.getCssName(this.getCssClass(),
        'badge'), el);
  },

  statics: {
    /**
     * @final
     * @type {string}
     */
    CSS_CLASS: goog.getCssName('longa-menu-item')
  }
});
goog.addSingletonGetter(longa.ui.MenuItemRenderer);

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(longa.ui.MenuItem,
    longa.ui.MenuItemRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    longa.ui.MenuItemRenderer.CSS_CLASS, function() {
      return new longa.ui.MenuItem(null);
    });
