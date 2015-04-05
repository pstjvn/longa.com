goog.provide('longa.ds.LoginDetails');

goog.require('pstj.ds.DtoBase');

goog.scope(function() {
var DTO = pstj.ds.DtoBase;


/** @extends {DTO} */
longa.ds.LoginDetails = goog.defineClass(DTO, {
  constructor: function() {
    DTO.call(this);
    /** @type {string} */
    this.run = 'log';
    /** @type {string} */
    this.username = '';
    /** @type {string} */
    this.password = '';
  },

  /** @override */
  toJSON: function() {
    return {
      'run': this.run,
      'username': this.username,
      'password': this.password
    };
  }
});

});  // goog.scope
