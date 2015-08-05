
Ext.define("Kitchen.view.main.MainModel", {
	
	extend: "Ext.app.ViewModel",
	
	alias: "viewmodel.main",
	
	data: {
		siteTitle: null,
		mainMenuUrl: null
	},
	
	stores: {
		mainMenu: {
			type: "examples",
			proxy: {
				url: "{mainMenuUrl}"
			},
		}
	}
	
});