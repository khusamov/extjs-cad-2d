
/**
 * Внимание, дуга может работать пока только в режиме окружности (оба радиуса равны)!
 */

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
	 * Внимание, есть возможность point не задавать, для этого нужно вызывать конструктор так:
	 * Ext.create("Khusamov.svg.geometry.path.segment.Arc", null, radius);
	 * Ext.create("Khusamov.svg.geometry.path.segment.Arc", null, radius, config);
	 */
	constructor: function(point, radius, config) {
		var me = this;
		config = config || {};
		if (arguments.length == 1) config = point;
		if (arguments.length > 1) {
			if (!Ext.isEmpty(point)) config.point = point;
			if (!Ext.isEmpty(radius)) config.radius = radius;
		}
		me.callParent([config]);
	},
	
	applyRadius: function(radius) {
		return Ext.isArray(radius) ? radius : [radius, radius];
	},
	
	updateRadius: function() {
		this.onParamUpdate();
	},
	
	getRadius: function(index) {
		index = this.isCircular() ? 0 : index;
		return index ? this.callParent()[index] : this.callParent();
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
	
	isCircular: function() {
		return this.getRadius(0) == this.getRadius(1);
	},
	
	isElliptical: function() {
		return !this.isCircular();
	},
	
	getCenter: function(index) {
		if (this.isCircular()) {
			return Khusamov.svg.geometry.equation.Circular.findCenter(
				this.getFirstPoint(), 
				this.getLastPoint(), 
				this.getRadius()
			);
		}
	},
	
	getFirstRadiusLinear: function() {
		if (this.isCircular()) {
			return Ext.create("Khusamov.svg.geometry.Line", this.getCenter(), this.getFirstPoint()).toLinear();
		}
	},
	
	getLastRadiusLinear: function() {
		if (this.isCircular()) {
			return Ext.create("Khusamov.svg.geometry.Line", this.getCenter(), this.getLastPoint()).toLinear();
		}
	},
	
	getAngle: function() {
		var first = this.getFirstRadiusLinear();
		var last = this.getLastRadiusLinear();
		return Math[this.getLarge() ? "max" : "min"].call(Math, first.angleTo(last), last.angleTo(first));
	},
	
	getLength: function() {
		var length = 0;
		if (this.isCircular()) {
			length = this.getRadius() * this.getAngle();
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