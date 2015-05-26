goog.provide('longa.ui.Service');

goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.registry');
goog.require('longa.gen.dto.Service');
goog.require('longa.template');
goog.require('longa.ui.Form');
goog.require('pstj.ds.DtoBase.EventType');
goog.require('pstj.material.Button');
goog.require('pstj.material.ElementRenderer');
goog.require('pstj.material.Input');
goog.require('pstj.material.ToggleButton');


/** @extends {longa.ui.Form} */
longa.ui.Service = goog.defineClass(longa.ui.Form, {
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
  },

  /** @override */
  enterDocument: function() {
    goog.base(this, 'enterDocument');
    this.getHandler().listen(longa.data.service,
        pstj.ds.DtoBase.EventType.CHANGE,
        this.handleModelChange_);

    this.getHandler().listen(this.getChildAt(2),
        [
          goog.ui.Component.EventType.CHECK,
          goog.ui.Component.EventType.UNCHECK
        ], this.handlePaidChange_);

    this.getHandler().listen(this, goog.ui.Component.EventType.ACTION,
        this.handleSubmit_);
  },

  /**
   * @private
   * @param {!goog.events.Event} e
   */
  handlePaidChange_: function(e) {
    var enable = e.type == goog.ui.Component.EventType.CHECK;
    this.getChildAt(3).setEnabled(enable);
    this.getChildAt(4).setEnabled(enable);
  },

  /**
   * Handles the submit button on the form.
   * @param {!goog.events.Event} e
   * @private
   */
  handleSubmit_: function(e) {
    var map = /** @type {!Object<string, *>} */(longa.data.service.toJSON());
    this.forEachChild(function(child) {
      if (child instanceof pstj.material.Input) {
        var value = child.getValue();
        if (child.type == 'number') {
          console.log('Parsing value', value);
          value = (value == '' ? 0 : parseFloat(value));
        }
        map[child.name] = value;
      } else if (child instanceof pstj.material.ToggleButton) {
        map[child.name] = (child.isChecked() ? 1 : 0);
      }
    }, this);
    var servicedef = new longa.gen.dto.Service();
    servicedef.fromJSON(map);
    longa.service.put(servicedef);
  },

  /**
   * Handle changes in the model of the service. This will happen only
   * when we reload from the server.
   * @param {!goog.events.Event} e
   * @private
   */
  handleModelChange_: function(e) {
    var map = /** @type {!Object<string, *>} */(
        longa.data.service.toJSON());
    this.forEachChild(function(child) {
      if (child instanceof pstj.material.Input) {
        child.setValue(map[child.name].toString());
      }
    }, this);
    this.getChildAt(1).setChecked(longa.data.service.status);
    this.getChildAt(2).setChecked(longa.data.service.paid);
  }
});


/** @extends {pstj.material.ElementRenderer} */
longa.ui.ServiceRenderer = goog.defineClass(pstj.material.ElementRenderer, {
  constructor: function() {
    pstj.material.ElementRenderer.call(this);
  },

  /** @override */
  getCssClass: function() {
    return longa.ui.ServiceRenderer.CSS_CLASS;
  },

  /** @override */
  getTemplate: function(model) {
    return longa.template.Service(model);
  },

  statics: {
    /**
     * @final
     * @type {string}
     */
    CSS_CLASS: goog.getCssName('longa-app-service')
  }
});
goog.addSingletonGetter(longa.ui.ServiceRenderer);

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(longa.ui.Service,
    longa.ui.ServiceRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    longa.ui.ServiceRenderer.CSS_CLASS, function() {
      return new longa.ui.Service(null);
    });
