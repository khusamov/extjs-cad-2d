
Ext.define("Kitchen.model.Example", {
	
	extend: "Ext.data.TreeModel",
	
	proxy: {
		type: "memory",
		reader: {
			type: "json",
			rootProperty: "children"
		}
	},
	
	fields: [{
		name: "path",
		type: "string"
	}, {
		name: "file",
		type: "string"
	}]
	
});