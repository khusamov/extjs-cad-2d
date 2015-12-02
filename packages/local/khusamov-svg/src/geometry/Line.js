
/**
 * Линия на плоскости.
 */

Ext.define("Khusamov.svg.geometry.Line", {
	
	extend: "Khusamov.svg.geometry.Polyline",
	
	requires: [
		"Khusamov.svg.geometry.Point", 
		"Khusamov.svg.geometry.equation.Linear"
		
	],
	
	uses: ["Khusamov.svg.geometry.equation.Circular"],
	
	isLine: true,
	
	type: "line",
	
	/**
	 * Ext.create("Khusamov.svg.geometry.Line", x1, y1, x2, y2);
	 * Ext.create("Khusamov.svg.geometry.Line", [x1, y1], [x2, y2]);
	 * Ext.create("Khusamov.svg.geometry.Line", Khusamov.svg.geometry.Point, Khusamov.svg.geometry.Point);
	 * Ext.create("Khusamov.svg.geometry.Line", Khusamov.svg.geometry.Point[]);
	 * Ext.create("Khusamov.svg.geometry.Line", Khusamov.svg.geometry.vector.Vector, Khusamov.svg.geometry.vector.Vector);
	 * Ext.create("Khusamov.svg.geometry.Line", Khusamov.svg.geometry.vector.Vector[]);
	 */
	constructor: function(config) {
		var me = this, args = arguments;
		if (args.length == 4) config = [[args[0], args[1]], [args[2], args[3]]];
		if (args.length == 2) config = [args[0], args[1]];
		me.callParent([config]);
	},
	
	/**
	 * Получить линию, равную по длине, паралельную исходной, 
	 * перпендикулярно отложенной, находящейся на определенной дистанции.
	 * @return {Khusamov.svg.geometry.Line}
	 */
	getParallelByDestination: function(destination) {
		var me = this;
		var parallelLinear = me.getParallelLinearByDestination(destination);
		var first = parallelLinear.intersection(me.getFirstNormalLinear());
		var last = parallelLinear.intersection(me.getLastNormalLinear());
		return Ext.create("Khusamov.svg.geometry.Line", first, last);
	},
	
	/**
	 * Получить уравнение прямой, паралельную исходной линии, 
	 * находящейся на определенной дистанции.
	 * @return {Khusamov.svg.geometry.equation.Linear}
	 */
	getParallelLinearByDestination: function(destination) {
		return this.toLinear().getParallelLinearByDestination(destination);
	},
	
	/**
	 * Получить уравнение прямой, перпендикулярной исходной линии, 
	 * проходящей через первую ее точку.
	 * @return {Khusamov.svg.geometry.equation.Linear}
	 */
	getFirstNormalLinear: function() {
		return this.toLinear().getNormalLinear(this.getFirstPoint());
	},
	
	/**
	 * Получить уравнение прямой, перпендикулярной исходной линии, 
	 * проходящей через последнюю ее точку.
	 * @return {Khusamov.svg.geometry.equation.Linear}
	 */
	getLastNormalLinear: function() {
		return this.toLinear().getNormalLinear(this.getLastPoint());
	},
	
	getMiddleNormalLinear: function() {
		return this.toLinear().getNormalLinear(this.getMiddlePoint());
	},
	
	/**
	 * Получить линию в виде уравнения прямой.
	 * @return {Khusamov.svg.geometry.equation.Linear}
	 */
	toLinear: function() {
		return Khusamov.svg.geometry.equation.Linear.createByLine(this);
	},
	
	getAngle: function(unit) {
		return this.toLinear().getAngle(unit);
	},
	
	intersection: function(primitive) {
		return this["intersectionWith" + Ext.String.capitalize(primitive.type)].call(this, primitive);
	},
	
	/**
	 * Пересечение двух отрезков.
	 */
	intersectionWithLine: function(line) {
		var intersection = this.intersectionWithLinear(line.toLinear());
		if (intersection) {
			intersection = line.isInnerPoint(intersection) ? intersection : null;
		}
		return intersection;
	},
	
	/**
	 * Пересечение отрезка и прямой линии.
	 */
	intersectionWithLinear: function(linear) {
		var intersection = this.toLinear().intersection(linear);
		if (intersection) {
			intersection = this.isInnerPoint(intersection) ? intersection : null;
		}
		return intersection;
	},
	
	/**
	 * Определение принадлежности точки отрезку.
	 * При условии, что заранее известно, что точка находится на прямой, проходящей через отрезок.
	 * Это условие означает, что производится проверка нахождения точки в пределах отрезка на прямой.
	 */
	isInnerPoint: function(point) {
		var first = this.getFirstPoint();
		var last = this.getLastPoint();
		return (Math.min(first.x(), last.x()) <= point.x() && 
			point.x() <= Math.max(first.x(), last.x()) &&
			Math.min(first.y(), last.y()) <= point.y() && 
			point.y() <= Math.max(first.y(), last.y()));
	},
	
	contains: function(point) {
		return this.isInnerPoint(point);
	},
	
	/**
	 * Получить координаты точки, находящейся на отрезке 
	 * на расстоянии от первой точки отрезка.
	 */
	getInnerPoint: function(x) {
		var me = this;
		var result = null;
		var circle = Ext.create("Khusamov.svg.geometry.equation.Circular", me.getFirstPoint(), x);
		var intersection = circle.intersection(me);
		intersection.forEach(function(point) {
			if (me.isInnerPoint(point)) result = point;
		});
		return result;
	}
	
});


