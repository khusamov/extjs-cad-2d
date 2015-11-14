
Ext.define("Khusamov.override.data.Store", {
	
	override: "Ext.data.Store",
	
	listeners: {
		beforeload: function(store, operation) {
			
			// См. Khusamov.override.form.field.ComboBox
			//http://javascript.ru/forum/extjs/56522-vyvod-znacheniya-combobox-kotoroe-nakhoditsya-na-vtorojj-stranice-store.html
			if ("combobox" in store && store.combobox instanceof Ext.form.field.ComboBox) {
				var params = {};
				params[store.combobox.getComboboxParam()] = store.combobox.getValue();
				operation.setParams(Ext.Object.merge(operation.getParams() || {}, params));
			}
			
		}
	}
	
});