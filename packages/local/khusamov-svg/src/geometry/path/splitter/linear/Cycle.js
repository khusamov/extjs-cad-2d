
/* global Ext */

/**
 * @class
 * 
 * Цикл это просто массив узлов вида "p<index>" или "i<index>", 
 * которые представляют из себя найденный многоугольник.
 * Здесь "p" это узел исходного многоугольника, 
 * а "i" это узел пересечения многоугольника и прямой-делителя.
 * 
 * Класс предоставляет средства хранения цикла 
 * и главное функцию преобразования цикла в путь.
 * 
 */

Ext.define("Khusamov.svg.geometry.path.splitter.linear.Cycle", {
	
	/**
	 * @param {String[]} Массив узлов цикла.
	 */
	constructor: function(cycle) {
		var me = this;
		
		/**
		 * Массив узлов цикла.
		 * @property {String[]}
		 */
		me.cycle = cycle;
	},
	
	/**
	 * Проверка наличия узла в цикле.
	 * @param {String} node
	 * @return {Boolean}
	 */
	contains: function(node) {
		return Ext.Array.contains(this.cycle, node);
	},
	
	type: function() {
		var c = this.cycle;
		return (c.length == 2 && c[0][0] == "i" && c[1][0] == "i") ? "Himself" : "Regular";
	},
	
	toPath: function() {
		return this["convert" + this.type() + "CycleToPath"].call(this);
	},
	
	convertHimselfCycleToPath: function() {
		var me = this;
		var subpath = Ext.create("Khusamov.svg.geometry.Path");
		
	},
	
	convertRegularCycleToPath: function() {
		var me = this;
		var subpath = Ext.create("Khusamov.svg.geometry.Path");
		
	},
	
	/**
	 * @private
	 * Конвертация цикла в Khusamov.svg.geometry.Path.
	 * @param {String[]} cycle
	 * @param {Khusamov.svg.geometry.Path} path Исходный многоугольник.
	 * @param {Khusamov.svg.geometry.Point[]} intersection
	 * @return {Khusamov.svg.geometry.Path}
	 */
	convertCycleToPath: function(path, intersection) {
		var me = this;
		var subpath = Ext.create("Khusamov.svg.geometry.Path");
		// Определяем тип цикла: обычный и петля (кусок дуги).
		if (me.cycle.length == 2 && me.cycle[0][0] == "i" && me.cycle[1][0] == "i") {
			// Петля.
			var nodeIndex0 = Number(me.cycle[0].substring(1));
			subpath.point(intersection[nodeIndex0]);
			
			var segmentIndex = intersection[nodeIndex0].segment.index;
			subpath.arc(path.getSegment(segmentIndex).getArc().clone());
			
			var nodeIndex1 = Number(me.cycle[1].substring(1));
			subpath.point(intersection[nodeIndex1]);
			
			subpath.line();
		} else {
			// Обычный цикл.
			me.cycle.forEach(function(node, index) {
				var nodeType = node[0], // p | i
					nodeIndex = Number(node.substring(1)), 
					isLastNode = (index == me.cycle.length - 1);
				
				var nextNode = me.cycle[isLastNode ? 0 : index + 1],
					nextNodeType = nextNode[0]; // p | i
				
				// Определяем точку пути.
				
				var point;
				switch (nodeType) {
					case "p": point = path.getPoint(nodeIndex); break;
					case "i": point = intersection[nodeIndex]; break;
					default: throw new Error("Узел неизвестного типа", nodeType, node);	
				}
				
				// TODO нужно сделать опцию clonedPoints чтобы управлять клонированием точек.
				// Ибо иногда клон нужен, а иногда не нужен.
				//point = point.clone();
					
				subpath.point(point);
				
				// Определяем сегмент пути.
				
				var segmentIndex;
				switch (nodeType + nextNodeType) { // Тип сегмента = pi | ii | ip | pp
					case "ii":
						subpath.line();
						break;
					default:
						switch (nodeType) {
							case "p": segmentIndex = nodeIndex; break;
							case "i": segmentIndex = intersection[nodeIndex].segment.index; break;
						}
						if (path.getSegment(segmentIndex).isArcSegment) {
							subpath.arc(path.getSegment(segmentIndex).getArc().clone());
						} else {
							subpath.line();
						}
						break;
				}
			});
		}
		return subpath;
	}
	
});