
Ext.define("Khusamov.override.form.field.ComboBox", {
	
	override: "Ext.form.field.ComboBox",
	
	minChars: 0,
	
	config: {
		comboboxParam: "combobox"
	},
	
	initComponent: function() {
		this.callParent();
		
		// См. Khusamov.override.data.Store
		//http://javascript.ru/forum/extjs/56522-vyvod-znacheniya-combobox-kotoroe-nakhoditsya-na-vtorojj-stranice-store.html
		this.store.combobox = this;
		
	}
	
});