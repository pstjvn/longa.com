goog.provide('longa.control.Service_');
goog.provide('longa.service');

goog.require('longa.control.Toaster');
goog.require('longa.data');
goog.require('longa.rpc');
goog.require('longa.strings');
goog.require('pstj.control.Control');


/**
 * @extends {pstj.control.Control}
 * @private
 */
longa.control.Service_ = goog.defineClass(pstj.control.Control, {
  constructor: function() {
    pstj.control.Control.call(this);
    this.init();
  },

  /**
   * @return {!goog.Promise<!longa.gen.dto.Service>}
   */
  get: function() {
    return longa.rpc.getService().then(this.onGet_, null, this);
  },

  /**
   * Pushesh the updates service data to the server.
   * @param {!longa.gen.dto.Service} service
   * @return {!goog.Promise<!longa.gen.dto.Service>}
   */
  put: function(service) {
    return longa.rpc.updateService(service)
        .then(this.onPut_, this.onFail_, this);
  },

  /**
   * @param {!longa.gen.dto.Service} service
   * @return {!longa.gen.dto.Service}
   * @private
   */
  onGet_: function(service) {
    longa.data.service.fromJSON(/** @type {!Object<string, *>} */(
        service.toJSON()));
    return service;
  },

  /**
   * @param {!longa.gen.dto.Service} service
   * @return {!longa.gen.dto.Service}
   * @private
   */
  onPut_: function(service) {
    // Update the service id (edge case where the service was not defined
    // previously and we need the id so we can update it after its creation).
    longa.data.service.serviceid = service.serviceid;
    longa.control.Toaster.getInstance().addToast(
        longa.strings.onServiceUpdate(null).toString(), null, null);
    return service;
  },

  /**
   * @private
   * @param {*} e The potential error that occured.
   */
  onFail_: function(e) {
    longa.control.Toaster.getInstance().addToast(
        ((e instanceof Error) ? e.message :
            longa.strings.onServiceUpdateFail(null).toString()), null, null);
  }
});


/**
 * Globally accessible controller.
 * @type {!longa.control.Service_}
 */
longa.service = new longa.control.Service_();
