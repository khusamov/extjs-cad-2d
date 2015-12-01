
/* global Ext */

/**
 * @class
 * Класс для расчета пересечения пути и прямой линии.
 */

// TODO Нет рассчета distance для сегментов типа Арка
// https://github.com/khusamov/extjs/issues/6

Ext.define("Khusamov.svg.geometry.intersection.PathLinear", {
	
	statics: {
		
		/**
		 * @param {Boolean} segmented Если равен true, то на выходе будет массив точек с 
		 * 1) индексом сегмента,
		 * 2) координатой точки внутри сегмента (расстояние до точки от начала сегмента),
		 * 3) координатой точки внутри пути (расстояние до точки от начала пути).
		 * (Эта информация добавляется прямо в объект точки в свойство segment{index, distance, distanceByPath}).
		 */
		intersection: function(path, linear, segmented) {
			var me = this;
			var result = [], length = 0;
			path.eachSegment(function(segment, index) {
				var intersection = segment.getPrimitive().intersection(linear);
				if (intersection) {
					result = result.concat(intersection);
					if (segmented) {
						me.addSegmentInfo(intersection, segment, index, length);
						length += segment.getLength();
					}
				}
			});
			return result.length ? result : null;
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