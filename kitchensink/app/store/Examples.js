
Ext.define("Kitchen.store.Examples", {
	
	alias: "store.examples",
	
	extend: "Ext.data.TreeStore",
	
	model: "Kitchen.model.Example",
	
	proxy: {
		type: "ajax"
	},
	
	root: {
		text: null
	}
	
});