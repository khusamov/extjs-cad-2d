
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
	
	tools: [{
		type: "refresh",
		tooltip: "Обновить содержание сайта",
		handler: function() {
			this.up("mainmenu").getStore().load();
		}
	}],
	
	bind: {
		store: "{mainMenu}",
		selection: "{selectedMenuItem}",
	},
	
	/*tbar: [{
		text: "Развернуть",
		handler: function() {
			this.up("treepanel").expandAll();
		}
	}]*/
	
});