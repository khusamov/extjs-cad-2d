
Ext.define("Kitchen.view.site.page.content.Content", {
	
	extend: "Ext.panel.Panel",
	
	xtype: "content",
	
	border: false,
	
	layout: "fit",
	
	config: {
		menuItem: null
	},
	
	isItemsReady: function() {
		return this.items && this.items.isMixedCollection;
	},
	
});