
/**
 * Дуга на плоскости.
 */

Ext.define("Khusamov.svg.geometry.Arc", {
	
	extend: "Khusamov.svg.geometry.Primitive",
	
	requires: [
		
	],
	
	statics: {
		
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
	
	/**
	 * Ext.create("Khusamov.svg.geometry.Arc", x1, y1, x2, y2, radius);
	 * Ext.create("Khusamov.svg.geometry.Arc", Number[x1, y1], Number[x2, y2], radius);
	 * Ext.create("Khusamov.svg.geometry.Arc", Khusamov.svg.geometry.Point, Khusamov.svg.geometry.Point, radius);
	 */
	constructor: function(config) {
		var me = this;
		
		me.callParent([config]);
	},
	
	
	
});


