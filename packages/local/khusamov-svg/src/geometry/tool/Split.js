
/* global Ext, Khusamov */

/**
 * @class
 * Класс для деления примитивов.
 */

Ext.define("Khusamov.svg.geometry.tool.Split", {
	
	requires: [
		"Khusamov.svg.geometry.Path",
		"Khusamov.svg.geometry.tool.Position"
	],
	
	statics: {
		
		/**
		 * Разделить многоугольник двумя паралельными линиями.
		 * На выходе получить многоугольник, который между этими линиями.
		 * Внимание, многоугольник должен быть замкнутым.
		 * Искомый многоугольник независим от исходного, иными словами точки клонируются (то есть общих точек нет).
		 * @param {Khusamov.svg.geometry.Path}
		 * @param {Khusamov.svg.geometry.equation.Linear} linear1
		 * @param {Khusamov.svg.geometry.equation.Linear} linear2
		 * @return {Khusamov.svg.geometry.Path}
		 */
		pathWithTwoLinear: function(path, linear1, linear2) {
			var result = null;
			var PositionTool = Khusamov.svg.geometry.tool.Position;
			// Получаем все точки пересечения линий с многоугольником.
			var c = { segmented: true };
			var intersection = (path.intersection(linear1, c) || []).concat(path.intersection(linear2, c) || []);
			// Проверяем, есть ли точки пересечения.
			if (intersection.length) {
				// Ситуация многоугольник пересекает линии.
				// Сохраняем расстояния от начала многоугольника до точек пересечения в __distance.
				// Здесь __distance это временная переменная внутри объекта точки.
				intersection.forEach(function(point) {
					point.__distance = point.segment.distanceByPath;
					point.__index = null;
				});
				// Добавляем к точкам пересечений точки, которые находятся между линиями.
				// Также сохраняем расстояния от начала многоугольника и его индекс.
				path.eachPoint(function(point, index) {
					if (PositionTool.isPointBetween(point, linear1, linear2)) {
						intersection.push(point);
						point.__distance = path.getPointDistance(index);
						point.__index = index;
					}
				});
				// Сортируем найденные точки.
				intersection.sort(function(a, b) {
					return a.__distance < b.__distance ? -1 : 1;
				});
				// Строим искомый многоугольник.
				result = Ext.create("Khusamov.svg.geometry.Path");
				intersection.forEach(function(point, index) {
					var pointIndex = point.__index;
					var pointType = pointIndex === null ? "i" : "p";
					var nextPoint = intersection[index == intersection.length - 1 ? 0 : index];
					var nextPointIndex = nextPoint.__index;
					var nextPointType = nextPointIndex === null ? "i" : "p";
					var edge;
					switch (pointType + nextPointType) {
						case "ii": edge = { type: "line" }; break;
						case "ip": edge = path.getPrevEdge(nextPointIndex); break;
						case "pp": case "pi": edge = path.getEdge(pointIndex); break;
					}
					// Добавляем точку и ребро.
					result.point(point.clone());
					switch (edge.type) {
						case "line": result.line(); break;
						case "arc": result.arc(edge.getArc()); break;
					}
				});
			} else {
				// Ситуация многоугольник не пересекает линии.
				// Если многоугольник между линиями, то возвращаем исходный путь, иначе — null.
				var position1 = PositionTool.pathByLinear(path, linear1, false);
				var position2 = PositionTool.pathByLinear(path, linear2, false);
				result = position1 == position2 ? null : path;
			}
			return result;
		}
		
	}
	
});