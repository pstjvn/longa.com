/**
 * @fileoverview Provides realworld base component that includes the ability
 * to invoke globally linked controllers.
 *
 * By design it is to be used in complex components that you would like to be
 * decoupled from the UI heirarchy in such a way as to allow the component
 * instances to be consttucted independently from the app and receive / push
 * state in the global scope via a controller instance
 * {@see pstj.control.Control}.
 *
 * When designing the app the enginners should only listen for the global bus
 * topics that concern the particular component. The component can push
 * signals to the global bus as needed.
 */

goog.provide('longa.ui.Control');

goog.require('goog.asserts');
goog.require('pstj.control.Control');
goog.require('pstj.material.Element');


/** @extends {pstj.material.Element} */
longa.ui.Control = goog.defineClass(pstj.material.Element, {
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
     * Control instance that might be invoked in order to communicate global
     * scope changes and signals.
     *
     * @private
     * @type {pstj.control.Control}
     */
    this.control_ = null;
  },

  /**
   * Accessor for the controller instance for the component. If one does not
   * yes exists it will be created.
   *
   * The controller is considered potected and should be accessed only inside
   * the component itself and its subclasses.
   *
   * @return {!pstj.control.Control}
   * @protected
   */
  getController: function() {
    if (goog.isNull(this.control_)) {
      this.control_ = new pstj.control.Control(this);
      this.control_.init();
      this.registerDisposable(this.control_);
    }
    return goog.asserts.assertInstanceof(this.control_, pstj.control.Control);
  }
});
