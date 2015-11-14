
Ext.define("Khusamov.override.util.Format", {
	
	override: "Ext.util.Format",
	
	ruMoney: function(v) {
		return Ext.util.Format.currency(v, " руб.", 2, true);
	}
	
});

Ext.onReady(function() {
	if (Ext.util && Ext.util.Format) {
		Ext.apply(Ext.util.Format, {
			thousandSeparator: " "
		});
	}
});