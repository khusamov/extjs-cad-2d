
Ext.define("Khusamov.svg.geometry.path.segment.Line", {
	
	extend: "Khusamov.svg.geometry.path.segment.Segment",
	
	toString: function() {
		var me = this;
		var result = [];
		result.push(me.getLastPoint().isRelative() ? "l" : "L");
		result.push(me.getLastPoint().toString());
		return me.callParent([result.join(" ")]);
	}
	
});