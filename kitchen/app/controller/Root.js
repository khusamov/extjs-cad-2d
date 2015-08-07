
Ext.define("Kitchen.controller.Root", {
	
	extend: "Ext.app.Controller",
	
	//requires: ["Kitchen.view.page.Page"],
	
	init: function(application) {
		//this.pages = {};
	},
	
	onLaunch: function(application) {
		var mainViewModel = application.getMainView().getViewModel();
		mainViewModel.set({
			siteTitle: application.getTitle(),
			mainMenuUrl: window.MAIN_MENU_URL
		});
	},
	
	/*refs: [{
		ref: "desktop",
		selector: "uxiframe#desktop"
	}],
	
	control: {
		"treepanel#mainmenu": {
			itemclick: "onTreePanelItemClick"
		}
	},*/
	
	/*onTreePanelItemClick: function(treePanel, record) {
		var me = this;
		var src = record.getPath("path") + "/" + (record.get("file") || "index.js");
		var pages = this.getApplication().getMainView().lookupReference("pages");
		
		if (this.pages[src]) {
			pages.setActiveTab(this.pages[src]);
		} else {
			var title = record.get("text");
			var page = this.pages[src] = pages.add(me.getPageConfig(title, src));
			pages.setActiveTab(page);
			page.load(src);
		}
	},
	
	getPageConfig: function(title, src) {
		var me = this;
		return {
			xtype: "page",
			title: title,
			listeners: {
				scope: me,
				args: [src],
				close: "onPageTabClose",
				tabclick: "onPageTabClick"
			}
		};
	},
	
	onPageTabClose: function(src) {
		delete this.pages[src];
	},
	
	onPageTabClick: function(src) {
		this.pages[src].reload();
	},*/
	
	
});