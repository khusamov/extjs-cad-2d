
Ext.define("Kitchen.view.site.page.Page", {
	
	extend: "Ext.panel.Panel",
	
	xtype: "page",
	
	requires: [
		"Kitchen.view.site.page.content.Html",
		"Kitchen.view.site.page.content.Script",
		"Kitchen.view.site.page.content.Markdown",
		"Kitchen.view.site.page.attachment.Attachment"
	],
	
	border: false,
	
	closable: true,
	
	layout: {
		type: "hbox",
		align: "stretch"
	},
	
	config: {
		menuItem: null
	},
	
	initComponent: function() {
		this.callParent();
		this.setup();
	},
	
	updateMenuItem: function(menuItem) {
		this.setTitle(menuItem.get("text"));
		if (this.isItemsReady()) this.setup();
	},
	
	onTabClick: function() {
		if (this.up().getActiveTab() == this) this.setup();
	},
	
	isItemsReady: function() {
		return this.items && this.items.isMixedCollection;
	},
	
	setup: function() {
		var panelType = {
			js: "script",
			html: "html",
			md: "markdown"
		};
		if (this.getMenuItem()) {
			this.removeAll();
			this.add({
				xtype: "content." + panelType[this.getMenuItem().getFileType()],
				menuItem: this.getMenuItem(),
				flex: 1
			});
			if (this.getMenuItem().hasAttachments()) {
				this.add({
					xtype: "splitter"
				}, {
					xtype: "attachment",
					menuItem: this.getMenuItem(),
					flex: 1
				});
			}
		}
	},
	
	
	
});