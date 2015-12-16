
/* global Ext */

Ext.define("Khusamov.svg.geometry.path.splitter.linear.Graph", {
	
	requires: [
		"Khusamov.svg.discrete.graph.AdjacencyList",
		"Khusamov.svg.geometry.path.splitter.linear.CycleSet"
	],
	
	constructor: function(path, dividerSet) {
		var me = this;
		
		/**
		 * Исходный путь-многоугольник.
		 * @private
		 * @property {Khusamov.svg.geometry.Path}
		 */
		me.path = path;
		
		/**
		 * Коллекция делителей.
		 * @private
		 * @property {Khusamov.svg.geometry.path.splitter.linear.DividerSet}
		 */
		me.dividerSet = dividerSet;
		
		/**
		 * Граф.
		 * @private
		 * @property {Khusamov.svg.discrete.graph.AdjacencyList}
		 */
		me.graph = Ext.create("Khusamov.svg.discrete.graph.AdjacencyList", {
			directed: true
		});
		
		me.createIntersectNodes();
		me.createNodes();
	},
	
	/**
	 * Добавить в граф точки пересечений и соседние с ними точки.
	 * @private
	 * @return {String[]} visited Массив индексов сегментов, которые добавлены в граф на этом этапе.
	 */
	createIntersectNodes: function() {
		var me = this;
		
		// Массив индексов сегментов, которые будут добавлены в граф на этом этапе.
		var visited = []; 
		
		var intersection = me.dividerSet.intersection;
		
		intersection.forEach(function(point, index) {
			var segment = point.segment;
			visited.push(segment.index);
			
			var length = me.path.getSegment(segment.index).getLength();
			var distance = segment.distance;
			
			var last = me.path.getSegment(segment.index).isLast();
			
			var  p = "p" + segment.index, 
				np = "p" + (last ? 0 : (segment.index + 1)),
				 i = "i" + index, 
				ni = "i" + (index + 1);
			
			// Две точки пересечения на одном сегменте (himself=true).
			var himself = me.dividerSet.himself(index);
			
			if (index % 2 == 0) {
				me.graph.add(i, ni, intersection[index + 1].distance(point));
				me.graph.add(p, i, distance);
				if (himself) {
					//console.log("ОТРИЦАТЕЛЬНЫЙ ВЕС?", intersection[index + 1].segment.distance - distance);
					//graph.add(ni, i, intersection[index + 1].segment.distance - distance);
				} else {
					me.graph.add(np, i, length - distance);
				}
			} else {
				if (himself) {
					me.graph.add(i, np, length - distance);
				} else {
					me.graph.add(i, p, distance);
					me.graph.add(i, np, length - distance);
				}
			}
		});
	},
	
	/**
	 * Добавляем в граф остальные точки, пропуская сегменты из массива visited.
	 * @param {String[]} skipped Массив индексов сегментов, которые следует пропустить.
	 */
	createNodes: function(skipped) {
		var me = this;
		me.path.eachSegment(function(segment, index) {
			var last = segment.isLast();
			if (!Ext.Array.contains(skipped, index)) {
				var from = "p" + index, 
					to = "p" + (last ? 0 : (index + 1));
				// Направление добавляемого в граф ребра зависит от
				// местоположения точки относительно прямой.
				if (me.dividerSet.getSegmentLocation(index) > 0) {
					me.graph.add(from, to, segment.getLength());
				} else {
					me.graph.add(to, from, segment.getLength());
				}
			}
		});
	},
	
	/**
	 * @private
	 * Найти кратчайшие циклы (путь из вершины в себя) в графе.
	 * @param {Khusamov.svg.geometry.Path} path Исходный многоугольник.
	 * @param {Khusamov.svg.geometry.Point[]} intersection
	 * @param {Khusamov.svg.discrete.graph.AdjacencyList} graph
	 * @return {Khusamov.svg.geometry.path.splitter.linear.CycleSet}
	 */
	findCycles: function() {
		var me = this;
		var cycleSet = Ext.create("Khusamov.svg.geometry.path.splitter.linear.CycleSet");
		me.dividerSet.intersectionEach(function(point, index) {
			// Первый узел.
			var node = "p" + point.segment.index;
			if (!cycleSet.contains(node)) {
				cycleSet.add(me.graph.findBackPath(node));
			}
			// Второй узел.
			if (me.dividerSet.himself(index)) {
				if (index % 2 == 0) cycleSet.add(["i" + index, "i" + (index + 1)]);
			} else {
				var nextNode = "p" + (last ? 0 : (point.segment.index + 1));
				if (!cycleSet.contains(nextNode)) {
					var last = me.path.getSegment(point.segment.index).isLast();
					cycleSet.add(me.graph.findBackPath(nextNode).reverse());
				}
			}
		});
		
		
		
		
		
		/*var me = this, cycles = [];
		intersection.forEach(function(point, index) {
			var last = path.getSegment(point.segment.index).isLast();
			cycles = me.findCycle(graph, cycles, "p" + point.segment.index);
			if (me.dividerSet.himself(index)) {
				if (index % 2 == 0) cycles.push(["i" + index, "i" + (index + 1)]);
			} else {
				cycles = me.findCycle(graph, cycles, "p" + (last ? 0 : (point.segment.index + 1)), true);
			}
		});*/
		
		
		return cycleSet;
	}
	
	/**
	 * @private
	 * Найти цикл для конкретного узла графа.
	 */
	/*findCycle: function(graph, cycles, node, reverse) {
		// Проверяем, есть ли узел в массиве циклов.
		var cyclesContainsNode = false;
		cycles.forEach(function(cycle) {
			if (Ext.Array.contains(cycle, node)) {
				cyclesContainsNode = true;
				return false;
			}
		});
		// Если узла нет, то ищем цикл для него.
		if (!cyclesContainsNode) {
			var cycle = graph.findBackPath(node);
			cycles.push(reverse ? cycle.reverse() : cycle);
		}
		return cycles;
	}*/
	
});