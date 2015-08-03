
Ext.define("Kitchen.view.main.Main", {
	
	extend: "Ext.panel.Panel",
	
	requires: [
		"Kitchen.view.main.MainModel", 
		"Kitchen.view.main.MainController",
		"Ext.ux.IFrame"
	],
	
	plugins: "viewport",
	
	controller: "main",
	
	viewModel: {
		type: "main"
	},
	
	layout: "border",
	border: false,
	
	items: [{
		title: "Пример",
		xtype: "panel",
		layout: "fit",
		region: "center",
		border: false,
		items: [{
			border: false,
			itemId: "desktop",
			xtype: "uxiframe",
		}]
	}, {
		itemId: "mainmenu",
		xtype: "treepanel",
		title: "Примеры",
		region: "west",
		split: true,
		width: 400,
		border: false,
		store: "Examples"
	}]
	
});


