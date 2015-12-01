
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
				
				
				
				//console.log("linear1.getAngle",linear.getAngle("degree", 0));
				
				
				
				linear = me.prepareSplitLinear(intersection);
				
				
				
				//var _int = []; intersection.forEach(function(i) {_int.push(i.toString(0));});
				//console.log("linear2.getAngle",linear.getAngle("degree", 0), _int);
				
				
				
				// 1) Создание графа из пути и линии-делителя.
				var graph = me.createGraph(path, linear, intersection);
				// 2) Ищем кратчайшие циклы (путь из вершины в себя) в графе.
				var cycles = me.findCycles(path, intersection, graph);
				// 3) Конвертация циклов в .svg.geometry.Path.
				cycles.forEach(function(cycle) {
					result.push(me.convertCycleToPath(cycle, path, intersection));
				});
			}
			return result.length ? result : null;
		},
		
		/**
		 * Создать клон прямой линии делителя на основе первой и последней точек пересечения,
		 * чтобы точно знать, что она направлена от первой точки пересечения.
		 * @param {Khusamov.svg.geometry.Point[]} intersection
		 * @return {Khusamov.svg.geometry.equation.Linear}
		 */
		prepareSplitLinear: function(intersection) {
			return Ext.create(
				"Khusamov.svg.geometry.Line", 
				intersection[0], 
				intersection[intersection.length - 1]
			).toLinear();
		},
		
		/**
		 * Проверка точки пересечения лежит ли парная ей точка на том же сегменте или нет.
		 * Иными словами проверка случая, когда один сегмент пересечен дважды.
		 */
		himself: function(intersection, index) {
			var segment1 = intersection[index].segment;
			var segment2 = intersection[index + (index % 2 == 0 ? +1 : -1)].segment;
			return segment1.index == segment2.index;
		},
		
		/**
		 * Создание графа.
		 */
		createGraph: function(path, linear, intersection) {
			var me = this;
			
			var graph = Ext.create("Khusamov.svg.discrete.graph.AdjacencyList", {
				directed: true
			});
			
			// Добавляем в граф точки пересечений и соседние с ними точки.
			
			var visited = []; // Массив индексов сегментов, которые будут добавлены в граф на этом этапе.
			
			intersection.forEach(function(point, index) {
				
				var segment = point.segment;
				visited.push(segment.index);
				
				var length = path.getSegment(segment.index).getLength();
				var distance = segment.distance;
				
				/*var segmentIndex = segment.index,
					nextSegmentIndex = last ? 0 : (segment.index + 1)*/
				
				var last = path.getSegment(segment.index).isLast();
				
				var p = "p" + segment.index,
					np = "p" + (last ? 0 : (segment.index + 1)),
					i = "i" + index,
					ni = "i" + (index + 1);
				
				
				// Две точки пересечения на одном сегменте (himself=true).
				//var himself = (segment.index == intersection[index + (index % 2 == 0 ? +1 : -1)].segment.index); 
				var himself = me.himself(intersection, index);
				
				
				
				
				if (index % 2 == 0) {
					graph.add(i, ni, intersection[index + 1].distance(point));
					graph.add(p, i, distance);
					if (himself) {
						//console.log("ОТРИЦАТЕЛЬНЫЙ ВЕС?", intersection[index + 1].segment.distance - distance);
						//graph.add(ni, i, intersection[index + 1].segment.distance - distance);
					} else {
						graph.add(np, i, length - distance);
					}
				} else {
					if (himself) {
						graph.add(i, np, length - distance);
					} else {
						graph.add(i, p, distance);
						graph.add(i, np, length - distance);
					}
				}
				
				
				
				
				/*if (index % 2 == 0) {
					graph.add("p" + segment.index, "i" + index, distance);
					graph.add("p" + (last ? 0 : (segment.index + 1)), "i" + index, length - distance);
					graph.add("i" + index, "i" + (index + 1), intersection[index + 1].distance(point));
				} else {
					graph.add("i" + index, "p" + segment.index, distance);
					graph.add("i" + index, "p" + (last ? 0 : (segment.index + 1)), length - distance);
				}*/
			});
				
				
			
			// Добавляем в граф остальные точки, пропуская сегменты из массива visited.
			
			
			
			console.groupCollapsed("Добавляем в граф остальные точки");
			console.log("==============", visited);
				
				
					
			var clockwize = path.isClockwiseDirection();
			path.eachSegment(function(segment, index) {
				var last = segment.isLast();
				if (!Ext.Array.contains(visited, index)) {
					var from = "p" + index, 
						to = "p" + (last ? 0 : (index + 1));
					// Направление добавляемого в граф ребра зависит от:
					// местоположения точки относительно прямой
					// и как был задан путь (по часовой стрелке или нет).
					
					var location = linear.distance(segment.getFirstPoint(), true);
					
					
					console.log("location", location);
					
					
					
					//if (linear.distance(segment.getFirstPoint(), true) > 0 ? !clockwize : clockwize) {
					if (me.xor(location > 0, clockwize)) {
						graph.add(from, to, segment.getLength());
						console.log("from, to", from, to);
					} else {
						graph.add(to, from, segment.getLength());
						console.log("to, from", to, from);
					}
				}
			});
			
			
			
			console.log("ГРАФЬЯ =============", graph.graph);
			console.groupEnd();
			
			
			
			return graph;
		},
		
		//
		// Появилась идея, что алгоритм можно сильно упростить, если вместо поиска кратчайших путей 
		// искать все циклы, полученного графа... 
		// итого задача = а) построить граф (причем неориентированный), б) найти все циклы... 
		// Если я правильно понял, что искомые многоугольники и есть циклы
		// http://neerc.ifmo.ru/wiki/ Использование обхода в глубину для поиска цикла в ориентированном графе
		//
		
		/**
		 * Найти кратчайшие циклы (путь из вершины в себя) в графе.
		 */
		findCycles: function(path, intersection, graph) {
			var me = this, cycles = [];
			intersection.forEach(function(point, index) {
				var last = path.getSegment(point.segment.index).isLast();
				cycles = me.findCycle(graph, cycles, "p" + point.segment.index);
				if (!me.himself(intersection, index)) {
					cycles = me.findCycle(graph, cycles, "p" + (last ? 0 : (point.segment.index + 1)), true);
				}
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
		},
		
		/**
		 * @private
		 * Вспомогательная функция XOR.
		 */
		xor: function(a, b) {
			return Boolean(a ? !b : b);
		}
		
	}
	
});