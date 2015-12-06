
/* global Ext */

/**
 * Специальный класс для деления многоугольников, 
 * построенных при помощи объекта Путь, прямой линией.
 * 
 * Фичи:
 * 1) Многоугольник может иметь как прямые сегменты, так и дуги-сегменты.
 * 
 * Ограничения:
 * 1) Многоугольник не должен иметь пересещающиеся между собой грани.
 * 
 */

//
// Появилась идея, что алгоритм можно сильно упростить, если вместо поиска кратчайших путей 
// искать все циклы, полученного графа... 
// итого задача = а) построить граф (причем неориентированный), б) найти все циклы... 
// Если я правильно понял, что искомые многоугольники и есть циклы
// http://neerc.ifmo.ru/wiki/ Использование обхода в глубину для поиска цикла в ориентированном графе
//

Ext.define("Khusamov.svg.geometry.path.splitter.Linear", {
	
	requires: [
		"Khusamov.svg.geometry.Line", 
		"Khusamov.svg.discrete.graph.AdjacencyList",
		
		"Khusamov.svg.geometry.path.splitter.linear.DividerSet",
		"Khusamov.svg.geometry.path.splitter.linear.Graph",
		"Khusamov.svg.geometry.path.splitter.linear.CycleSet",
		"Khusamov.svg.geometry.path.splitter.linear.Cycle"
	],
	
	uses: ["Khusamov.svg.geometry.Path"],
	
	statics: {
		
		/**
		 * Разделить путь-многоугольник прямой линией.
		 * @param {Khusamov.svg.geometry.Path} path Исходный многоугольник.
		 * @param {Khusamov.svg.geometry.equation.Linear} linear Прямая линия делитель многоугольника.
		 * @param {Khusamov.svg.geometry.Point} [selPoint] Точка, определяющая какой делитель оставить.
		 * @return {null | Object} splited Результат деления или null, если нет пересечений.
		 * @return {Khusamov.svg.geometry.Path[]} splited.paths Массив многоугольников.
		 * @return {Khusamov.svg.geometry.Line[]} splited.dividers Массив делителей.
		 * @return {Khusamov.svg.geometry.Point[]} splited.intersection Массив точек пересечений.
		 */
		split: function(path, linear, selPoint) {
			var me = this, result = [];
			var intersection = path.intersection(linear, true);
			if (intersection) {
				// Если определена точка, указывающая на выбранный делитель, 
				// то остальные делители из массива intersection удаляем.
				if (selPoint) intersection = me.selectDivider(intersection, selPoint);
				// 1) Создание графа из пути и линии-делителя.
				var graph = me.createGraph(path, intersection);
				// 2) Ищем кратчайшие циклы (путь из вершины в себя) в графе.
				var cycles = me.findCycles(path, intersection, graph);
				// 3) Конвертация циклов в .svg.geometry.Path.
				cycles.forEach(function(cycle) {
					result.push(me.convertCycleToPath(cycle, path, intersection));
				});
			}
			return result.length ? {
				paths: result,
				dividers: me.createDividers(intersection),
				intersection: intersection
			} : null;
		},
		
		createDividers: function(intersection) {
			var result = [], start;
			if (intersection) intersection.forEach(function(point, index) {
				if (index % 2 == 0) {
					start = point;
				} else {
					result.push(Ext.create("Khusamov.svg.geometry.Line", start, point));
				}
			});
			return result;
		},
		
		/**
		 * @private
		 * Создание графа.
		 * @param {Khusamov.svg.geometry.Path} path Исходный многоугольник.
		 * @param {Khusamov.svg.geometry.Point[]} intersection
		 * @return {Khusamov.svg.discrete.graph.AdjacencyList}
		 */
		createGraph: function(path, intersection) {
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
				
				var last = path.getSegment(segment.index).isLast();
				
				var p = "p" + segment.index, np = "p" + (last ? 0 : (segment.index + 1)),
					i = "i" + index, ni = "i" + (index + 1);
				
				// Две точки пересечения на одном сегменте (himself=true).
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
			});
			
			// Добавляем в граф остальные точки, пропуская сегменты из массива visited.
			
			path.eachSegment(function(segment, index) {
				var last = segment.isLast();
				if (!Ext.Array.contains(visited, index)) {
					var from = "p" + index, 
						to = "p" + (last ? 0 : (index + 1));
					// Направление добавляемого в граф ребра зависит от
					// местоположения точки относительно прямой.
					if (me.getSegmentLocation(intersection, index) > 0) {
						graph.add(from, to, segment.getLength());
					} else {
						graph.add(to, from, segment.getLength());
					}
				}
			});
			
			return graph;
		},
		
		/**
		 * @private
		 * Определить местоположение сегмента относительно делителей.
		 * Учитывается ситуация, если один из делителей удален из intersection.
		 * @param {Khusamov.svg.geometry.Point[]} intersection
		 * @param {Number} segmentIndex
		 * @return {Number} 1 | -1
		 */
		getSegmentLocation: function(intersection, segmentIndex) {
			var result = 1;
			if (segmentIndex > intersection[0].segment.index) {
				intersection.forEach(function(point, index) {
					var isLast = index == intersection.length - 1;
					var start = point.segment.index;
					var end = isLast ? 0 : intersection[index + 1].segment.index;
					if (segmentIndex > start && (isLast || segmentIndex < end)) {
						result = index % 2 == 0 ? -1 : 1;
					}
				});
			}
			return result;
		},
		
		/**
		 * @private
		 * Найти кратчайшие циклы (путь из вершины в себя) в графе.
		 * @param {Khusamov.svg.geometry.Path} path Исходный многоугольник.
		 * @param {Khusamov.svg.geometry.Point[]} intersection
		 * @param {Khusamov.svg.discrete.graph.AdjacencyList} graph
		 * @return {String[][]}
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
		 * @private
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
		 * @private
		 * Конвертация цикла в Khusamov.svg.geometry.Path.
		 * @param {String[]} cycle
		 * @param {Khusamov.svg.geometry.Path} path Исходный многоугольник.
		 * @param {Khusamov.svg.geometry.Point[]} intersection
		 * @return {Khusamov.svg.geometry.Path}
		 */
		convertCycleToPath: function(cycle, path, intersection) {
			var subpath = Ext.create("Khusamov.svg.geometry.Path");
			// Определяем тип цикла: обычный и петля (кусок дуги).
			if (cycle.length == 2 && cycle[0][0] == "i" && cycle[1][0] == "i") {
				// Петля.
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
		},
		
		/**
		 * @private
		 * Удалить все делители кроме выбранного.
		 * Выбранный определяется точкой selPoint, которая находится на отрезке выбранного делителя.
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
		 * @private
		 * Создать клон прямой линии делителя на основе первой и последней точек пересечения,
		 * чтобы точно знать, что она направлена от первой точки пересечения.
		 * @param {Khusamov.svg.geometry.Point[]} intersection
		 * @return {Khusamov.svg.geometry.equation.Linear}
		 */
		/*prepareSplitLinear: function(intersection) {
			return Ext.create(
				"Khusamov.svg.geometry.Line", 
				intersection[0], 
				intersection[intersection.length - 1]
			).toLinear();
		},*/
		
		/**
		 * @private
		 * Проверить точку пересечения с порядковым номером index, 
		 * где лежит ее парная точка (с порядковым номером index + 1): 
		 * на том же сегменте или нет.
		 * Иными словами проверка случая, когда сегмент-дуга пересечен дважды.
		 * Пояснение: Если в многоугольнике есть дуги, то линия пересечения 
		 * может дугу пересечь в двух местах. И этот случай обсчитывается отдельно.
		 * @param {Khusamov.svg.geometry.Point[]} intersection
		 * @param {Number} index
		 * @return {Boolean}
		 */
		himself: function(intersection, index) {
			index = Number(index);
			var segment1 = intersection[index].segment;
			var segment2 = intersection[index + (index % 2 == 0 ? +1 : -1)].segment;
			return segment1.index == segment2.index;
		}
		
		/**
		 * @private
		 * Вспомогательная функция XOR.
		 * @param {Boolean} a
		 * @param {Boolean} b
		 * @return {Boolean}
		 */
		/*xor: function(a, b) {
			return Boolean(a ? !b : b);
		}*/
		
	}
	
});