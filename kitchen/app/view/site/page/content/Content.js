
Ext.define("Kitchen.view.site.page.content.Content", {
	
	extend: "Ext.panel.Panel",
	
	xtype: "content",
	
	border: false,
	
	layout: "fit",
	
	config: {
		menuItem: null
	},
	
	tools: [{
		type: "refresh"
	}],
	
	isItemsReady: function() {
		return this.items && this.items.isMixedCollection;
	},
	
	updateMenuItem: function(menuItem) {
		this.setTitle(menuItem.getPath("text", " / ", true));
	},
	
});