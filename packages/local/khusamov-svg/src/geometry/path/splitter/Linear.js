
/* global Ext */

/**
 * Специальный класс для деления многоугольников 
 * (построенных при помощи объекта Путь) прямой линией.
 */

Ext.define("Khusamov.svg.geometry.path.splitter.Linear", {
	
	requires: [
		"Khusamov.svg.geometry.Line", 
		"Khusamov.svg.discrete.graph.AdjacencyList"
	],
	
	uses: ["Khusamov.svg.geometry.Path"],
	
	statics: {
		
		/**
		 * Разделить путь прямой линией.
		 * @param {Khusamov.svg.geometry.Path} path
		 * @param {Khusamov.svg.geometry.equation.Linear} linear
		 * @return {null | Khusamov.svg.geometry.Path[]}
		 */
		split: function(path, linear) {
			var me = this, result = [];
			var intersection = path.intersection(linear, true);
			if (intersection) {
				linear = me.prepareSplitLinear(intersection);
				var graph = me.createGraph(path, linear, intersection);
				
				// Ищем кратчайшие циклы (путь из вершины в себя) в графе.
				var cycles = me.findCycles(path, intersection, graph);
				
				// Конвертация циклов в Khusamov.svg.geometry.Path.
				cycles.forEach(function(cycle) {
					result.push(me.convertCycleToPath(cycle, path, intersection));
				});
			}
			return result.length ? result : null;
		},
		
		/**
		 * Создать копию прямой линии делителя (по сути клон линии-делителя) 
		 * на основе первой и последней точек пересечения,
		 * чтобы точно знать, что она направлена от первой точки пересечения.
		 */
		prepareSplitLinear: function(intersection) {
			return Ext.create(
				"Khusamov.svg.geometry.Line", 
				intersection[0], 
				intersection[intersection.length - 1]
			).toLinear();
		},
		
		/**
		 * Создание графа.
		 */
		createGraph: function(path, linear, intersection) {
			var graph = Ext.create("Khusamov.svg.discrete.graph.AdjacencyList", {
				directed: true
			});
			
			// Добавляем в граф точки на пересеченных гранях.
			var visited = [];
			intersection.forEach(function(point, index) {
				var segment = point.segment;
				var distance = segment.distance;
				visited.push(segment.index);
				
				var length = path.getSegment(segment.index).getLength();
				var last = path.getSegment(segment.index).isLast();
				
				if (index % 2 == 0) {
					graph.add("p" + segment.index, "i" + index, distance);
					graph.add("p" + (last ? 0 : (segment.index + 1)), "i" + index, length - distance);
					graph.add("i" + index, "i" + (index + 1), intersection[index + 1].distance(point));
				} else {
					graph.add("i" + index, "p" + segment.index, distance);
					graph.add("i" + index, "p" + (last ? 0 : (segment.index + 1)), length - distance);
				}
			});
			
			// Далее добавляем точки граней, где пересечений не было.
			path.eachSegment(function(segment, index) {
				var last = segment.isLast();
				if (!Ext.Array.contains(visited, index)) {
					var from = "p" + index, to = "p" + (last ? 0 : (index + 1)), length = segment.getLength();
					// Направление добавляемого в граф ребра зависит от местоположения точки относительно 
					// прямой и как был задан путь (по часовой стрелке или нет).
					var clockwize = path.isClockwiseDirection();
					if (linear.distance(segment.getFirstPoint(), true) > 0 ? !clockwize : clockwize) {
						graph.add(from, to, length);
					} else {
						graph.add(to, from, length);
					}
				}
			});
			
			return graph;
		},
		
		// Появилась идея, что алгоритм можно сильно упростить, если вместо поиска кратчайших путей 
		// искать все циклы, полученного графа... 
		// итого задача = а) построить граф (причем неориентированный), б) найти все циклы... 
		// Если я правильно понял, что искомые многоугольники и есть циклы
		// http://neerc.ifmo.ru/wiki/ Использование обхода в глубину для поиска цикла в ориентированном графе
			
		/**
		 * Найти кратчайшие циклы (путь из вершины в себя) в графе.
		 */
		findCycles: function(path, intersection, graph) {
			var me = this, cycles = [];
			intersection.forEach(function(point) {
				var last = path.getSegment(point.segment.index).isLast();
				cycles = me.findCycle(graph, cycles, "p" + point.segment.index);
				cycles = me.findCycle(graph, cycles, "p" + (last ? 0 : (point.segment.index + 1)), true);
			});
			return cycles;
		},
		
		/**
		 * Найти цикл для конкретного узла графа.
		 */
		findCycle: function(graph, cycles, node, reverse) {
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
		},
		
		/**
		 * Конвертация цикла в Khusamov.svg.geometry.Path.
		 */
		convertCycleToPath: function(cycle, path, intersection) {
			var subpath = Ext.create("Khusamov.svg.geometry.Path");
			cycle.forEach(function(node, index) {
				var nodeType = node[0], // p | i
					nodeIndex = node.substring(1), 
					isLastNode = (index == cycle.length - 1);
				
				var nextNode = cycle[isLastNode ? 0 : index + 1],
					nextNodeType = nextNode[0]; // p | i
				
				// Определяем точку пути.
				
				var point;
				switch (nodeType) {
					case "p": point = path.getPoint(nodeIndex); break;
					case "i": point = intersection[nodeIndex]; break;
					default: throw new Error("Узел неизвестного типа", node[0], node);	
				}
				point = point.clone();
				
				subpath.point(point);
				
				// Определяем сегмент пути.
				
				var cycleSegmentType = nodeType + nextNodeType; // pi | ii | ip | pp
				if (cycleSegmentType == "ii") {
					subpath.line();
				} else {
					var segmentIndex;
					switch (nodeType) {
						case "p": segmentIndex = nodeIndex; break;
						case "i": segmentIndex = intersection[nodeIndex].segment.index; break;
					}
					
					if (path.getSegment(segmentIndex).isArcSegment) {
						subpath.arc(path.getSegment(segmentIndex).getArc().clone());
					} else {
						subpath.line();
					}
				}	
			});
			return subpath;
		}
		
	}
	
});