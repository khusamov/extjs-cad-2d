
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
	
	refresh: function() {
		this.setup();
	},
	
	setup: function() {
		var me = this;
		var panelType = {
			js: "script",
			html: "html",
			md: "markdown"
		};
		if (me.getMenuItem()) {
			me.removeAll();
			if (me.getMenuItem().hasAttachments()) {
				me.add({
					xtype: "splitter"
				}, {
					xtype: "attachment",
					menuItem: me.getMenuItem(),
					flex: 1
				});
			}
			var content = me.insert(0, {
				xtype: "content." + panelType[me.getMenuItem().getFileType()],
				menuItem: me.getMenuItem(),
				flex: 1
			});
			
			
			function setRefreshHandle() { content.down("tool[type=refresh]").on("click", "setup", me); }
			if (content.rendered) {
				setRefreshHandle();
			} else {
				content.on("render", setRefreshHandle);
			}
			

		}
	},
	
	
	
});