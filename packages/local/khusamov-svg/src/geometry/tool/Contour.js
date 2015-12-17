
/* global Ext, Khusamov */

/**
 * @class
 * Класс для создания контура вокруг или внутри примитива.
 * Сейчас поддерживается только Путь.
 * В будущем будут поддерживаться: Окружность, Квадрат и т.п.
 */

Ext.define("Khusamov.svg.geometry.tool.Contour", {
	
	requires: [
		"Khusamov.svg.geometry.tool.Position"
	],
	
	statics: {
		
		/**
		 * Получить внешний контур для примитива.
		 * @param {Khusamov.svg.geometry.Path} path Исходный многоугольник.
		 * @param {Number | Number[]} offset Смещение или массив смещений для каждого ребра.
		 * @return {Khusamov.svg.geometry.Path}
		 */
		outside: function(path, offset) {
			return this.contour(path, "outside", offset);
		},
		
		/**
		 * Получить внутренний контур для примитива.
		 * @param {Khusamov.svg.geometry.Path} path Исходный многоугольник.
		 * @param {Number | Number[]} offset Смещение или массив смещений для каждого ребра.
		 * @return {Khusamov.svg.geometry.Path}
		 */
		inside: function(path, offset) {
			return this.contour(path, "inside", offset);
		},
		
		/**
		 * Получить контур для примитива.
		 * @param {Khusamov.svg.geometry.Path} path Исходный многоугольник.
		 * @param {String} type Тип контура inside | outside.
		 * @param {Number | Number[]} offset Смещение или массив смещений для каждого ребра.
		 * @return {Khusamov.svg.geometry.Path}
		 */
		contour: function(path, type, offset) {
			var me = this, result = Ext.create("Khusamov.svg.geometry.Path");
			var PositionTool = Khusamov.svg.geometry.tool.Position;
			path.eachEdge(function(edge, index) {
				var edgeOffset = me.getOffset(offset[index], type, path, edge);
				var prevEdge = path.getPrevEdge(index);
				var prevEdgeOffset = me.getOffset(offset[(index == 0 ? offset.length : index) - 1], type, path, edge);
				var inter, curve, prevCurve, point;
				switch (prevEdge.type + edge.type) {
					case "lineline":
						prevCurve = me.getOffsetEqCurve(prevEdge, prevEdgeOffset);
						curve = me.getOffsetEqCurve(edge, edgeOffset);
						inter = curve.intersection(prevCurve);
						result.point(inter).line();
						break;
					case "linearc":
					case "arcline":
					case "arcarc":
						prevCurve = me.getOffsetEqCurve(prevEdge, prevEdgeOffset);
						curve = me.getOffsetEqCurve(edge, edgeOffset);
						inter = curve.intersection(prevCurve);
						point = PositionTool.findClosestPoint(edge.getPoint(), inter);
						result.point(point);
						switch (edge.type) {
							case "arc": result.arc(me.getOffsetArc(edge.getArc(), edgeOffset)); break;
							case "line": result.line(); break;
						}
						break;
				}
			});
			return result;
		},
		
		/**
		 * Получить значение смещения с правильным знаком для выбранного ребра.
		 * Знак зависит от направления многоугольника и типа ребра (линия или дуга).
		 * @private
		 * @param {Number} offset Модуль смещения.
		 * @param {String} type Тип контура inside | outside.
		 * @param {Khusamov.svg.geometry.Path} path Исходный многоугольник.
		 * @param {Khusamov.svg.geometry.path.segment.Segment} edge Ребро.
		 * @return {Khusamov.svg.geometry.Path}
		 */
		getOffset: function(offset, type, path, edge) {
			return this.getSignOffset(type, path, edge) * Math.abs(offset);
		},
		
		/**
		 * Получить знак смещения для выбранного ребра.
		 * Знак зависит от направления многоугольника и типа ребра (линия или дуга).
		 * @private
		 * @param {String} type Тип контура inside | outside.
		 * @param {Khusamov.svg.geometry.Path} path Исходный многоугольник.
		 * @param {Khusamov.svg.geometry.path.segment.Segment} edge Ребро.
		 * @return {Khusamov.svg.geometry.Path}
		 */
		getSignOffset: function(type, path, edge) {
			var positive = this.xor(type == "inside", path.isClockwise());
			positive = (edge.type == "arc") ? this.xor(positive, edge.getArc().isSweep()) : positive;
			return positive ? 1 : -1;
		},
		
		/**
		 * Получить смещенную линию для выбранного ребра.
		 * @private
		 * @param {Khusamov.svg.geometry.path.segment.Segment} edge Ребро.
		 * @param {Number} offset Смещение со знаком для данного ребра.
		 * @return {Khusamov.svg.geometry.equation.Linear | Khusamov.svg.geometry.equation.Circular}
		 */
		getOffsetEqCurve: function(edge, offset) {
			var result, curve = edge.getPrimitive()[{ arc: "toCircular", line: "toLinear" }[edge.type]].call(edge.getPrimitive());
			switch (curve.type) {
				case "linear": result = curve.getParallelLinearByDestination(offset); break;
				case "circular": result = curve.clone({ radius: curve.getRadius() + offset }); break;
			}
			return result;
		},
		
		/**
		 * Получить клон арки, с измененны радиусом.
		 * @private
		 * @param {Khusamov.svg.geometry.Arc} arc
		 * @param {Number} offset Смещение со знаком для данного ребра.
		 * @return {Khusamov.svg.geometry.Arc}
		 */
		getOffsetArc: function(arc, offset) {
			return arc.clone({ radius: arc.getRadius() + offset });
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