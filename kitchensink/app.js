
/**
 * Загрузчик приложения.
 */

Ext.Loader.setConfig({ disableCaching: false });
Ext.Ajax.setDisableCaching(false);

Ext.require([
	"Khusamov.svg.override.dom.Element",
	"Khusamov.browser.Console"
], function() {
	
	Khusamov.Console.setNamespace("Kitchen");
	Ext.application("Kitchen.Application");
	
});