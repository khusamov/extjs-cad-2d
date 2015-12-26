
/* global Ext, Khusamov */

/**
 * @class
 * Класс для местоположения примитива.
 */

Ext.define("Khusamov.svg.geometry.tool.Position", {
	
	requires: ["Khusamov.svg.geometry.equation.Linear"],
	
	statics: {
		
		/**
		 * Получить местоположения пути относительно линии.
		 * @param {Khusamov.svg.geometry.Path} path
		 * @param {Khusamov.svg.geometry.equation.Linear} linear
		 * @param {Boolean} [checkIntersection = true] Если true, то пересечение проверяется и считается что его нет.
		 * @return {Number} -1 | 1 | 0 Если нуль, то есть пересечение.
		 */
		pathByLinear: function(path, linear, checkIntersection) {
			checkIntersection = (checkIntersection === undefined) ? true : checkIntersection;
			if (checkIntersection && path.intersection(linear)) return 0;
			return linear.distance(path.getFirstPoint()) < 0 ? -1: 1;
		},
		
		/**
		 * Проверка, находится ли точка между двумя прямыми линиями или нет.
		 * Прямые образуют два угла: тупой и острый. Если точка находится в тупом угле, 
		 * то считается что точка находится между прямыми линиями.
		 */
		isPointBetween: function(point, linear1, linear2) {
			// https://toster.ru/q/276033
			// http://goo.gl/5XULGX
			var x = point.x();
			var y = point.y();
			var a1 = linear1.a();
			var b1 = linear1.b();
			var c1 = linear1.c();
			var a2 = linear2.a();
			var b2 = linear2.b();
			var c2 = linear2.c();
			var sign1 = ((a1 * x + b1 * y + c1) * (a2 * x + b2 * y + c2)) < 0;
			var sign2 = (a1 * a2 + b1 * b2) < 0;
			return this.xor(sign1, sign2);
		},
		
		/**
		 * Поиск ближайшей точки.
		 * @param {Khusamov.svg.geometry.Point} point Опорная точка.
		 * @param {Khusamov.svg.geometry.Point[] | Khusamov.svg.geometry.Primitive} points 
		 * Массив точек, среди которых ищется ближайшая к опорной.
		 * Вместо массива точек можно указать формулу в виде прямой линии, отрезка, окружности или дуги.
		 * @return {Khusamov.svg.geometry.Point}
		 */
		findClosestPoint: function(point, points) {
			var me = this, result;
			var Linear = Khusamov.svg.geometry.equation.Linear;
			
			
			var results = [];
			
			
			if (!Ext.isArray(points)) {
				
				
				
				
				/*result = points[0];
				var minDistance = point.distance(result);
				for (var i = 1; i < points.length; i++) {
					var distance = point.distance(points[i]);
					if (distance < minDistance) {
						result = points[i];
						minDistance = distance;
					}
				}*/
			//} else {
				var inter;
				switch (points.type) {
					case "linear":
						// Возможно можно ускорить вычисление, см. http://goo.gl/23lJcs
						
						
						points = [points.intersection(Linear.createByNormal(points, point))];
						
						/*results.push({
							point: points.intersection(Linear.createByNormal(points, point))
						});*/
						break;
					case "line":
						var position = me.pointByEndLine(points, point);
						/*if (position == "between") {
							result = me.findClosestPoint(point, points.toLinear());
						} else {
							result = points["get" + Ext.String.capitalize(position) + "Point"].call(points);
						}*/
						
						/*results.push({
							point: (position == "between") ? 
								me.findClosestPoint(point, points.toLinear()) : 
								points["get" + Ext.String.capitalize(position) + "Point"].call(points)
						});*/
						
						
						points = [(position == "between") ? 
								me.findClosestPoint(point, points.toLinear()) : 
								points["get" + Ext.String.capitalize(position) + "Point"].call(points)];
						
						
						
						break;
					case "circular":
						points = points.intersection(Linear.createByLine(point, points.getCenter()));
						/*inter = points.intersection(Linear.createByLine(point, points.getCenter()));
						result = point.distance(inter[0]) < point.distance(inter[1]) ? inter[0] : inter[1];*/
						break;
					case "arc":
						var arc = points;
						points = [];
						inter = arc.intersection(Linear.createByLine(point, points.getCenter()));
						if (inter) points.push(inter[0]);
						points.push(points.getFirstPoint());
						points.push(points.getLastPoint());
						
						
						/*inter = points.intersection(Linear.createByLine(point, points.getCenter()));
						if (inter) results.push({
							point: inter[0],
							distance: point.distance(inter[0])
						});
						results.push({
							point: points.getFirstPoint(),
							distance: point.distance(points.getFirstPoint())
						});
						results.push({
							point: points.getLastPoint(),
							distance: point.distance(points.getLastPoint())
						});*/
						break;
					case "path":
						var path = points;
						points = [];
						path.eachEdge(function(edge) {
							me.findClosestPoint(point, edge.getPrimitive());
							//var closest = me.findClosestPoint(point, edge.getPrimitive());
							points.push(me.findClosestPoint(point, edge.getPrimitive()));
							/*results.push({
								point: closest,
								distance: point.distance(closest)
							});*/
						});
						break;
				}
			}
			
			Ext.Array.each(points, function(p) {
				results.push({
					point: p,
					distance: point.distance(p)
				});
			});
			
			
			result = results[0];
			for (var i = 0; i < results.length; i++) {
				result = result.distance > results[i].distance ? results[i] : result;
			}
			result = result.point;
			
			return result;
		},
		
		/**
		 * Определение на каком конце линии находится точка.
		 * Считается, что точка находится на прямой, проходящей через линию.
		 * @return {String} first | last | between
		 */
		pointByEndLine: function(line, point) {
			var name = line.toLinear().isVertical() ? "y" : "x";
			var c = point[name].call(point);
			var c1 = line.getFirstPoint();
			var c2 = line.getLastPoint();
			c1 = c1[name].call(c1);
			c2 = c2[name].call(c2);
			if (c1 < c2) {
				if (c < c1 && c < c2) return "first";
				if (c > c1 && c > c2) return "last";
			} else {
				if (c < c2 && c < c1) return "first";
				if (c > c2 && c > c1) return "last";
			}
			return "between";
		},
		
		/**
		 * Вспомогательная функция, 
		 * реализующая операцию XOR (исключающее ИЛИ).
		 * @private
		 */
		xor: function(a, b) {
			return a ? !b : b;
		}
		
	}
	
});