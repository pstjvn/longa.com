goog.provide('main_init');

goog.require('goog.module.ModuleLoader');
goog.require('goog.module.ModuleManager');


var mm = goog.module.ModuleManager.getInstance();
var ml = new goog.module.ModuleLoader();
mm.setLoader(ml);
mm.setAllModuleInfo(goog.global['MODULE_INFO']);
mm.setModuleUris(goog.global['MODULE_URIS']);

document.body.addEventListener('click', function() {
  mm.execOnLoad('app', function() {
    console.log('Loaded app');
  });
});
