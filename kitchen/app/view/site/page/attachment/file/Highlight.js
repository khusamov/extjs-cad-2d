
Ext.define("Kitchen.view.site.page.attachment.file.Highlight", {
	
	extend: "Kitchen.view.site.page.attachment.file.File",
	
	xtype: "file.highlight",
	
	requires: ["Khusamov.text.Highlight"],
	
	items: {
		xtype: "highlight",
		trim: false
	},
	
	loadMask: "<div style='text-align: center'>Подождите,<br/>загружается файл...</div>",
	
	initComponent: function() {
		this.callParent();
		this.connection = Ext.create("Ext.data.Connection");
	},
	
	initEvents: function() {
		this.callParent();
		this.connection.on("requestcomplete", "onRequestComplete", this);
	},
	
	onRequestComplete: function() {
		this.unmask();
	},
	
	onBoxReady: function() {
		this.callParent(arguments);
		this.load();
	},
	
	updateMenuItem: function(menuItem) {
		if (this.isItemsReady()) this.load();
	},
	
	load: function() {
		var me = this;
		me.mask(me.loadMask);
		me.connection.request({
			url: me.getFile(),
			success: function(response) {
				var text = response.responseText;
				me.down("highlight").setText(text);
			}
		});
	}
	
});