
Ext.define("Kitchen.view.pagetabpanel.PageTabPanel", {
	
	extend: "Ext.tab.Panel",
	
	xtype: "pagetabpanel",
	
	initComponent: function() {
		this.callParent();
		this.pages = {};
		this.src = null;
	},
	
	listeners: {
		scope: "this",
		tabchange: "onTabChange"
	},
	
	onAdd: function(item, index) {
		this.callParent(arguments);
		item.onTabButtonAdd(this, index);
	},
	
	
	
	
	onTabChange: function(tabPanel, newCard) {
		this.src = newCard._src;
		this.fireEvent("srcchange", tabPanel, newCard);
	},
	
	publishes: ["src"],
	twoWayBindable: ["src"],
	
	getSrc: function() {
		return this.src;
	},
	
	
	
	
	setSrc: function(record) {
		var me = this;
		this.src = record;
		if (record) {
			var src = record.getPath("path") + "/" + (record.get("file") || "index.js");
			var pages = me;
			
			if (this.pages[src]) {
				pages.setActiveTab(this.pages[src]);
			} else {
				var title = record.get("text");
				var page = this.pages[src] = pages.add(me.getPageConfig(title, src));
				pages.setActiveTab(page);
				page.load(src);
				
				page._src = record;
				
			}
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
	},
	
});