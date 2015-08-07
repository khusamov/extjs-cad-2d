
Ext.define("Kitchen.view.site.page.content.Html", {
	
	extend: "Kitchen.view.site.page.content.Content",
	
	requires: ["Khusamov.dom.InlineFrame"],
	
	xtype: "content.html",
	
	items: {
		xtype: "inlineframe",
		loadMask: false,
		border: false,
	},
	
	loadMask: "<div style='text-align: center'>Подождите,<br/>загружается страница...</div>",
	
	initEvents: function() {
		var me = this;
		me.callParent();
		me.down("inlineframe").on("load", "onLoad", me);
	},
	
	onLoad: function() {
		this.unmask();
	},
	
	onBoxReady: function() {
		this.callParent(arguments);
		this.load();
	},
	
	updateMenuItem: function(menuItem) {
		this.callParent(arguments);
		if (this.isItemsReady()) this.load();
	},
	
	load: function() {
		this.mask(this.loadMask);
		this.down("inlineframe").load(this.getMenuItem().getFilePath());
	}
	
});