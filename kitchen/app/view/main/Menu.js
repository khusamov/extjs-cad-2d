
Ext.define("Kitchen.view.main.Menu", {
	
	extend: "Ext.tree.Panel",
	
	xtype: "mainmenu",
	
	border: false,
	
	rootVisible: false,
	
	listeners: {
		scope: "this",
		reconfigure: "onReconfigure"
	},
	
	onReconfigure: function() {
		this.getStore().on("load", "onStoreLoad", this);
	},
	
	onStoreLoad: function() {
		this.expandAll();
	},
	
	bind: {
		store: "{mainMenu}",
		//title: "{siteTitle}",
		selection: "{selectedMenuItem}",
	},
	
	/*tbar: [{
		text: "Развернуть",
		handler: function() {
			this.up("treepanel").expandAll();
		}
	}]*/
	
});