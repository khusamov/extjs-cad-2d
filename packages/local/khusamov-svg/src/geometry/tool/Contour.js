
/* global Ext, Khusamov */

/**
 * @class
 * Класс для создания контура вокруг или внутри примитива.
 * Сейчас поддерживается только Путь.
 * В будущем будут поддерживаться: Окружность, Квадрат и т.п.
 */

Ext.define("Khusamov.svg.geometry.tool.Contour", {
	
	uses: ["Khusamov.svg.geometry.tool.Tool"],
	
	statics: {
		
		/**
		 * Получить внешний контур для примитива.
		 * Возвращает null, если контур невозможно построить (имеется разрыв).
		 * @param {Khusamov.svg.geometry.Path} path Исходный многоугольник.
		 * @param {Number | Number[]} offset Смещение или массив смещений для каждого ребра.
		 * @return {Khusamov.svg.geometry.Path | null}
		 */
		outside: function(path, offset) {
			return this.contour(path, "outside", offset);
		},
		
		/**
		 * Получить внутренний контур для примитива.
		 * Возвращает null, если контур невозможно построить (имеется разрыв).
		 * @param {Khusamov.svg.geometry.Path} path Исходный многоугольник.
		 * @param {Number | Number[]} offset Смещение или массив смещений для каждого ребра.
		 * @return {Khusamov.svg.geometry.Path | null}
		 */
		inside: function(path, offset) {
			return this.contour(path, "inside", offset);
		},
		
		/**
		 * Получить контур для примитива.
		 * Возвращает null, если контур невозможно построить (имеется разрыв).
		 * @param {Khusamov.svg.geometry.Path} path Исходный многоугольник.
		 * @param {String} type Тип контура inside | outside.
		 * @param {Number | Number[]} offset Смещение или массив смещений для каждого ребра.
		 * @return {Khusamov.svg.geometry.Path | null}
		 */
		contour: function(path, type, offset) {
			var me = this, result = Ext.create("Khusamov.svg.geometry.Path"), gap = false;
			var Tool = Khusamov.svg.geometry.Tool;
			offset = me.prepareOffset(path, offset);
			path.eachEdge(function(edge, index) {
				var edgeOffset = me.getOffset(offset[index], type, path, edge);
				var prevEdge = path.getPrevEdge(index);
				var prevEdgeOffset = me.getOffset(offset[(index == 0 ? offset.length : index) - 1], type, path, prevEdge);
				var prevCurve = me.getOffsetEqCurve(prevEdge, prevEdgeOffset);
				var curve = me.getOffsetEqCurve(edge, edgeOffset);
				var inter = curve.intersection(prevCurve);
				if (inter) {
					switch (prevEdge.type + edge.type) {
						case "lineline":
							result.point(inter).line();
							break;
						case "linearc":
						case "arcline":
						case "arcarc":
							inter = Tool.Position.findClosestPoint(edge.getPoint(), inter);
							result.point(inter);
							switch (edge.type) {
								case "arc": result.arc(me.getOffsetArc(edge.getArc(), edgeOffset)); break;
								case "line": result.line(); break;
							}
							break;
					}
				} else {
					gap = true;
				}
			});
			return gap ? null : me.correctLarge(result, path);
		},
		
		/**
		 * Вспомогательная функция.
		 * Подготовка массива смещений.
		 * @private
		 * @param {Khusamov.svg.geometry.Path} path Исходный многоугольник.
		 * @param {Number | Number[]} offset Смещение или массив смещений для каждого ребра.
		 * @return {Number[]}
		 */
		prepareOffset: function(path, offset) {
			if (!Ext.isArray(offset)) {
				var value = offset, count = path.getCount(); offset = [];
				for (var i = 0; i < count; i++) offset.push(value);
			}
			return offset;
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
				case "linear": result = curve.getParallelLinearByDestination(-offset); break;
				case "circular": result = curve.clone({ radius: curve.getRadius() + offset }); break;
			}
			return result;
		},
		
		/**
		 * Получить клон арки, с измененным радиусом.
		 * @private
		 * @param {Khusamov.svg.geometry.Arc} arc
		 * @param {Number} offset Смещение со знаком для данного ребра.
		 * @return {Khusamov.svg.geometry.Arc}
		 */
		getOffsetArc: function(arc, offset) {
			return arc.clone({ radius: arc.getRadius() + offset });
		},
		
		/**
		 * Корректировка всех ребер типа Дуга.
		 * @private
		 * @param {Khusamov.svg.geometry.Path} result Искомый многоугольник.
		 * @param {Khusamov.svg.geometry.Path} path Исходный многоугольник.
		 * @return {Khusamov.svg.geometry.Path}
		 */
		correctLarge: function(result, path) {
			result.eachEdge(function(edge, index) {
				if (edge.isArcEdge) {
					// К сожалению выбран не оптимальный способ, а именно сравнение чисел с плавающей точкой,
					// с точностью +- 1е-12. Поэтому в будущем неплохо было бы найти правильный способ.
					if (!edge.getArc().getCenter().equal(path.getEdge(index).getArc().getCenter(), 1e-12)) {
						edge.getArc().toggleLarge();
					}
				}
			});
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