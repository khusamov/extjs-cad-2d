
Ext.define("Kitchen.view.main.Main", {
	
	extend: "Ext.panel.Panel",
	
	requires: [
		"Kitchen.view.main.MainModel", 
		"Kitchen.view.main.MainController",
		"Ext.ux.IFrame",
		"Kitchen.store.Examples",
		"Kitchen.view.pagetabpanel.PageTabPanel"
	],
	
	plugins: "viewport",
	
	controller: "main",
	
	viewModel: {
		type: "main"
	},
	
	layout: "border",
	border: false,
	
	items: [{
		region: "west",
		
		title: "&nbsp",
		itemId: "mainmenu",
		xtype: "treepanel",
		split: true,
		width: 400,
		border: false,
		rootVisible: false,
		bind: {
			title: "{siteTitle}",
			store: "{mainMenu}"
		}
	}, {
		region: "center",
		
		reference: "pages",
		xtype: "pagetabpanel",
		border: false,
		
	}]
	
});


