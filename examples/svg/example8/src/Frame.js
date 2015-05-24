
/**
 * Рама окна.
 */

Ext.define("Example.Frame", {
	extend: "Khusamov.svg.desktop.surface.Piece",
	
	requires: ["Example.Beam"],
	
	points: [],
	
	setPoints: function(points) {
		var me = this;
		me.points = points;
		me.initFrame();
		return me;
	},
	
	initFrame: function() {
		var me = this;
		
		// Создаем балки в цикле
		Ext.Array.each(me.points, function(point, index) {
			var beam = Ext.create("Example.Beam", {
				index: index,
				frame: me,
				profileHeight: 40
			});
			me.add(beam);
		});
		
		me.fireEvent("ready");
	},
	
	getPoint: function(index) {
		var me = this;
		return me.points[index];
	},
	
	setPoint: function(index, point) {
		var me = this;
		me.points[index] = point;
		me.repaint();
		return me;
	},
	
	setNextPoint: function(index, point) {
		var me = this;
		index = me.isLastPoint(index) ? 0 : index + 1
		return me.setPoint(index, point);
	},
	
	repaint: function() {
		var me = this;
		
		
		/*me.items.each(function(beam) {
			
			
			beam.baseLine = null;
			beam.secondLine= null;
		});*/
		
		
		me.items.each(function(beam) {
			beam.repaint();
		});
	},
	
	isFirstPoint: function(index) {
		var me = this;
		return index == 0;
	},
	
	isLastPoint: function(index) {
		var me = this;
		return index == me.points.length - 1;
	},
	
	getNextPoint: function(index) {
		var me = this;
		var result = me.getPoint(index + 1);
		if (me.isLastPoint(index)) result = me.getPoint(0);
		return result;
	},
	
	getNextBeam: function(index) {
		var me = this;
		var result = me.items.get(index + 1);
		if (me.isLastPoint(index)) result = me.items.get(0);
		return result;
	},
	
	getPrevBeam: function(index) {
		var me = this;
		var result = me.items.get(index - 1);
		if (me.isFirstPoint(index)) result = me.items.get(me.points.length - 1);
		return result;
	},
	
	
	
	contour: function(polygon, h) {
	
		// TODO эту функцию надо перенести в Геометрию
		
		// Расчет внутреннего полигона на расстоянии h
		
		// Собираем стороны полигона
		
		var sides = [];
		
		polygon.eachPoint(function(point1, index) {
			var point2 = polygon.getPoint(index + 1);
			if (index + 1 == polygon.countPoints()) {
				point2 = polygon.getPoint(0);
			}
			sides.push({
				points: [point1, point2]
			});
		});
		
		// Для каждой стороны расчитываем уравнение параллельной к ней прямой
		
		Ext.Array.each(sides, function(side) {
			var x1 = side.points[0][0];
			var y1 = side.points[0][1];
			var x2 = side.points[1][0];
			var y2 = side.points[1][1];
			
			var a = y1 - y2;
			var b = x2 - x1;
			var c1 = x1 * y2 - x2 * y1;
			var c2 = h * Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)) - c1;
			
			side.a = a;
			side.b = b;
			//side.c1 = c1; // потом удалить за ненадобностью
			side.c2 = c2;
		});
		
		// Для каждой точки рассчитываем пересечение
		
		var intersections = [];
		
		for (var index = 0; index < sides.length; index++) {
			var side1 = sides[index - 1];
			if (index == 0) {
				side1 = sides[sides.length - 1];
			}
			var side2 = sides[index];
			intersections.push({
				side1: side1, 
				side2: side2
			});
		}
		
		var result = [];
		
		Ext.Array.each(intersections, function(intersection) {
			var a1 = intersection.side1.a;
			var b1 = intersection.side1.b;
			var c1 = intersection.side1.c2;
			
			var a2 = intersection.side2.a;
			var b2 = intersection.side2.b;
			var c2 = intersection.side2.c2;
			
			var x = (c1 * b2 - c2 * b1) / (a1 * b2 - a2 * b1);
			var y = (a1 * c2 - a2 * c1) / (a1 * b2 - a2 * b1);
			
			result.push([x, y]);
		});
		
		return result;
	}
	
});


