
/**
 * Путь (сложная линия) на плоскости.
 * 
 * Структура класса
 * 
 * Путь (path) состоит из сегментов (segment).
 * Каждый сегмент имеет первую точку.
 * Путь может иметь последнюю точку. Если ее нет, то путь замыкается на первой.
 * Точки (сегментов и последняя точка в пути) имеют опцию relative.
 * 
 */

Ext.define("Khusamov.svg.geometry.Path", {
	
	extend: "Khusamov.svg.geometry.Primitive",
	
	requires: [
		"Ext.util.Collection",
		"Khusamov.svg.geometry.path.segment.Line",
		"Khusamov.svg.geometry.path.segment.Arc",
		"Khusamov.svg.geometry.Arc",
		"Khusamov.svg.geometry.equation.Linear",
		"Khusamov.svg.discrete.graph.AdjacencyList",
		"Khusamov.svg.geometry.Line"
	],
	
	isPath: true,
	
	type: "path",
	
	constructor: function() {
		
		this.callParent(arguments);
		
		/**
		 * Массив сегментов пути.
		 * @readonly
		 * @property {Array}
		 */
		this.segments = [];
		
		/**
		 * Флаг, обозначающий открыт или закрыт путь.
		 * @readonly
		 * @property {Boolean}
		 */
		this.closed = false;
		
		/**
		 * Последняя точка пути.
		 * Если равно null, то последней точкой считается первая точка пути.
		 * @readonly
		 * @property {null | Khusamov.svg.geometry.path.Point}
		 */
		this.lastPoint = null;
		
	},
	
	/**
	 * Добавить сегмент пути.
	 * Для набора пути используйте методы: point(), line() и arc().
	 * @return {Khusamov.svg.geometry.path.segment.Segment}
	 */
	add: function(segment) {
		segment.setPath(this);
		this.segments.push(segment);
		this.closed = true;
		
		this.lastPoint.un("update", "onLastPointUpdate", this);
		this.lastPoint = null;
		
		this.fireEvent("add");
		this.fireEvent("update");
		return segment;
	},
	
	/**
	 * Замещение сегмента.
	 * @return {Khusamov.svg.geometry.path.segment.Segment}
	 */
	splice: function(index, deleteCount, segment) {
		this.segments.splice(index, deleteCount, segment);
		this.fireEvent("splice");
		this.fireEvent("update");
		return segment;
	},
	
	/**
	 * Заменить выбранный сегмент.
	 * @return {Khusamov.svg.geometry.path.segment.Segment}
	 */
	replace: function(index, segment, savePoint) {
		if (savePoint) segment.setPoint(this.getPoint(index));
		return this.splice(index, 1, segment);
	},
	
	/**
	 * Вставка сегмента.
	 * @return {Khusamov.svg.geometry.path.segment.Segment}
	 */
	insert: function(index, segment) {
		return this.splice(index, 0, segment);
	},
	
	/**
	 * Получить индекс (порядковый номер) сегмента.
	 * Индексы начинаются с нуля.
	 * @return {Number}
	 */
	indexOf: function(segment) {
		return this.segments.indexOf(segment);
	},
	
	/**
	 * Получить количество сегментов пути.
	 * @return {Number}
	 */
	getCount: function() {
		return this.segments.length;
	},
	
	/**
	 * Очистить путь (удалить все сегменты и точки).
	 * @return {Khusamov.svg.geometry.Path}
	 */
	clear: function() {
		this.segments = [];
		this.closed = false;
		
		if (this.lastPoint) {
			this.lastPoint.un("update", "onLastPointUpdate", this);
			this.lastPoint = null;
		}
		
		this.fireEvent("clear");
		this.fireEvent("update");
		return this;
	},
	
	/**
	 * Получить сегмент по его индексу.
	 * @return {Khusamov.svg.geometry.path.segment.Segment}
	 */
	getSegment: function(index) {
		return this.segments[index];
	},
	
	/**
	 * Получить первый сегмент пути.
	 * @return {Khusamov.svg.geometry.path.segment.Segment}
	 */
	getFirstSegment: function() {
		return this.getSegment(0);
	},
	
	/**
	 * Получить последний сегмент пути.
	 * @return {Khusamov.svg.geometry.path.segment.Segment}
	 */
	getLastSegment: function() {
		return this.getSegment(this.getCount() - 1);
	},
	
	/**
	 * Получить следущий сегмент пути.
	 * При этом считается что путь замкнут.
	 * @return {Khusamov.svg.geometry.path.segment.Segment}
	 */
	getNextSegment: function(index) {
		var segment = this.getSegment(index + 1);
		return segment ? segment : this.getFirstSegment();
	},
	
	/**
	 * Получить предыдущий сегмент пути.
	 * При этом считается что путь замкнут.
	 * @return {Khusamov.svg.geometry.path.segment.Segment}
	 */
	getPrevSegment: function(index) {
		var segment = this.getSegment(index - 1);
		return segment ? segment : this.getLastSegment();
	},
	
	/**
	 * Цикл по сегментам пути.
	 * @return {Khusamov.svg.geometry.Path}
	 */
	eachSegment: function(fn, scope) {
		this.segments.forEach(fn, scope);
		return this;
	},
	
	/**
	 * Получить путь в текстовом виде в формате SVG.
	 * @return {String}
	 */
	toString: function() {
		var me = this;
		var result = [];
		me.segments.forEach(function(segment) {
			result.push(segment.toString());
		});
		return result.join(" ");
	},
	
	/**
	 * Основной способ набора пути.
	 * Добавление точки: первая точка сегмента или последняя точка пути.
	 * 
	 * point(Khusamov.svg.geometry.path.Point);
	 * point(Khusamov.svg.geometry.Point);
	 * point([x, y]);
	 * point([x, y, relative]);
	 * 
	 * point(x, y);
	 * point([x, y], relative);
	 * point(Khusamov.svg.geometry.path.Point, relative);
	 * point(Khusamov.svg.geometry.Point, relative);
	 * 
	 * point(x, y, relative);
	 * 
	 * @return {Khusamov.svg.geometry.Path}
	 */
	point: function() {
		var point = null;
		if (arguments[0] instanceof Khusamov.svg.geometry.path.Point) {
			point = arguments[0];
			if (arguments.length == 2) point.setRelative(arguments[1]);
		} else {
			if (arguments.length == 1) {
				point = arguments[0];
				point = Ext.create("Khusamov.svg.geometry.path.Point", point);
			}
			if (arguments.length == 2 && !Ext.isNumber(arguments[0])) {
				point = Ext.create("Khusamov.svg.geometry.path.Point", arguments[0], arguments[1]);
			}
			if ((arguments.length == 3 || arguments.length == 2) && Ext.isNumber(arguments[0])) {
				point = Ext.Array.slice(arguments);
				point = Ext.create("Khusamov.svg.geometry.path.Point", point);
			}
		}
		this.lastPoint = point;
		this.lastPoint.on("update", "onLastPointUpdate", this);
		this.lastPoint.setPath(this);
		this.closed = false;
		this.fireEvent("changelastpoint");
		this.fireEvent("update");
		return this;
	},
	
	onLastPointUpdate: function() {
		this.fireEvent("update");
	},
	
	/**
	 * Основной способ набора пути.
	 * Добавление сегмента.
	 * Вместо этого метода используйте методы line() и arc().
	 * @return {Khusamov.svg.geometry.Path}
	 */
	segment: function(segment) {
		segment.setPoint(this.lastPoint);
		this.add(segment);
		return this;
	},
	
	/**
	 * Основной способ набора пути.
	 * Добавление прямого сегмента пути.
	 * @return {Khusamov.svg.geometry.Path}
	 */
	line: function() {
		return this.segment(Ext.create("Khusamov.svg.geometry.path.segment.Line"));
	},
	
	/**
	 * Основной способ набора пути.
	 * Добавление сегмента пути типа арка.
	 * @return {Khusamov.svg.geometry.Path}
	 */
	arc: function(radius, config) {
		var segment = null;
		var ArcSegment = Khusamov.svg.geometry.path.segment.Arc;
		if (radius instanceof Khusamov.svg.geometry.Arc) {
			segment = ArcSegment.create(radius);
		} else {
			if (!(Ext.isArray(radius) || Ext.isNumeric(radius))) {
				config = radius;
				radius = null;
			}
			segment = ArcSegment.create(null, radius, config);
		}
		return this.segment(segment);
	},
	
	/**
	 * Заменить выбранный сегмент на прямую.
	 * @return {Khusamov.svg.geometry.path.segment.Line}
	 */
	replaceOfLine: function(index) {
		return this.replace(Ext.create("Khusamov.svg.geometry.path.segment.Line"), true);
	},
	
	/**
	 * Заменить выбранный сегмент на арку.
	 * @return {Khusamov.svg.geometry.path.segment.Arc}
	 */
	replaceOfArc: function(index, radius, config) {
		return this.replace(Ext.create("Khusamov.svg.geometry.path.segment.Arc", null, radius, config), true);
	},
	
	/**
	 * Получить точку по индексу сегмента.
	 * Возвращается первая точка запрошенного сегмента.
	 * @return {Khusamov.svg.geometry.path.Point}
	 */
	getPoint: function(index) {
		var me = this;
		var segment = me.getSegment(index);
		return segment ? segment.getPoint() : ((!me.closed && index == me.getCount()) ? me.lastPoint : null);
	},
	
	getFirstPoint: function() {
		return this.getPoint(0);
	},
	
	/**
	 * Получить массив точек пути.
	 * @return {Array}
	 */
	getPoints: function() {
		var result = [];
		this.segments.forEach(function(segment) {
			result.push(segment.getPoint());
		});
		if (this.lastPoint) result.push(this.lastPoint);
		return result;
	},
	
	/**
	 * Цикл по точкам пути.
	 * @return {Khusamov.svg.geometry.Path}
	 */
	eachPoint: function(fn, scope) {
		this.getPoints().forEach(fn, scope);
		return this;
	},
	
	/**
	 * Площадь многоугольника, образованного путем (как если сегменты были бы прямыми), со знаком обхода вершин.
	 * Положительное число - Путь задан по часовой стрелке (при условии что ось Оу смотрит вверх).
	 * Но обычно ось Оу смотрит вниз, поэтому положительное число указывает о направлении против часовой стрелки.
	 * @return {Number}
	 */
	getPolygonRawArea: function() {
		var me = this;
		var result = 0;
		me.eachPoint(function(point, index) {
			var next = me.getPoint(index + 1);
			next = next ? next : me.getPoint(0);
			result += ((next.y() + point.y()) / 2) * (next.x() - point.x());
		});
		return result;
	},
	
	/**
	 * Определить направление пути.
	 * 1. Ось Оу обращена вниз (ситуация по умолчанию):
	 * Возвращает false при условии что путь задан по часовой стрелке и ось Оу смотрит вверх.
	 * Возвращает true при условии что путь задан против часовой стрелке и ось Оу смотрит вниз.
	 * 2. Ось Оу обращена наверх:
	 * Возвращает true при условии что путь задан по часовой стрелке.
	 * Возвращает false при условии что путь задан против часовой стрелке.
	 * @return {Boolean}
	 */
	isClockwiseDirection: function() {
		return this.getPolygonRawArea() > 0;
	},
	
	/**
	 * Вывернуть путь наизнанку.
	 * Последовательность сегментов меняется на обратную.
	 * @return {Khusamov.svg.geometry.Path}
	 */
	turnOut: function() {
		var me = this;
		var points = me.getPoints().sort(function(point, next) {
			return next.getIndex() - point.getIndex();
		});
		me.segments.sort(function(segment, next) {
			return next.getIndex() - segment.getIndex();
		});
		points.forEach(function(point, index) {
			var segment = me.getSegment(index);
			point.unlinkSegment();
			if (segment) {
				segment.setPoint(point);
			} else {
				me.lastPoint = point;
				me.lastPoint.on("update", "onLastPointUpdate", me);
			}
		});
		me.fireEvent("turnout");
		me.fireEvent("update");
		return me;
	},
	
	/**
	 * Длина пути.
	 */
	getLength: function() {
		var result = 0;
		this.eachSegment(function(segment) {
			result += segment.getLength();
		});
		return result;
	},
	
	/**
	 * @param {Boolean} segmented Если равен true, то на выходе будет массив точек с 
	 * 1) индексом сегмента,
	 * 2) координатой точки внутри сегмента (расстояние до точки от начала сегмента),
	 * 3) координатой точки внутри пути (расстояние до точки от начала пути).
	 * (Эта информация добавляется прямо в объект точки в свойство segment{index, distance, distanceByPath}).
	 */
	intersection: function(primitive, segmented) {
		return this["intersectionWith" + Ext.String.capitalize(primitive.type)].call(this, primitive, segmented);
	},
	
	intersectionWithLinear: function(linear, segmented) {
		var result = [], length = 0;
		this.eachSegment(function(segment, index) {
			var intersection = segment.getPrimitive().intersection(linear);
			if (intersection) {
				result = result.concat(intersection);
				
				if (segmented) {
					intersection = Ext.isArray(intersection) ? intersection: [intersection];
					intersection.forEach(function(point) {
						var distance = segment.getFirstPoint().getDistanceTo(point);
						point.segment = {
							index: index,
							distance: distance,
							distanceByPath: length + distance
						};
					});
					length += segment.getLength();
				}
			}
		});
		
		
		
		// DEBUG
			var res = [];
			result.forEach(function(point) { res.push(point.getRadius().toFixed(0)); });
			console.info(res);
		// / DEBUG
		
		
		// Отсортировать точки, чтобы в массиве начинались они с края многоугольника.
		result = linear.sort(result);
		
		
		
		// DEBUG
			res = [];
			result.forEach(function(point) { res.push(point.getRadius().toFixed(0)); });
			console.info(res);
		// / DEBUG
		

		
		
		return result.length ? result : null;
	},
	
	/**
	 * Разделить путь.
	 * @param {Khusamov.svg.geometry.Primitive} primitive
	 * @return {null | Khusamov.svg.geometry.Path[]}
	 */
	split: function(primitive) {
		return this["splitWith" + Ext.String.capitalize(primitive.type)].call(this, primitive);
	},
	
	/**
	 * Разделить путь прямой линией.
	 * @param {Khusamov.svg.geometry.equation.Linear} linear
	 * @return {null | Khusamov.svg.geometry.Path[]}
	 */
	splitWithLinear: function(linear) {
		var me = this;
		var result = [];
		
		var intersection = me.intersectionWithLinear(linear, true);
		
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
				
				var length = me.getSegment(segment.index).getLength();
				var last = me.getSegment(segment.index).isLast();
				
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
			me.eachSegment(function(segment, index) {
				var last = segment.isLast();
				if (!Ext.Array.contains(visited, index)) {
					var from = "p" + index, to = "p" + (last ? 0 : (index + 1)), length = segment.getLength();
					// Направление добавляемого в граф ребра зависит от местоположения точки относительно 
					// прямой и как был задан путь (по часовой стрелке или нет).
					var clockwize = me.isClockwiseDirection();
					if (intersectionLinear.distance(segment.getFirstPoint(), true) > 0 ? !clockwize : clockwize) {
						graph.add(from, to, length);
					} else {
						graph.add(to, from, length);
					}
				}
			});
			
			console.log("ГРАФ", graph.graph, me.isClockwiseDirection());
			
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
			function findPath(node) {
				if (!cyclesContains(node)) {
					cycles.push(graph.findBackPath(node));
				}
			}
			intersection.forEach(function(point) {
				var last = me.getSegment(point.segment.index).isLast();
				findPath("p" + point.segment.index);
				findPath("p" + (last ? 0 : (point.segment.index + 1)));
			});
			
			
			
			// Конвертация циклов в Khusamov.svg.geometry.Path.
			
			cycles.forEach(function(cycle) {
				var path = new me.self();
				cycle.forEach(function(node) {
					var point = (node[0] == "p") ? me.getPoint(node.substring(1)).clone() : intersection[node.substring(1)];
					path.point(point);
					path.line();
				});
				result.push(path);
			});
		}
		
		
		return result.length ? result : null;
	},
	
	/**
	 * Разбить полигон на две части отрезком, 
	 * зная координаты первой и последней точек отрезка.
	 * Причем координаты задаются следующим образом:
	 * индекс сегмента пути, расстояние от первой точки сегмента.
	 * Третий параметр это тип отрезка (потомок класса Khusamov.svg.geometry.path.segment.Segment).
	 * @param {Object} first
	 * @param {Number} first.index
	 * @param {Number} first.distance
	 * @param {Object} last
	 * @param {Number} last.index
	 * @param {Number} last.distance
	 * @param {Khusamov.svg.geometry.path.segment.Segment} segment
	 */
	splitByPointPair: function(first, last, segment) {
		var me = this;
		
		// МЕТОД ПОКА НЕ ИСПОЛЬЗУЕТСЯ
		
		var firstSegment = me.getSegment(first.index);
		var lastSegment = me.getSegment(last.index);
		
		
		
		var curSegment = lastSegment;
		while (curSegment.getNextSegment().getIndex() != firstSegment.getIndex()) {
			curSegment = curSegment.getNextSegment();
		}
		
		
		
		
		
	}
	
	
	
});