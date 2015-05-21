goog.provide('longa.ui.BuyCredit');
goog.provide('longa.ui.BuyCreditRenderer');

goog.require('goog.async.Delay');
goog.require('goog.dom');
goog.require('goog.string');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.registry');
goog.require('longa.control.Exchange');
goog.require('longa.ds.Screen');
goog.require('longa.ds.Topic');
goog.require('longa.template');
goog.require('longa.ui.ErrorMessage');
goog.require('longa.ui.Form');
goog.require('pstj.control.Control');
goog.require('pstj.material.Button');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.material.Fab');
goog.require('pstj.material.Input');
goog.require('pstj.material.Item');


/** @extends {longa.ui.Form} */
longa.ui.BuyCredit = goog.defineClass(longa.ui.Form, {
  /**
   * @param {goog.ui.ControlContent=} opt_content Text caption or DOM structure
   *     to display as the content of the control (if any).
   * @param {goog.ui.ControlRenderer=} opt_renderer Renderer used to render or
   *     decorate the component; defaults to {@link goog.ui.ControlRenderer}.
   * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper, used for
   *     document interaction.
   */
  constructor: function(opt_content, opt_renderer, opt_domHelper) {
    longa.ui.Form.call(this, opt_content, opt_renderer, opt_domHelper);
    /**
     * The 'own' screen number. Used to determine when the instance is
     * requested to be shown and sync the fab button.
     * @type {number}
     * @protected
     */
    this.ownScreen = longa.ds.Screen.BALANCE_BUY;
    /**
     * Current state of the button.
     * @type {boolean}
     */
    this.buttonShown_ = false;
    /**
     * @private
     * @type {goog.async.Delay}
     */
    this.buttonDelay_ = new goog.async.Delay(this.updateFab_, 400, this);
    /**
     * @private
     * @type {goog.async.Delay}
     */
    this.backDelay_ = new goog.async.Delay(function() {
      this.control_.push(longa.ds.Topic.SHOW_SCREEN, longa.ds.Screen.BALANCE);
    }, 200, this);
    /**
     * @private
     * @type {pstj.control.Control}
     */
    this.control_ = new pstj.control.Control(this);
    this.control_.init();
    this.control_.listen(longa.ds.Topic.SHOW_SCREEN, this.handleScreenSwitch_);
    this.registerDisposable(this.buttonDelay_);
    this.registerDisposable(this.backDelay_);
    this.registerDisposable(this.control_);
  },

  /** @inheritDoc */
  enterDocument: function() {
    goog.base(this, 'enterDocument');
    this.getHandler().listen(this, goog.ui.Component.EventType.CHANGE,
        this.handleInputChange);
    this.getHandler().listen(this, goog.ui.Component.EventType.ACTION,
        this.handleActionButtons);
  },

  /**
   * Getter for the current amount.
   * @return {number}
   * @protected
   */
  getAmount: function() {
    return parseInt(this.getInput().getValue(), 10);
  },

  /**
   * Handles changes in screen.
   * @param {number} screen The screen number to show.
   * @private
   */
  handleScreenSwitch_: function(screen) {
    if (screen == this.ownScreen) {
      if (!this.buttonShown_) {
        this.buttonShown_ = true;
        this.buttonDelay_.start();
      }
    } else if (this.buttonShown_) {
      this.buttonShown_ = false;
      this.buttonDelay_.start();
    }
  },

  /**
   * Sets the FAB state.
   * @private
   */
  updateFab_: function() {
    if (this.buttonShown_) {
      this.getChildAt(this.getChildCount() - 1).addClassName(
          goog.getCssName('shown'));
    } else {
      this.getChildAt(this.getChildCount() - 1).removeClassName(
          goog.getCssName('shown'));
    }
  },

  /**
   * @protected
   * @param {goog.events.Event} e The CHANGE event from the input
   */
  handleInputChange: function(e) {
    var input = goog.asserts.assertInstanceof(e.target, pstj.material.Input);
    if (input.isValid()) {
      var num = parseInt(input.getCachedValue(), 10);
      if (!(isNaN(num))) {
        this.updateLabel(num);
      } else {
        this.updateLabel();
      }
    } else {
      this.updateLabel();
    }
    this.getSubmitButton().setEnabled(input.isValid());
  },

  /**
   * Handles the action buttons in the view.
   * @param {goog.events.Event} e
   * @protected
   */
  handleActionButtons: function(e) {
    if (e.target instanceof pstj.material.Button &&
        /** @type {pstj.material.Button} */(e.target).getAction() == 'goback') {
      this.backDelay_.start();
    } else {
      this.submitHandler();
    }
  },

  /**
   * @protected
   */
  submitHandler: function() {
    if (this.getInput().isValid() && !this.getInput().isEmpty()) {
      this.getSubmitButton().setEnabled(false);
      longa.control.Exchange.getInstance()
          .buyCredit(this.getAmount())
          .thenAlways(this.restoreButton, this)
          .then(this.handleNewRedirectUri, null, this);
    }
  },

  /**
   * Restores the button availability.
   * @protected
   */
  restoreButton: function() {
    this.getSubmitButton().setEnabled(true);
    this.getInput().setValue('');
  },

  /**
   * Simply redirect to the new URI.
   * @param {!string} uri The URL to set.
   * @protected
   */
  handleNewRedirectUri: function(uri) {
    // navigate to the new uri.
  },

  /**
   * Getter for the action button.
   * @protected
   * @return {!pstj.material.Button}
   */
  getSubmitButton: function() {
    return goog.asserts.assertInstanceof(this.getChildAt(4).getChildAt(0),
        pstj.material.Button);
  },

  /**
   * The value to put on the label.
   * @param {number=} opt_value
   * @protected
   */
  updateLabel: function(opt_value) {
    goog.dom.setTextContent(
        this.getRenderer().getLabelElement(this.getElement()),
        (goog.isNumber(opt_value) ? goog.string.padNumber(opt_value, 0, 2) :
            ''));
  },

  /**
   * @override
   * @return {longa.ui.BuyCreditRenderer}
   */
  getRenderer: function() {
    return goog.asserts.assertInstanceof(goog.base(this, 'getRenderer'),
        longa.ui.BuyCreditRenderer);
  },

  /**
   * Getter for the input.
   * @protected
   * @return {!pstj.material.InputBase}
   */
  getInput: function() {
    return goog.asserts.assertInstanceof(
        this.getChildAt(this.getRenderer().getInputIndex()),
        pstj.material.InputBase);
  }
});


/** @extends {pstj.material.ElementRenderer} */
longa.ui.BuyCreditRenderer = goog.defineClass(pstj.material.ElementRenderer, {
  constructor: function() {
    pstj.material.ElementRenderer.call(this);
  },

  /** @override */
  getCssClass: function() {
    return longa.ui.BuyCreditRenderer.CSS_CLASS;
  },

  /** @override */
  getTemplate: function(model) {
    return longa.template.BuyCredit(model);
  },

  /**
   * Getter for a specific child.
   * @param {Element} el The root element to look into.
   * @return {Element}
   */
  getLabelElement: function(el) {
    return goog.dom.getElementByClass(goog.getCssName(
        this.getStructuralCssClass(), 'currency'), el);
  },

  /**
   * Getter for the index where the input sits in the component.
   * @return {!number}
   */
  getInputIndex: function() {
    return 2;
  },

  statics: {
    /**
     * @final
     * @type {string}
     */
    CSS_CLASS: goog.getCssName('longa-app-buy-credit')
  }
});
goog.addSingletonGetter(longa.ui.BuyCreditRenderer);

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(longa.ui.BuyCredit,
    longa.ui.BuyCreditRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    longa.ui.BuyCreditRenderer.CSS_CLASS, function() {
      return new longa.ui.BuyCredit(null);
    });
