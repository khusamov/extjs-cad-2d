
/* global Ext */

/**
 * @class
 * Класс для местоположения примитива.
 */

Ext.define("Khusamov.svg.geometry.tool.Position", {
	
	requires: [],
	
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
		 * @param {Khusamov.svg.geometry.Point[]} points Массив точек, среди которых ищется ближайшая к опорной.
		 */
		findClosestPoint: function(point, points) {
			var result = points[0];
			var minDistance = point.distance(result);
			for (var i = 1; i < points.length; i++) {
				var distance = point.distance(points[i]);
				if (distance < minDistance) {
					result = points[i];
					minDistance = distance;
				}
			}
			return result;
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