
/* global Ext */

/**
 * Специальный класс для деления многоугольников 
 * (построенных при помощи объекта Путь) прямой линией.
 * 
 * Ограничения:
 * 1) Многоугольник не должен иметь пересещающиеся между собой грани.
 * 
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
				if (me.himself(intersection, index)) {
					if (index % 2 == 0) cycles.push(["i" + index, "i" + (index + 1)]);
				} else {
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
			//var me = this;
			var subpath = Ext.create("Khusamov.svg.geometry.Path");
			
			//console.log("CYCLE", cycle);
			
			
			// Определяем тип цикла: обычный и петля (кусок дуги).
			
			if (cycle.length == 2 && cycle[0][0] == "i" && cycle[1][0] == "i") {
				// Петля.
				
				//console.log("ПЕТЛЯ");
				
				var nodeIndex0 = Number(cycle[0].substring(1));
				subpath.point(intersection[nodeIndex0]);
				
				var segmentIndex = intersection[nodeIndex0].segment.index;
				subpath.arc(path.getSegment(segmentIndex).getArc().clone());
				
				var nodeIndex1 = Number(cycle[1].substring(1));
				subpath.point(intersection[nodeIndex1]);
				
				subpath.line();
				
			} else {
				// Обычный цикл.
				
				cycle.forEach(function(node, index) {
					var nodeType = node[0], // p | i
						nodeIndex = Number(node.substring(1)), 
						isLastNode = (index == cycle.length - 1);
					
					var nextNode = cycle[isLastNode ? 0 : index + 1],
						nextNodeType = nextNode[0]; // p | i
					
					// Определяем точку пути.
					
					
					//console.log(nodeType, nodeIndex);
					
					var point;
					switch (nodeType) {
						case "p": point = path.getPoint(nodeIndex); break;
						case "i": point = intersection[nodeIndex]; break;
						default: throw new Error("Узел неизвестного типа", nodeType, node);	
					}
					point = point.clone();
					
					subpath.point(point);
					
					// Определяем сегмент пути.
					
					var segmentIndex;
					
					
					switch (nodeType + nextNodeType) { // Тип сегмента = pi | ii | ip | pp
						case "ii":
							subpath.line();
							//console.log(intersection, nodeIndex);
							
							/*if (me.himself(intersection, nodeIndex)) {
								segmentIndex = intersection[nodeIndex].segment.index;
								subpath.arc(path.getSegment(segmentIndex).getArc().clone());
							} else {
								subpath.line();
							}*/
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
					
					
					
					/*var cycleSegmentType = nodeType + nextNodeType; // pi | ii | ip | pp
					if (cycleSegmentType == "ii") {
						if (me.himself(intersection, nodeIndex)) {
							segmentIndex = intersection[nodeIndex].segment.index;
							subpath.arc(path.getSegment(segmentIndex).getArc().clone());
						} else {
							subpath.line();
						}
					} else {
						switch (nodeType) {
							case "p": segmentIndex = nodeIndex; break;
							case "i": segmentIndex = intersection[nodeIndex].segment.index; break;
						}
						if (path.getSegment(segmentIndex).isArcSegment) {
							subpath.arc(path.getSegment(segmentIndex).getArc().clone());
						} else {
							subpath.line();
						}
					}*/
				});
			}
			
			
			
			return subpath;
		},
		
		/**
		 * Проверить точку пересечения с порядковым номером index, 
		 * где лежит ее парная точка (с порядковым номером index + 1): 
		 * на том же сегменте или нет.
		 * Иными словами проверка случая, когда сегмент-дуга пересечен дважды.
		 * Пояснение: Если в многоугольнике есть дуги, то линия пересечения 
		 * может дугу пересечь в двух местах. И этот случай обсчитывается отдельно.
		 */
		himself: function(intersection, index) {
			index = Number(index);
			var segment1 = intersection[index].segment;
			
			//console.log(index + (index % 2 == 0 ? +1 : -1))
			
			var segment2 = intersection[index + (index % 2 == 0 ? +1 : -1)].segment;
			return segment1.index == segment2.index;
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