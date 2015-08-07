
Ext.define("Kitchen.view.main.Main", {
	
	extend: "Ext.panel.Panel",
	
	requires: [
		"Kitchen.view.main.MainModel", 
		"Kitchen.view.main.MainController",
		"Kitchen.view.main.Menu",
		"Kitchen.view.site.Site"
	],
	
	plugins: "viewport",
	
	controller: "main",
	
	viewModel: {
		type: "main"
	},
	
	layout: "border",
	
	bind: {
		title: "{siteTitle}"
	},
	
	items: [{
		region: "west",
		xtype: "mainmenu",
		reference: "mainmenu",
		title: "Содержание",
		width: 300,
		split: true,
	}, {
		region: "center",
		xtype: "site",
		reference: "site",
	}]
	
});


