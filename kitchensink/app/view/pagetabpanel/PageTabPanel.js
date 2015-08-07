
Ext.define("Kitchen.view.pagetabpanel.PageTabPanel", {
	
	extend: "Ext.tab.Panel",
	
	xtype: "pagetabpanel",
	
	config: {
		page: null
	},
	
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
	
	
	getPageByTab: function(pageTab) {
		var result = null;
		Ext.Object.each(this.pages, function(page) {
			if (page.tab == pageTab) {
				result = page;
				return false;
			}
		});
		return result;
	},
	
	onTabChange: function(me, pageTab) {
		var page = this.getPageByTab(pageTab);
		this.setPage(page);
		this.publishState("page", page);
	},
	
	
	
	
	
	
	
	
	updatePage: function(page) {
		var me = this;
		
		if (page) {
			
			var id = page.getId();
			
			
			var src = page.getPath("path") + "/" + (page.get("file") || "index.js");
			
			
			if (me.pages[id]) {
				me.setActiveTab(me.pages[id]);
			} else {
				var title = page.get("text");
				var pageTab = me.add(me.getPageConfig(title, id));
				me.setActiveTab(pageTab);
				pageTab.load(src);
				
				
				me.pages[id] = {
					record: page,
					tab: pageTab
				};
				
				
				
			}
		}
	},
	
	getPageConfig: function(title, id) {
		var me = this;
		return {
			xtype: "page",
			title: title,
			listeners: {
				scope: me,
				args: [id],
				close: "onPageTabClose",
				tabclick: "onPageTabClick"
			}
		};
	},
	
	onPageTabClose: function(id) {
		delete this.pages[id];
	},
	
	onPageTabClick: function(id) {
		this.pages[id].tab.reload();
	},
	
});