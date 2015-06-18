/**
 * @fileoverview Element that bind to a sirtable list and displays its content
 * as SignalRecord items.
 */
goog.provide('longa.ui.SignalList');
goog.provide('longa.ui.SignalListRenderer');

goog.require('goog.array');
goog.require('goog.ui.registry');
goog.require('longa.ds.Signals');
goog.require('longa.template');
goog.require('longa.ui.Signal');
goog.require('pstj.ds.DtoBase.EventType');
goog.require('pstj.material.Element');
goog.require('pstj.material.ElementRenderer');


/** @extends {pstj.material.Element} */
longa.ui.SignalList = goog.defineClass(pstj.material.Element, {
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

  /** @override */
  setModel: function(model) {
    if (!goog.isNull(this.getModel())) {
      this.getHandler().unlisten(this.getModel(),
          pstj.ds.DtoBase.EventType.CHANGE, this.handleModelChange);
    }
    goog.base(this, 'setModel', model);
    if (!goog.isNull(this.getModel())) {
      this.getHandler().listen(this.getModel(),
          pstj.ds.DtoBase.EventType.CHANGE, this.handleModelChange);
    }
    this.renderList();
  },

  /**
   * @override
   * @return {?longa.ds.Signals}
   */
  getModel: function() {
    var model = goog.base(this, 'getModel');
    if (goog.isNull(model)) return null;
    else return goog.asserts.assertInstanceof(model, longa.ds.Signals);
  },

  /**
   * Rerenders the list of signals.
   * @protected
   */
  renderList: function() {
    goog.array.forEach(this.removeChildren(), function(child) {
      goog.dispose(child);
    });
    var model = goog.asserts.assertInstanceof(this.getModel(),
        longa.ds.Signals);
    goog.array.forEach(model.list, function(signal) {
      var uisignal = new longa.ui.Signal();
      uisignal.setModel(signal);
      this.addChild(uisignal, true);
    }, this);
  },

  /**
   * Handles the change event on a model assuming it is a sortable.
   * @protected
   * @param {goog.events.Event} e
   */
  handleModelChange: function(e) {
    this.renderList();
  }
});


/** @extends {pstj.material.ElementRenderer} */
longa.ui.SignalListRenderer = goog.defineClass(pstj.material.ElementRenderer, {
  constructor: function() {
    pstj.material.ElementRenderer.call(this);
  },

  /** @override */
  getCssClass: function() {
    return longa.ui.SignalListRenderer.CSS_CLASS;
  },

  /** @override */
  generateTemplateData: function(instance) {
    var model = instance.getModel();
    if (goog.isNull(model)) return {};
    else return goog.asserts.assertInstanceof(model, longa.ds.Signals);
  },

  /** @override */
  getTemplate: function(model) {
    return longa.template.SignalList(model);
  },

  statics: {
    /**
     * @final
     * @type {string}
     */
    CSS_CLASS: goog.getCssName('longa-app-signal-list')
  }
});
goog.addSingletonGetter(longa.ui.SignalListRenderer);

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(longa.ui.SignalList,
    longa.ui.SignalListRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    longa.ui.SignalListRenderer.CSS_CLASS, function() {
      return new longa.ui.SignalList(null);
    });
