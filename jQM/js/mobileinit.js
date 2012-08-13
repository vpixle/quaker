/* 
  jQuery Mobile Boilerplate
  mobileinit.js
  http://jquerymobile.com/demos/1.0.1/docs/api/globalconfig.html

  This file is only required if you need to apply overrides to the
  page before anything else has run. It MUST be loaded before
  the jQuery Mobile javascript file.
*/
$(document).bind('mobileinit', function(event){
  // apply overrides here
  $.mobile.loadingMessage = "Nahrávám ...";
  //$.mobile.loadingMessageTheme = "a"
  $.mobile.loadingMessageTextVisible = false; 
  $.mobile.pageLoadErrorMessage = "Stránka nenalezena"
  //$.mobile.pageLoadErrorMessageTheme = "e"
  $.mobile.page.prototype.options.domCache = true;
  $.mobile.allowCrossDomainPages = true;
  $.mobile.ajaxEnabled = true;  
  
  // Navigation
  //$.mobile.page.prototype.options.backBtnText = "zpět";
  //$.mobile.page.prototype.options.addBackBtn   = true;
  //$.mobile.page.prototype.options.backBtnTheme = "f";
  $.mobile.defaultPageTransition = "fade";
  
  
  // Page
  //$.mobile.page.prototype.options.headerTheme  = "a";  // Page header only
  //$.mobile.page.prototype.options.contentTheme = "c";
  //$.mobile.page.prototype.options.footerTheme  = "a";
  
  // Listviews
  //$.mobile.listview.prototype.options.headerTheme  = "f";  // Header for nested lists
  //$.mobile.listview.prototype.options.theme        = "c";  // List items / content
  //$.mobile.listview.prototype.options.dividerTheme = "f";  // List divider
  //$.mobile.listview.prototype.options.splitTheme   = "c";
  //$.mobile.listview.prototype.options.countTheme   = "c";
  //$.mobile.listview.prototype.options.filterTheme  = "c";
  $.mobile.listview.prototype.options.filterPlaceholder = "Vyhledávání ...";
  
  //$.mobile.dialog.prototype.options.theme
  //$.mobile.selectmenu.prototype.options.menuPageTheme
  //$.mobile.selectmenu.prototype.options.overlayTheme
});