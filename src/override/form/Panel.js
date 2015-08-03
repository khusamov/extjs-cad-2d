
Ext.define("Khusamov.override.form.Panel", {
	
	override: "Ext.form.Panel",
	
	border: false,
	
	getIsValid: function() {
		return this.isValid();
	}
	
});