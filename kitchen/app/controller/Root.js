
Ext.define("Kitchen.controller.Root", {
	
	extend: "Ext.app.Controller",
	
	refs: [{
		ref: "mainMenu",
		selector: "mainmenu"
	}],
	
	control: {
		"mainmenu": {
			itemclick: "onMainMenuItemClick"
		}
	},
	
	routes: {
		":path": {
			action: "openPath",
			conditions: {
				":path": "(.*)"
			}
		}
	},
	
	onMainMenuItemClick: function(mainMenu, menuItem) {
		// Переключить hash в новое значение.
		this.redirectTo(menuItem.getFilePath());
	},
	
	init: function(application) {
		var me = this;
		this.currentPath = null;
		
		var keymap = Ext.create("Ext.util.KeyMap", {
			target: Ext.getWin(),
			key: Ext.event.Event.F5,
			fn: function(key, event) {
				if (!event.ctrlKey) {
					application.getMainView().refresh();
					event.stopEvent();
				}
			}
		});
		
	},
	
	onLaunch: function(application) {
		var me = this;
		var mainViewModel = application.getMainView().getViewModel();
		mainViewModel.set({
			siteTitle: application.getTitle(),
			mainMenuUrl: window.MAIN_MENU_URL
		});
		
		me.getMainMenu().on("reconfigure", "onMainMenuStoreReconfigure", me);
		me.onMainMenuStoreReconfigure();
	},
	
	onMainMenuStoreReconfigure: function() {
		var me = this;
		me.getMainMenu().getStore().on("load", "onMainMenuStoreLoad", me);
	},
	
	onMainMenuStoreLoad: function() {
		var me = this;
		me.openPath(me.currentPath);
	},
	
	openPath: function(path) {
		this.currentPath = path;
		var findedMenuItem = null;
		this.getMainMenu().getStore().each(function(menuItem) {
			if (path == menuItem.getFilePath()) {
				findedMenuItem = menuItem;
				return false;
			}
		});
		if (findedMenuItem) {
			this.getMainMenu().setSelection(findedMenuItem);
		}
	},
	
});