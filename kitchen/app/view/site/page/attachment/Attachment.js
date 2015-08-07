
Ext.define("Kitchen.view.site.page.attachment.Attachment", {
	
	extend: "Ext.tab.Panel",
	
	xtype: "attachment",
	
	requires: [
		"Kitchen.view.site.page.attachment.file.Highlight"
	],
	
	border: false,
	
	config: {
		menuItem: null
	},
	
	initComponent: function() {
		this.callParent();
		this.setup();
	},
	
	isItemsReady: function() {
		return this.items && this.items.isMixedCollection;
	},
	
	updateMenuItem: function(menuItem) {
		if (this.isItemsReady()) this.setup();
	},
	
	setup: function() {
		var me = this;
		var panelType = {
			js: "highlight",
			html: "html",
			
			css: "highlight",
			sql: "highlight",
			php: "highlight",
			json: "highlight",
			md: "markdown"
		};
		if (me.getMenuItem()) {
			me.removeAll();
			me.getMenuItem().getAttachmentList().forEach(function(file) {
				var type = file.split(".")[1];
				me.setActiveTab(me.add({
					xtype: "file." + panelType[type],
					title: me.getMenuItem().getFileName(),
					file: file,
					flex: 1
				}));
			});
		}
	},
	
});