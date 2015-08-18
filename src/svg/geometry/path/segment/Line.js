
Ext.define("Khusamov.svg.geometry.path.segment.Line", {
	
	extend: "Khusamov.svg.geometry.path.segment.Segment",
	
	requires: ["Khusamov.svg.geometry.Line"],
	
	isLineSegment: true,
	
	getPrimitive: function() {
		return this.getLine();
	},
	
	getLine: function() {
		return Ext.create("Khusamov.svg.geometry.Line", this.getFirstPoint(), this.getLastPoint());
	},
	
	getLength: function() {
		return this.getLine().getLength();
	},
	
	toString: function() {
		var me = this, result = "";
		if (me.hasPath()) {
			
			
			var point = me.getLastPoint();
			if (point) {
				result = [];
				result.push(me.getLastPoint().isRelative() ? "l" : "L");
				result.push(me.getLastPoint().toString());
				result = me.callParent([result.join(" ")]);
			}
			

		}
		return result;
	}
	
});