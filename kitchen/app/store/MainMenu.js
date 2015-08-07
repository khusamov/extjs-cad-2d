
Ext.define("Kitchen.store.MainMenu", {
	
	alias: "store.mainmenu",
	
	extend: "Ext.data.TreeStore",
	
	model: "Kitchen.model.MainMenuItem",
	
	proxy: {
		type: "ajax"
	},
	
	root: {
		text: null
	}
	
});