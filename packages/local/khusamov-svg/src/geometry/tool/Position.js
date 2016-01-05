
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
			var me = this, results = [], result;
			var Linear = Khusamov.svg.geometry.equation.Linear;
			if (!Ext.isArray(points)) {
				switch (points.type) {
					case "linear":
						// Возможно можно ускорить вычисление, см. http://goo.gl/23lJcs
						points = [points.intersection(Linear.createByParallel(points.getNormal(), point))];
						break;
					case "line":
						var line = points;
						points = [me.findClosestPoint(point, points.toLinear())];
						var position = me.pointByEndLine(line, points[0]);
						points = [(position == "between") ? 
							points[0] : points["get" + Ext.String.capitalize(position) + "Point"].call(points)];
						break;
					case "circular":
						points = points.intersection(Linear.createByLine(point, points.getCenter()));
						break;
					case "arc":
						var arc = points;
						points = [];
						var inter = arc.intersection(Linear.createByLine(point, points.getCenter()));
						if (inter) points.push(inter[0]);
						points.push(points.getFirstPoint());
						points.push(points.getLastPoint());
						break;
					case "path":
						var path = points;
						points = [];
						path.eachEdge(function(edge) {
							points.push(me.findClosestPoint(point, edge.getPrimitive()));
						});
						break;
				}
			}
			
			// Вычисления расстояний от опорной точки до всех точек.
			points.forEach(function(p) {
				results.push({
					point: p,
					distance: point.distance(p)
				});
			});
			
			// Поиск минимального расстояния.
			results.sort(function(a, b) {
				if (a.distance < b.distance) return -1;
				if (a.distance > b.distance) return 1;
				return 0;
			});
			result = results[0].point;
			
			return result;
		},
		
		/**
		 * Определение на каком конце линии находится точка.
		 * Считается, что точка находится на прямой, проходящей через линию.
		 * Если точка совпадает с концом, то считается between.
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