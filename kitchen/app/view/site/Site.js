
Ext.define("Kitchen.view.site.Site", {
	
	extend: "Ext.tab.Panel",
	
	xtype: "site",
	
	requires: ["Kitchen.view.site.page.Page"],
	
	border: false,
	
	tabPosition: "bottom",
	
	config: {
		menuItem: null
	},
	
	listeners: {
		scope: "this",
		tabchange: "onTabChange"
	},
	
	onTabChange: function(me, page) {
		var menuItem = page.getMenuItem();
		this.setMenuItem(menuItem);
		this.publishState("menuItem", menuItem);
	},
	
	onAdd: function(page, index) {
		this.callParent(arguments);
		this.getTabButton(page).on("click", function() {
			page.onTabClick();
		});
	},
	
	bind: {
		menuItem: "{selectedMenuItem}"
	},
	
	updateMenuItem: function(menuItem) {
		if (menuItem) {
			var page = this.getPageByMenuItem(menuItem);
			if (!page) {
				page = this.add({
					xtype: "page",
					menuItem: menuItem
				});
			}
			this.setActiveTab(page);
		}
	},
	
	getPageByMenuItem: function(menuItem) {
		var me = this;
		var result = null;
		me.items.each(function(page) {
			if (menuItem.equal(page.getMenuItem())) {
				result = page;
				return false;
			}
		});
		return result;
	},
	
	getTabButton: function(page) {
		return this.getTabBar().items.getAt(this.items.indexOf(page));
	},
	
	refresh: function() {
		this.getPageByMenuItem(this.getMenuItem()).refresh();
	},
	
});