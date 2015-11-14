
Ext.define("Khusamov.override.util.History", {
	
	override: "Ext.util.History",
	
	enabled: true,
	
	enable: function() {
		var me = this;
		if (!me.enabled) {
			me.enabled = true;
			me.un("change", "fixhash", me);
		}
	},
	
	disable: function() {
		var me = this;
		if (me.enabled) {
			me.enabled = false;
			me.fixedhash = window.location.hash;
			me.on("change", "fixhash", me);
		}
	},
	
	fixhash: function(token) {
		window.location.hash = this.fixedhash;
	}
	
});