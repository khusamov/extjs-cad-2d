
/**
 * This class is the view model for the Main view of the application.
 */

/* global Ext */

Ext.define("Kitchen.view.main.MainModel", {
	
	extend: "Ext.app.ViewModel",
	
	alias: "viewmodel.main",
	
	requires: ["Kitchen.store.MainMenu"],
	
	data: {
		selectedPage: null,
		siteTitle: null,
		mainMenuUrl: null
	},
	
	stores: {
		mainMenu: {
			type: "mainmenu",
			proxy: {
				url: "{mainMenuUrl}"
			}
		}
	}
	
});