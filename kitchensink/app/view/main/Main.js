
Ext.define("Kitchen.view.main.Main", {
	
	extend: "Ext.panel.Panel",
	
	requires: [
		"Kitchen.view.main.MainModel", 
		"Kitchen.view.main.MainController",
		"Ext.ux.IFrame",
		"Kitchen.store.Examples",
		"Kitchen.view.pagetabpanel.PageTabPanel",
		"Kitchen.view.code.CodeTabPanel"
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
		reference: "mainmenu",
		xtype: "treepanel",
		border: false,
		rootVisible: false,
		bind: {
			title: "{siteTitle}",
			store: "{mainMenu}",
			selection: "{selectedPage}",
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
			page: "{selectedPage}"
		}
		
	}, {
		region: "east",
		split: true,
		width: 600,
		
		reference: "code",
		xtype: "codetabpanel",
		border: false,
		bind: {
			page: "{selectedPage}"
		}
	}]
	
});


