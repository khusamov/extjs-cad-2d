
Ext.define("Kitchen.controller.Root", {
	
	extend: "Ext.app.Controller",
	
	init: function(application) {
		
	},
	
	onLaunch: function(application) {
		var me = this;
		
		
		
	},
	
	refs: [{
		ref: "desktop",
		selector: "uxiframe#desktop"
	}],
	
	control: {
		"treepanel#mainmenu": {
			itemclick: "onTreePanelItemClick"
		}
	},
	
	onTreePanelItemClick: function(treePanel, record) {
		this.getDesktop().load(record.getPath("path") + "/index.html");
	}
	
	
});