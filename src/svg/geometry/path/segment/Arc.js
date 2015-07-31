
/**
 * Внимание, дуга может работать пока только в режиме окружности (оба радиуса равны)!
 */

Ext.define("Khusamov.svg.geometry.path.segment.Arc", {
	
	extend: "Khusamov.svg.geometry.path.segment.Segment",
	
	requires: [
		"Khusamov.svg.geometry.equation.Circular", 
		"Khusamov.svg.geometry.Line",
		"Khusamov.svg.geometry.Angle"
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
		var radius = this.callParent();
		var isCircular = radius[0] == radius[1];
		index = isCircular ? 0 : index;
		return index !== undefined ? radius[index] : radius;
	},
	
	updateRotation: function() {
		this.onParamUpdate();
	},
	
	updateLarge: function() {
		this.onParamUpdate();
	},
	
	isLarge: function() {
		return this.getLarge();
	},
	
	isSweep: function() {
		return this.getSweep();
	},
	
	updateRadius: function() {
		this.onParamUpdate();
	},
	
	updateSweep: function() {
		this.onParamUpdate();
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
			)[this.isLarge() ? 1 : 0];
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
	
	/**
	 * На выходе NaN, если хорда больше двух радиусов.
	 */
	getAngle: function(unit) {
		// Теорема косинусов.
		var angle = Math.acos(1 - Math.pow(this.getChordLength(), 2) / (2 * Math.pow(this.getRadius(), 2)));
		if (!isNaN(angle)) {
			angle = this.isLarge() ? 2 * Math.PI - angle : angle;
			angle = Ext.create("Khusamov.svg.geometry.Angle", angle).get(unit);
		}
		return angle;
	},
	
	getLength: function() {
		var length = 0;
		if (this.isCircular()) {
			length = this.getRadius() * this.getAngle();
		}
		return length;
	},
	
	getChord: function() {
		return Ext.create("Khusamov.svg.geometry.Line", this.getFirstPoint().clone(), this.getLastPoint().clone());
	},
	
	getChordLength: function() {
		return this.getChord().getLength();
	},
	
	toString: function() {
		var me = this, result = "";
		if (me.hasPath()) {
			result = [];
			result.push(me.getLastPoint().isRelative() ? "a" : "A");
			
			result.push(me.getRadius(0));
			result.push(me.getRadius(1));
			result.push(me.getRotation());
			result.push(me.isLarge() ? 1 : 0);
			result.push(me.isSweep() ? 1 : 0);
			
			result.push(me.getLastPoint().toString());
			result = me.callParent([result.join(" ")]);
		}
		return result;

	}
	
});