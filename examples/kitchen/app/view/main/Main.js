
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
		//title: "{siteTitle}"
	},
	
	//title: "Kitchen",
	
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