
Ext.define("Khusamov.svg.geometry.path.segment.Arc", {
	
	extend: "Khusamov.svg.geometry.path.segment.Segment",
	
	config: {
		
		radius: [0, 0],
		
		xAxisRotation: 0,
		
		largeArcFlag: false,
		
		sweepFlag: false
		
	},
	
	constructor: function(point, radius, config) {
		var me = this;
		config = config || {};
		if (arguments.length == 1) config = point;
		if (arguments.length > 1) {
			config.point = point;
			config.radius = Ext.isNumber(radius) ? [radius, radius] : radius;
		}
		me.callParent([config]);
	},
	
	toString: function() {
		var me = this;
		var result = [];
		
		result.push(me.getLastPoint().isRelative() ? "a" : "A");
		
		result.push(me.getRadius()[0]);
		result.push(me.getRadius()[1]);
		result.push(me.getXAxisRotation());
		result.push(me.getLargeArcFlag() ? 1 : 0);
		result.push(me.getSweepFlag() ? 1 : 0);
		
		result.push(me.getLastPoint().toString());
		
		return me.callParent([result.join(" ")]);
	}
	
});