
/**
 * Внимание, дуга может работать пока только в режиме окружности (оба радиуса равны)!
 */

Ext.define("Khusamov.svg.geometry.path.segment.Arc", {
	
	extend: "Khusamov.svg.geometry.path.segment.Segment",
	
	requires: [
		
		"Khusamov.svg.geometry.Arc",
		
		/*"Khusamov.svg.geometry.equation.Circular", 
		"Khusamov.svg.geometry.Line",
		"Khusamov.svg.geometry.Angle"*/
	],
	
	config: {
		
		//radius: [0, 0],
		
		/**
		 * xAxisRotation
		 */
		//rotation: 0,
		
		/**
		 * largeArcFlag
		 */
		//large: false,
		
		/**
		 * sweepFlag
		 */
		//sweep: false,
		
		/**
		 * Khusamov.svg.geometry.Arc
		 */
		arc: null
		
	},
	
	/**
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
			/*if (!Ext.isEmpty(point)) config.point = point;
			if (!Ext.isEmpty(radius)) config.radius = radius;*/
			config.arc = {};
			if (!Ext.isEmpty(radius)) config.arc.radius = radius;
			if (!Ext.isEmpty(point)) config.point = point;
		}
		me.callParent([config]);
		me.initArcPoints();
	},
	
	applyArc: function(geometry) {
		if (!(geometry instanceof Khusamov.svg.geometry.Arc)) {
			geometry = Ext.create("Khusamov.svg.geometry.Arc", geometry);
		}
		return geometry;
	},
	
	updateArc: function(arc, oldArc) {
		this.onParamUpdate();
		if (oldArc) arc.un("update", "onParamUpdate", this);
		arc.on("update", "onParamUpdate", this);
	},
	
	initArcPoints: function() {
		if (this.getArc()) {
			this.getArc().setFirstPoint(this.getFirstPoint());
			if (this.getLastPoint()) this.getArc().setLastPoint(this.getLastPoint());
		}
	},
	
	updatePoint: function(point, oldPoint) {
		this.callParent(arguments);
		this.initArcPoints();
	},
	
	updatePath: function(path) {
		var me = this;
		
		["add", "splice", "clear", "changelastpoint", "turnout"]
			.forEach(function(eventName) {
				
				//http://javascript.ru/forum/extjs/57614-metod-tostring-v-polzovatelskom-komponente-i-problemy-s-nim.html
				path.on(eventName, function() {
					me.initArcPoints();
				});
				
			});
			
		me.initArcPoints();
	},
	
	
	
	
	
	
	
	/*applyRadius: function(radius) {
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
	
	updateSweep: function() {
		this.onParamUpdate();
	},
	
	isLarge: function() {
		return this.getLarge();
	},
	
	isSweep: function() {
		return this.getSweep();
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
	 *
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
	},*/
	
	toString: function() {
		var me = this, result = "";
		if (me.hasPath()) {
			result = [];
			var arc = me.getArc();
			var point = arc.getLastPoint();
			if (point) {
				result.push(point.isRelative() ? "a" : "A");
				
				result.push(arc.getRadius(0));
				result.push(arc.getRadius(1));
				result.push(arc.getRotation());
				result.push(arc.isLarge() ? 1 : 0);
				result.push(arc.isSweep() ? 1 : 0);
				
				result.push(point.toString());
				
				result = me.callParent([result.join(" ")]);
			}
		}
		return result;

	}
	
	/*toString: function() {
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

	}*/
	
});