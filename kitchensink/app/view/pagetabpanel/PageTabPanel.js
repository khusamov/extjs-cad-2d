
Ext.define("Kitchen.view.pagetabpanel.PageTabPanel", {
	
	extend: "Ext.tab.Panel",
	
	xtype: "pagetabpanel",
	
	onAdd: function(item, index) {
		this.callParent(arguments);
		item.onTabButtonAdd(this, index);
	}
	
});