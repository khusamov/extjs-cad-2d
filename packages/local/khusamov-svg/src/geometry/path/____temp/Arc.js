
Ext.define("Khusamov.svg.geometry.path.Arc", {
	
	extend: "Khusamov.svg.geometry.path.Command",
	
	alias: "khusamov.svg.geometry.path.command.arc",
	
	requires: ["Khusamov.svg.geometry.Point"],
	
	letter: "A",
	
	config: {
		
		point: [0, 0],
		
		radius: [0, 0],
		
		xAxisRotation: 0,
		
		largeArcFlag: false,
		
		sweepFlag: false
		
	},
	
	constructor: function(point, radius, config) {
		var me = this;
		config = config || {};
		
		if (arguments.length == 1) {
			config = point;
			var parameters = config.parameters;
			config.point = [parameters[5], parameters[6]];
			config.radius = [parameters[0], parameters[1]];
			config.xAxisRotation = parameters[2];
			config.largeArcFlag = !!parameters[3];
			config.sweepFlag = !!parameters[4];
		}
		
		if (arguments.length > 1) {
			config.point = point;
			config.radius = radius;
		}
		
		me.callParent([config]);
	},
	
	updateXAxisRotation: function(angle) {
		this.setParameter(2, angle);
	},
	
	updateLargeArcFlag: function(flag) {
		this.setParameter(3, flag ? 1 : 0);
	},
	
	updateSweepFlag: function(flag) {
		this.setParameter(4, flag ? 1 : 0);
	},
	
	applyPoint: function(point) {
		return Ext.isArray(point) ? Ext.create("Khusamov.svg.geometry.Point", point) : point;
	},
	
	updatePoint: function(point) {
		this.setParameter(5, point.x());
		this.setParameter(6, point.y());
	},
	
	applyRadius: function(radius) {
		radius = Ext.isNumeric(radius) ? [radius, radius] : radius;
		return Ext.isArray(radius) ? Ext.create("Khusamov.svg.geometry.Point", radius) : radius;
	},
	
	updateRadius: function(radius) {
		this.setParameter(0, radius.x());
		this.setParameter(1, radius.y());
	},
	
	toObject: function() {
		var me = this;
		return Ext.Object.merge(me.callParent(), {
			point: me.getPoint().toArray()
		});
	},
	
});