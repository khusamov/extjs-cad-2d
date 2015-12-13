
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
		 * Проверка, находится ли точка между двумя прямыми линииями или нет.
		 */
		isPointBetween: function(point, linear1, linear2) {
			linear1 = linear1.isCodirectional(linear2) ? linear1 : linear1.getInverse();
			return linear1.distance(point) != linear2.distance(point);
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
		}
		
	}
	
});