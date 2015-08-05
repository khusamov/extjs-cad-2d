
Ext.define("Kitchen.view.main.Main", {
	
	extend: "Ext.panel.Panel",
	
	requires: [
		"Kitchen.view.main.MainModel", 
		"Kitchen.view.main.MainController",
		"Ext.ux.IFrame",
		"Kitchen.store.Examples",
		"Kitchen.view.pagetabpanel.PageTabPanel",
		"Kitchen.view.code.Code"
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
		split: true,
		width: 400,
		
		title: "&nbsp",
		//itemId: "mainmenu",
		reference: "mainmenu",
		xtype: "treepanel",
		border: false,
		rootVisible: false,
		bind: {
			title: "{siteTitle}",
			store: "{mainMenu}",
			selection: "{selection}",
		},
		tbar: [{
			text: "Развернуть",
			handler: function() {
				this.up("treepanel").expandAll();
			}
		}]
	}, {
		region: "center",
		
		reference: "pages",
		xtype: "pagetabpanel",
		border: false,
		
		
		
		bind: {
			src: "{selection}"
		}
		
	}, {
		region: "east",
		split: true,
		width: 600,
		
		reference: "code",
		xtype: "codetabpanel",
		border: false,
		bind: {
			src: "{selection}"
		}
	}]
	
});


