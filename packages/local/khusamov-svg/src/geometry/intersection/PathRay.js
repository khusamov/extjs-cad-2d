
/* global Ext, Khusamov */

/**
 * @class
 * Класс для расчета пересечения пути и луча.
 */

Ext.define("Khusamov.svg.geometry.intersection.PathRay", {
	
	requires: ["Khusamov.svg.geometry.intersection.PathLinear"],
	
	statics: {
		
		/**
		 * Найти точки пересечения пути с лучем.
		 * @param {Khusamov.svg.geometry.Path} path Путь, с которым ищется пересечения.
		 * @param {Khusamov.svg.geometry.equation.Ray} ray Фигура, с которой ищется пересечения.
		 * @param {Object | Khusamov.svg.geometry.Point} [config] Дополнительные опции поиска пересечений или selPoint.
		 * @param {Khusamov.svg.geometry.Point} [config.selPoint] Выбрать один делитель по точке.
		 * @param {Boolean} [config.segmented] Если равен true, то на выходе будет массив точек с 
		 * 1) индексом сегмента,
		 * 2) координатой точки внутри сегмента (расстояние до точки от начала сегмента),
		 * 3) координатой точки внутри пути (расстояние до точки от начала пути).
		 * (Эта информация добавляется прямо в объект точки в свойство segment{index, distance, distanceByPath}).
		 * @return {Khusamov.svg.geometry.Point[] | null}
		 */
		intersection: function(path, ray, config) {
			var result = [];
			var intersectionLinear = Khusamov.svg.geometry.intersection.PathLinear.intersection(path, ray, config);
			if (intersectionLinear) {
				intersectionLinear.forEach(function(point) {
					if (ray.contains(point)) result.push(point);
				});
			}
			return result.length ? result : null;
		}
		
	}
	
});