
/* global Ext, Khusamov */

/**
 * @class
 * Класс для расчета пересечения пути и прямой линии.
 */

// TODO Нет рассчета distance для сегментов типа Арка
// https://github.com/khusamov/extjs/issues/6

Ext.define("Khusamov.svg.geometry.intersection.PathLinear", {
	
	requires: [
		"Khusamov.svg.geometry.Line", 
		"Khusamov.svg.geometry.Point"
	],
	
	statics: {
		
		/**
		 * Найти точки пересечения пути с прямой линией.
		 * 
		 * @param {Khusamov.svg.geometry.Path} path Путь, с которым ищется пересечения.
		 * @param {Khusamov.svg.geometry.equation.Linear} linear Фигура, с которой ищется пересечения.
		 * @param {Object | Khusamov.svg.geometry.Point} [config] Дополнительные опции поиска пересечений или selPoint.
		 * @param {Khusamov.svg.geometry.Point} [config.selPoint] Выбрать один делитель по точке.
		 * @param {Boolean} [config.segmented] Если равен true, то на выходе будет массив точек с 
		 * 1) индексом сегмента,
		 * 2) координатой точки внутри сегмента (расстояние до точки от начала сегмента),
		 * 3) координатой точки внутри пути (расстояние до точки от начала пути).
		 * (Эта информация добавляется прямо в объект точки в свойство segment{index, distance, distanceByPath}).
		 * 
		 * @return {Khusamov.svg.geometry.Point[] | null}
		 */
		intersection: function(path, linear, config) {
			var me = this;
			var result = [], length = 0;
			
			var Point = Khusamov.svg.geometry.Point;
			config = config instanceof Point ? { selPoint: config } : (config || {});
			
			path.eachSegment(function(segment, index) {
				var intersection = segment.getPrimitive().intersection(linear);
				if (intersection) {
					result = result.concat(intersection);
					if (config.segmented) {
						me.addSegmentInfo(intersection, segment, index, length);
						length += segment.getLength();
					}
				}
			});
			
			if (result.length && config.selPoint) {
				result = me.selectDivider(result, config.selPoint);
			}
			
			return result.length ? result : null;
		},
		
		/**
		 * Удалить все делители кроме выбранного.
		 * Выбранный определяется точкой selPoint, которая находится на отрезке выбранного делителя.
		 * @private
		 * @param {Khusamov.svg.geometry.Point[]} intersection
		 * @param {Khusamov.svg.geometry.Point} selPoint
		 * @return {Khusamov.svg.geometry.Point[]} intersection
		 */
		selectDivider: function(intersection, selPoint) {
			var result = intersection, start;
			intersection.forEach(function(point, index) {
				if (index % 2 == 0) {
					start = point;
				} else {
					var divider = Ext.create("Khusamov.svg.geometry.Line", start, point);
					if (divider.contains(selPoint)) {
						result = [start, point];
					}
				}
			});
			return result;
		},
		
		/**
		 * Добавление в точки пересечений информации о сегменте.
		 */
		addSegmentInfo: function(intersection, segment, index, length) {
			intersection = Ext.isArray(intersection) ? intersection: [intersection];
			intersection.forEach(function(point) {
				
				var distance = segment.getFirstPoint().getDistanceTo(point);
				// TODO Нет рассчета distance для сегментов типа Арка
				// https://github.com/khusamov/extjs/issues/6
				
				point.segment = {
					index: index, // индексом сегмента
					distance: distance, // координатой точки внутри сегмента (расстояние до точки от начала сегмента)
					distanceByPath: length + distance // координатой точки внутри пути (расстояние до точки от начала пути)
				};
			});
		}
		
	}
	
});