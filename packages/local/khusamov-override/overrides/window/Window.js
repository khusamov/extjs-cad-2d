
Ext.define("Khusamov.override.window.Window", {
	
	override: "Ext.window.Window",
	
	ghost: false,
	
	resizable: {
		dynamic: true
	},
	
	shadow: false,
	
	style: {
		borderColor: "rgb(219, 219, 219)"
	},
	
	bodyPadding: 10,
	
	onShow: function() {
		var me = this;
		me.callParent(arguments);
		if (me.modal) Ext.util.History.disable();
	},
	
	onHide: function() {
		var me = this;
		me.callParent(arguments);
		if (me.modal) Ext.util.History.enable();
	}
	
});