
Ext.define("Kitchen.controller.Root", {
	
	extend: "Ext.app.Controller",
	
	control: {
		"mainmenu": {
			itemclick: "onMainMenuItemClick"
		}
	},
	
	onMainMenuItemClick: function(treePanel, record) {
		// Переключить hash в новое значение.
		this.redirectTo(record.getPath("path"));
	},
	
	init: function(application) {
		
	},
	
	onLaunch: function(application) {
		var mainViewModel = application.getMainView().getViewModel();
		mainViewModel.set({
			siteTitle: application.getTitle(),
			mainMenuUrl: window.MAIN_MENU_URL
		});
	},
	
});