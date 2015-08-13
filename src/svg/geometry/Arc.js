
/**
 * Дуга на плоскости.
 * Внимание, дуга может работать пока только в режиме окружности (оба радиуса равны)!
 */

Ext.define("Khusamov.svg.geometry.Arc", {
	
	extend: "Khusamov.svg.geometry.Primitive",
	
	requires: [
		"Khusamov.svg.geometry.Point",
		"Khusamov.svg.geometry.equation.Circular",
		"Khusamov.svg.geometry.Line",
		"Khusamov.svg.geometry.Angle"
	],
	
	statics: {
		
		/**
		 * Вычисление высоты дуги.
		 * 1) по трем точкам: концы дуги и центр окружности.
		 * 2) по радиусу, хорде и индексу высоты.
		 * Khusamov.svg.geometry.Arc.height(point1, point2, pointCenter);
		 * Khusamov.svg.geometry.Arc.height(radius, chord, index);
		 */
		height: function(radius, chord, index) {
			var result = [];
			
			if (!Ext.isNumber(arguments[0])) {
				var point1 = Ext.create("Khusamov.svg.geometry.Point", arguments[0]);
				var point2 = Ext.create("Khusamov.svg.geometry.Point", arguments[1]);
				var center = arguments[2];
				radius = point1.distance(center);
				chord = point1.distance(point2);
				var distance = (center.x() - point1.x()) * (point2.y() - point1.y()) - 
				(center.y() - point1.y()) * (point2.x() - point1.x());
				index = distance > 0 ? 1 : 0;
			}
			
			// При пересечении двух хорд окружности, получаются отрезки, 
			// произведение длин которых у одной хорды равно соответствующему произведению у другой
			// https://ru.wikipedia.org/wiki/%D0%A5%D0%BE%D1%80%D0%B4%D0%B0_(%D0%B3%D0%B5%D0%BE%D0%BC%D0%B5%D1%82%D1%80%D0%B8%D1%8F)
			var dis = 4 * radius * radius - chord * chord;
			result[0] = radius - Math.sqrt(dis) / 2;
			result[1] = radius + Math.sqrt(dis) / 2;
			return result[index ? index : 0];
		},
		
		radius: function(height, len) {
			var radius = Infinity;
			if (height) {
				
				var sign = height >= 0 ? 1 : -1;
				height = Math.abs(height);
				// При пересечении двух хорд окружности, получаются отрезки, 
				// произведение длин которых у одной хорды равно соответствующему произведению у другой
				// https://ru.wikipedia.org/wiki/%D0%A5%D0%BE%D1%80%D0%B4%D0%B0_(%D0%B3%D0%B5%D0%BE%D0%BC%D0%B5%D1%82%D1%80%D0%B8%D1%8F)
				radius = height / 2 + len * len / (8 * height);
				radius *= sign;
			}
			return radius;
		},
		
	},
	
	isArc: true,
	
	type: "arc",
	
	config: {
		
		firstPoint: null,
		
		lastPoint: null,
		
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
	 * Ext.create("Khusamov.svg.geometry.Arc", point1, point2, radius);
	 * Ext.create("Khusamov.svg.geometry.Arc", point1, point2, radius, config);
	 * Ext.create("Khusamov.svg.geometry.Arc", config);
	 */
	constructor: function(config) {
		if (arguments.length > 1) {
			config = arguments[3] || {};
			config.firstPoint = arguments[0];
			config.lastPoint = arguments[1];
			config.radius = arguments[2];
		}
		this.callParent([config]);
	},
	
	onParamUpdate: function() {
		this.fireEvent("update");
	},
	
	applyFirstPoint: function(point) {
		return point ? (Ext.isArray(point) ? Ext.create("Khusamov.svg.geometry.Point", point) : point) : null;
	},
	
	updateFirstPoint: function(point, oldPoint) {
		this.onParamUpdate();
		if (oldPoint) oldPoint.un("update", "onParamUpdate", this);
		point.on("update", "onParamUpdate", this);
	},
	
	applyLastPoint: function(point) {
		return this.applyFirstPoint(point);
	},
	
	updateLastPoint: function(point, oldPoint) {
		this.updateFirstPoint(point, oldPoint);
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
	
	updateSweep: function() {
		this.onParamUpdate();
	},
	
	applyRadius: function(radius) {
		return Ext.isArray(radius) ? radius : [radius, radius];
	},
	
	getRadius: function(index) {
		var radius = this.callParent();
		var isCircular = radius[0] == radius[1];
		index = isCircular ? 0 : index;
		return index !== undefined ? radius[index] : radius;
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
	
	getChord: function() {
		return Ext.create("Khusamov.svg.geometry.Line", this.getFirstPoint().clone(), this.getLastPoint().clone());
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
	
	getChordLength: function() {
		return this.getChord().getLength();
	}
	
});


