goog.provide('longa.control.Toaster');

goog.require('goog.async.Delay');
goog.require('goog.log');
goog.require('goog.ui.Component.EventType');
goog.require('longa.template');
goog.require('pstj.control.Control');
goog.require('pstj.material.Toast');


/** @extends {pstj.control.Control} */
longa.control.Toaster = goog.defineClass(pstj.control.Control, {
  constructor: function() {
    pstj.control.Control.call(this);
    /**
     * @final
     * @private
     * @type {goog.debug.Logger}
     */
    this.logger_ = goog.log.getLogger('longa.control.Toaster');
    /**
     * The queue to read from.
     * @type {Array<*>}
     * @private
     */
    this.q_ = [];
    /**
     * Reference to the toast we are using.
     * @private
     * @final
     * @type {pstj.material.Toast}
     */
    this.toast_ = new pstj.material.Toast();
    /**
     * If th toast is currently free.
     * @type {boolean}
     * @private
     */
    this.isFree_ = true;
    /**
     * The curent handler.
     * @type {Function}
     * @private
     */
    this.cb_ = null;
    /**
     * The scope to execute the function in.
     * @type {?Object}
     * @private
     */
    this.scope_ = null;
    /**
     * Allow to wait for 500 ms before showing the next toast in the queue.
     * @private
     * @final
     * @type {goog.async.Delay}
     */
    this.delay_ = new goog.async.Delay(function() {
      this.checkQueue_();
    }, 500, this);


    this.getHandler().listen(this.toast_, goog.ui.Component.EventType.CLOSE,
        function(e) {
          this.delay_.start();
        });

    this.getHandler().listen(this.toast_, goog.ui.Component.EventType.ACTION,
        this.callAction_);

    this.toast_.render(document.body);
  },

  /**
   * Add a new toast.
   * @param {!string} message The message to display.
   * @param {?function(): void} handler The handler to execute if any.
   * @param {?Object} scope The scope to execute the handler in.
   * @param {string=} opt_action The action name to display.
   */
  addToast: function(message, handler, scope, opt_action) {
    goog.log.info(this.logger_, 'Adding toast');
    if (this.isFree_) {
      this.showToast(message, handler, scope, (goog.isString(opt_action) ?
          opt_action : longa.template.DefaultToastButton(null).toString()));
    } else {
      goog.log.info(this.logger_, 'Toast is not free, queueing...');
      this.q_.push(message, handler, scope,
          (goog.isString(opt_action) ?
          opt_action : longa.template.DefaultToastButton(null).toString()));
    }
  },

  /**
   * Cheks if there are toasts in the queue and executes the first one.
   * @private
   */
  checkQueue_: function() {
    if (!goog.array.isEmpty(this.q_)) {
      var msg = goog.asserts.assertString(this.q_.shift());
      var cb = this.q_.shift();
      if (!goog.isFunction(cb)) cb = null;
      var scope = this.q_.shift();
      if (!goog.isObject(scope)) scope = null;
      var action = goog.asserts.assertString(this.q_.shift());
      this.showToast(msg, cb, scope, action);
    } else {
      this.isFree_ = true;
    }
  },

  /**
   * Execute the toast action.
   * @private
   */
  callAction_: function() {
    if (goog.isFunction(this.cb_)) {
      this.cb_.call(this.scope_);
    }
    this.cb_ = null;
    this.scope_ = null;
    this.toast_.setOpen(false);
  },

  /**
   * Shows a new toast.
   * @param {!string} msg
   * @param {?Function} handler
   * @param {?Object} scope
   * @param {!string} label
   * @protected
   */
  showToast: function(msg, handler, scope, label) {
    this.cb_ = handler;
    this.scope_ = scope;
    this.toast_.setLabel(label);
    this.toast_.setContent(msg);
    this.isFree_ = false;
    this.toast_.setOpen(true);
  }
});
goog.addSingletonGetter(longa.control.Toaster);
