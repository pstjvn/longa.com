goog.provide('longa.ui.Profile');

goog.require('goog.array');
goog.require('goog.ui.registry');
goog.require('longa.control.Toaster');
goog.require('longa.data');
goog.require('longa.gen.dto.Profile');
goog.require('longa.profile');
goog.require('longa.ui.Form');
goog.require('pstj.ds.DtoBase.EventType');
goog.require('pstj.material.Button');
goog.require('pstj.material.ElementRenderer');


/** @extends {longa.ui.Form} */
longa.ui.Profile = goog.defineClass(longa.ui.Form, {
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
    this.getHandler().listen(this, goog.ui.Component.EventType.ACTION,
        this.handleAction_);
    this.getHandler().listen(longa.data.profile,
        pstj.ds.DtoBase.EventType.CHANGE,
        this.handleProfileUpdate_);
    this.getHandler().listen(this.querySelector('[name="country"]'),
        goog.events.EventType.CHANGE, this.handleCountryChange_);
  },

  /**
   * Handles the changes in the country selection list. We use it to
   * clear the state selection for non-US.
   * @param {goog.events.Event} e
   * @protected
   */
  handleCountryChange_: function(e) {
    var select = /** @type {HTMLSelectElement} */(e.target);
    var value = select.value;
    if (value != 'United States') {
      var s = /** @type {HTMLSelectElement} */(
          this.querySelector('[name="state"]'));
      s.value = s.options.item(0).value;
    }
  },

  /**
   * Handles the updates on the profile data structure.
   * This should happen only once when the user logs in and
   * then again when logs out and possible when reloading all data.
   *
   * WHen user pushes profile updates to server the local profile data should
   * not be updated via 'fromJSON'.
   *
   * @private
   * @param {goog.events.Event} e
   */
  handleProfileUpdate_: function(e) {
    this.putValues_(goog.asserts.assertObject(longa.data.profile.toJSON()));
  },

  /**
   * Updates the values in the UI.
   * @private
   * @param {Object<string, *>} map
   */
  putValues_: function(map) {
    this.forEachChild(function(child) {
      if (child instanceof pstj.material.InputBase) {
        var name = child.name;
        if (goog.isDefAndNotNull(map[name])) {
          child.setValue(goog.asserts.assertString(map[name]));
        }
      }
    });
    goog.array.forEach(this.querySelectorAll('select'), function(select) {
      var name = select.name;
      if (goog.isDefAndNotNull(map[name])) {
        select.value = goog.asserts.assertString(map[name]);
      }
    });
  },

  /**
   * @param {goog.events.Event} e
   * @private
   */
  handleAction_: function(e) {
    var profile = this.getValues_();
    if (goog.isNull(profile)) {
      // handle error
    } else {
      this.getActionButton().setEnabled(false);
      longa.profile.put(profile)
          .then(this.onSuccess_, this.onFail_, this)
          .thenAlways(this.onComplete_, this);
    }
  },

  /** @private */
  onSuccess_: function() {
    longa.control.Toaster.getInstance().addToast(
        longa.strings.onProfileUpdateSuccess(null).toString(), null, null);
  },

  /**
   * @private
   * @param {*} e
   */
  onFail_: function(e) {
    if (e instanceof Error) {
      longa.control.Toaster.getInstance().addToast(e.message, null, null);
    }
  },

  /** @private */
  onComplete_: function() {
    this.getActionButton().setEnabled(true);
  },

  /**
   * @private
   * @return {longa.gen.dto.Profile}
   */
  getValues_: function() {
    if (!goog.isNull(longa.data.profile)) {
      var map = {};

      this.forEachChild(function(child) {
        if (child instanceof pstj.material.InputBase) {
          map[child.name] = child.getValue();
        }
      });

      goog.array.forEach(this.querySelectorAll('select'), function(select) {
        map[select.name] = select.value;
      });

      map['run'] = longa.data.profile.run;

      var profile = new longa.gen.dto.Profile();
      profile.fromJSON(map);
      return profile;
    } else {
      return null;
    }
  },

  /** @inheritDoc */
  getActionButton: function() {
    return goog.asserts.assertInstanceof(
        this.getChildAt(this.getChildCount() - 2),
        pstj.material.Button);
  }
});


/** @extends {pstj.material.ElementRenderer} */
longa.ui.ProfileRenderer = goog.defineClass(pstj.material.ElementRenderer, {
  constructor: function() {
    pstj.material.ElementRenderer.call(this);
  },

  /** @override */
  getCssClass: function() {
    return longa.ui.ProfileRenderer.CSS_CLASS;
  },

  /** @override */
  getTemplate: function(model) {
    return longa.template.RegistrationForm({
      registration: false
    });
  },

  /** @inheritDoc */
  getStructuralCssClass: function() {
    return goog.getCssName('longa-registration-form');
  },

  statics: {
    /**
     * @final
     * @type {string}
     */
    CSS_CLASS: goog.getCssName('longa-app-profile')
  }
});
goog.addSingletonGetter(longa.ui.ProfileRenderer);

// Register for default renderer.
goog.ui.registry.setDefaultRenderer(longa.ui.Profile,
    longa.ui.ProfileRenderer);


// Register decorator factory function.
goog.ui.registry.setDecoratorByClassName(
    longa.ui.ProfileRenderer.CSS_CLASS, function() {
      return new longa.ui.Profile(null);
    });
