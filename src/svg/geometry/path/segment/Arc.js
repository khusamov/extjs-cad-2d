
Ext.define("Khusamov.svg.geometry.path.segment.Arc", {
	
	extend: "Khusamov.svg.geometry.path.segment.Segment",
	
	requires: [
		"Khusamov.svg.geometry.equation.Circular", 
		"Khusamov.svg.geometry.Line"
	],
	
	config: {
		
		radius: [0, 0],
		
		/**
		 * xAxisRotation
		 */
		rotation: 0,
		
		/**
		 * largeArcFlag
		 */
		large: false,
		
		/**
		 * sweepFlag
		 */
		sweep: false
		
	},
	
	/**
	 * Ext.create("Khusamov.svg.geometry.path.segment.Arc");
	 * Ext.create("Khusamov.svg.geometry.path.segment.Arc", point);
	 * Ext.create("Khusamov.svg.geometry.path.segment.Arc", point, radius);
	 * Ext.create("Khusamov.svg.geometry.path.segment.Arc", point, radius, config);
	 */
	constructor: function(point, radius, config) {
		var me = this;
		config = config || {};
		if (arguments.length == 1) config = point;
		if (arguments.length > 1) {
			if (point) config.point = point;
			config.radius = Ext.isNumber(radius) ? [radius, radius] : radius;
		}
		me.callParent([config]);
	},
	
	updateRadius: function() {
		this.onParamUpdate();
	},
	
	updateRotation: function() {
		this.onParamUpdate();
	},
	
	updateLarge: function() {
		this.onParamUpdate();
	},
	
	updateRadius: function() {
		this.onParamUpdate();
	},
	
	updateSweep: function() {
		this.onParamUpdate();
	},
	
	onParamUpdate: function() {
		var path = this.getPath();
		if (path) path.fireEvent("update");
	},
	
	getLength: function() {
		var length = 0;
		var radius = this.getRadius();
		if (radius[0] == radius[1]) radius = radius[0];
		if (Ext.isNumber(radius)) {
			var center = Khusamov.svg.geometry.equation.Circular.findCenter(this.getFirstPoint(), this.getLastPoint(), radius);
			var first = Ext.create("Khusamov.svg.geometry.Line", center, this.getFirstPoint()).toLinear();
			var last = Ext.create("Khusamov.svg.geometry.Line", center, this.getLastPoint()).toLinear();
			length = radius * first.angleTo(last);
		}
		return length;
	},
	
	toString: function() {
		var me = this;
		var result = [];
		
		result.push(me.getLastPoint().isRelative() ? "a" : "A");
		
		result.push(me.getRadius()[0]);
		result.push(me.getRadius()[1]);
		result.push(me.getRotation());
		result.push(me.getLarge() ? 1 : 0);
		result.push(me.getSweep() ? 1 : 0);
		
		result.push(me.getLastPoint().toString());
		
		return me.callParent([result.join(" ")]);
	}
	
});