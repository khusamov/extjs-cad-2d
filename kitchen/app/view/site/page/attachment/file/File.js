
Ext.define("Kitchen.view.site.page.attachment.file.File", {
	
	extend: "Ext.panel.Panel",
	
	xtype: "file",
	
	border: false,
	
	layout: "fit",
	
	config: {
		file: null
	},
	
	isItemsReady: function() {
		return this.items && this.items.isMixedCollection;
	},
	
});