
/* global Ext */

/**
 * Специальный класс для деления многоугольников 
 * (построенных при помощи объекта Путь) прямой линией.
 */

Ext.define("Khusamov.svg.geometry.path.splitter.Linear", {
	
	uses: ["Khusamov.svg.geometry.Path"],
	
	statics: {
			
		/**
		 * Разделить путь прямой линией.
		 * @param {Khusamov.svg.geometry.Path} path
		 * @param {Khusamov.svg.geometry.equation.Linear} linear
		 * @return {null | Khusamov.svg.geometry.Path[]}
		 */
		split: function(path, linear) {
			
			var result = [];
			
			var intersection = path.intersectionWithLinear(linear, true);
			
			if (intersection) {
	
				// Создаем прямую линию (по сути клон линии-делителя) 
				// чтобы точно знать, что она направлена от первой точки пересечения.
				var intersectionLinear = Ext.create(
					"Khusamov.svg.geometry.Line", 
					intersection[0], 
					intersection[intersection.length - 1]
				).toLinear();
				
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
						if (intersectionLinear.distance(segment.getFirstPoint(), true) > 0 ? !clockwize : clockwize) {
							graph.add(from, to, length);
						} else {
							graph.add(to, from, length);
						}
					}
				});
				
				console.log("ГРАФ", graph.graph, path.isClockwiseDirection());
				
				// Появилась идея, что алгоритм можно сильно упростить, если вместо поиска кратчайших путей 
				// искать все циклы, полученного графа... итого задача = а) построить граф (причем неориентированный), б) найти все циклы... 
				// Если я правильно понял, что искомые многоугольники и есть циклы
				// http://neerc.ifmo.ru/wiki/ Использование обхода в глубину для поиска цикла в ориентированном графе
				
				// Ищем кратчайшие циклы (путь из вершины в себя) в графе.
				var cycles = [];
				function cyclesContains(node) {
					var result = false;
					cycles.forEach(function(cycle) {
						if (Ext.Array.contains(cycle, node)) {
							result = true;
							return false;
						}
					});
					return result;
				}
				function findPath(node, reverse) {
					if (!cyclesContains(node)) {
						var cycle = graph.findBackPath(node);
						cycles.push(reverse ? cycle.reverse() : cycle);
					}
				}
				intersection.forEach(function(point) {
					var last = path.getSegment(point.segment.index).isLast();
					findPath("p" + point.segment.index);
					findPath("p" + (last ? 0 : (point.segment.index + 1)), true);
				});
				
				
				
				// Конвертация циклов в Khusamov.svg.geometry.Path.
				
				cycles.forEach(function(cycle) {
					//var path = new path.self();
					var path = Ext.create("Khusamov.svg.geometry.Path");
					
					cycle.forEach(function(node, index) {
						
						var nodeType = node[0], 
							nodeIndex = node.substring(1), 
							isLastNode = (index == cycle.length - 1);
						
						// Определяем точку пути.
						
						var point;
						switch (nodeType) {
							case "p": point = path.getPoint(nodeIndex); break;
							case "i": point = intersection[nodeIndex]; break;
							default: throw new Error("Узел неизвестного типа", node[0], node);	
						}
						point = point.clone();
						
						path.point(point);
						
						// Определяем сегмент пути.
						
						var nextNode = cycle[isLastNode ? 0 : index + 1],
							nextNodeType = nextNode[0], 
							nextNodeIndex = nextNode.substring(1), 
							cycleSegmentType = nodeType + nextNodeType; // pi ii ip pp
						
						
						console.log("NODE", node);
						console.log("NEXT", nextNode);
						
						
						if (cycleSegmentType == "ii") {
							path.line();
							
							console.log("line");
							
						} else {
							var segmentIndex;
							switch (nodeType) {
								case "p": segmentIndex = nodeIndex; break;
								case "i": segmentIndex = intersection[nodeIndex].segment.index; break;
							}
							
							if (path.getSegment(segmentIndex).isArcSegment) {
								path.arc(path.getSegment(segmentIndex).getArc().clone());
								console.log("arc");
							} else {
								path.line();
								console.log("line");
							}
						}
						
						
						
						
					});
					result.push(path);
				});
			}
			
			
			return result.length ? result : null;
		}
		
	}
	
});