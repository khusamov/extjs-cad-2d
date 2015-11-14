
/**
 * This class is the main view for the application. It is specified in app.js as the
 * "mainView" property. That setting automatically applies the "viewport"
 * plugin causing this view to become the body element (i.e., the viewport).
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */

/* global Ext */

Ext.define("Kitchen.view.main.Main", {
	
	extend: "Ext.panel.Panel",
	
	xtype: 'app-main',
	
	requires: [
		"Kitchen.view.main.MainModel", 
		"Kitchen.view.main.MainController",
		"Kitchen.view.main.Menu",
		"Kitchen.view.site.Site"
	],
	
	plugins: "viewport",
	
	controller: "main",
	viewModel: "main",
	
	ui: 'navigation',
	
	layout: "border",
	
	bind: {
		title: "{siteTitle}"
	},
	
	items: [{
		region: "west",
		xtype: "mainmenu",
		reference: "mainmenu",
		title: "Содержание",
		width: 366,
		split: true
	}, {
		region: "center",
		xtype: "site",
		reference: "site"
	}],
	
	refresh: function() {
		this.lookupReference("site").refresh();
	}
	
});