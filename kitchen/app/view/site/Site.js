
Ext.define("Kitchen.view.site.Site", {
	
	extend: "Ext.tab.Panel",
	
	xtype: "site",
	
	requires: ["Kitchen.view.site.page.Page"],
	
	border: false,
	
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
		//page.onTabCreate(this, index);
		this.getTabButton(page).on("click", function() {
			//page.fireEvent("tabclick", page);
			page.onTabClick();
		});
	},
	
	bind: {
		menuItem: "{selectedMenuItem}"
	},
	
	updateMenuItem: function(menuItem) {
		var page = this.getPageByMenuItem(menuItem);
		if (page) {
			
		} else {
			page = this.add({
				xtype: "page",
				menuItem: menuItem
			});
		}
		this.setActiveTab(page);
	},
	
	getPageByMenuItem: function(menuItem) {
		var result = null;
		this.items.each(function(page) {
			if (menuItem == page.getMenuItem()) {
				result = page;
				return false;
			}
		});
		return result;
	},
	
	getTabButton: function(page) {
		return this.getTabBar().items.getAt(this.items.indexOf(page));
	}
	
});