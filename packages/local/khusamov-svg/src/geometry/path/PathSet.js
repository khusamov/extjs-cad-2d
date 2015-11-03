
Ext.define("Khusamov.svg.geometry.path.PathSet", {
	
	extend: "Khusamov.svg.geometry.Primitive",
	
	isPathSet: true,
	
	type: "pathset",
	
	config: {
		
		paths: []
		
	},
	
	add: function(path) {
		this.getPaths().push(path);
		this.fireEvent("update");
		return this;
	},
	
	eachPath: function(fn, scope) {
		this.getPaths().forEach(fn, scope);
		return this;
	},
	
	clear: function() {
		this.setPaths([]);
		return this;
	},
	
	toString: function() {
		var result = [];
		this.getPaths().forEach(function(path) {
			result.push(path.toString());
		});
		return result.join(" ");
	}
	
});