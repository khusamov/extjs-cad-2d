
Ext.define("Khusamov.svg.geometry.path.segment.Line", {
	
	extend: "Khusamov.svg.geometry.path.segment.Segment",
	
	requires: ["Khusamov.svg.geometry.Line"],
	
	getLength: function() {
		return this.toLine().getLength();
	},
	
	toString: function() {
		var me = this;
		var result = "";
		
		if (me.hasPath()) {
		
		
			result = [];
			result.push(me.getLastPoint().isRelative() ? "l" : "L");
			result.push(me.getLastPoint().toString());
			result = me.callParent([result.join(" ")]);
		
		}
		
		return result;
		
	},
	
	toLine: function() {
		return Ext.create("Khusamov.svg.geometry.Line", this.getFirstPoint(), this.getLastPoint());
	}
	
});