
/**
 * Полилиния на плоскости.
 */

Ext.define("Khusamov.svg.geometry.Polyline", {
	extend: "Khusamov.svg.geometry.Primitive",
	
	requires: ["Khusamov.svg.geometry.Point", "Khusamov.svg.geometry.point.Collection"],
	
	uses: ["Khusamov.svg.geometry.Line"],
	
	statics: {
		
		/**
		 * Конвертирование строки с описанием последовательности точек в формате SVG
		 * в массив с точками, представленными в виде массива [x, y].
		 * @return {Array[x, y][]}
		 */
		parseSvgPointString: function(value) {
			var result = [];
			// TODO
			return result;
		},
		
		/**
		 * Конвертировать строку (в формате SVG) или массив c точками в коллекцию.
		 * Каждая точка конвертируется в экземпляр класса Khusamov.svg.geometry.Point.
		 * @param {String | Array[x, y][] | Khusamov.svg.geometry.Point[] | Mixed[] | Khusamov.svg.geometry.point.Collection} points
		 * @param {undefined | Number} offset
		 * @return {Khusamov.svg.geometry.point.Collection}
		 */
		toCollection: function(points) {
			var Point = Khusamov.svg.geometry.Point;
			var Collection = Khusamov.svg.geometry.point.Collection;
			var result = points instanceof Collection ? points.clone() : new Collection();
			if (Ext.isString(points)) points = this.parseSvgPointString(points);
			if (Ext.isArray(points)) {
				points = points.map(function(point, index) {
					return point instanceof Point ? point : new Point(point);
				});
				result.add(points);
			}
			return result;
		}
		
	},
	 
	privates: {
		
		
		
	},
	
	isPolyline: true,
	
	type: "polyline",
	
	/**
	 * Доступ к точкам полилинии.
	 * @readonly
	 * @property {Khusamov.svg.geometry.point.Collection}
	 */
	points: null,
	
	/**
	 * @event update Обновление полилинии.
	 * @param {String} type Тип обновления (update | add | insert | remove | clear).
	 * @param {Khusamov.svg.geometry.Point[]} points Затронутые точки.
	 */
	
	config: {
		
		/**
		 * Массив точек полилинии.
		 * @property {Khusamov.svg.geometry.point.Collection}
		 */
		points: null
		
	},
	
	/**
	 * Ext.create("Khusamov.svg.geometry.Polyline");
	 * Ext.create("Khusamov.svg.geometry.Polyline", String);
	 * Ext.create("Khusamov.svg.geometry.Polyline", Array[x, y][]);
	 * Ext.create("Khusamov.svg.geometry.Polyline", Khusamov.svg.geometry.Point[]);
	 * Ext.create("Khusamov.svg.geometry.Polyline", Mixed[]);
	 * Ext.create("Khusamov.svg.geometry.Polyline", Khusamov.svg.geometry.point.Collection);
	 */
	constructor: function(config) {
		var me = this;
		if (Ext.isString(config) || Ext.isArray(config)) config = { points: config };
		me.callParent([config]);
	},
	
	initPrimitive: function() {
		var me = this;
		if (!me.points) me.setPoints();
	},
	
	/**
	 * Заменить массив точек на новый.
	 * Polyline.setPoints("Строка точек в формате SVG");
	 * Polyline.setPoints(Array[x, y][]);
	 * Polyline.setPoints(Khusamov.svg.geometry.Point[]);
	 * Polyline.setPoints(Mixed[]);
	 * Polyline.setPoints(Khusamov.svg.geometry.point.Collection);
	 */
	applyPoints: function(points) {
		var me = this;
		points = Khusamov.svg.geometry.Polyline.toCollection(points);
		return points;
	},
	
	updatePoints: function(points, old) {
		var me = this;
		me.points = points;
		me.removePointCollectionListeners(old);
		me.addPointCollectionListeners(points);
		this.fireEvent("update", "clear");
		this.fireEvent("update", "add", points);
	},
	
	/**
	 * Добавить в коллекцию  и в каждый элемент коллекции слушателей.
	 * @param {Khusamov.svg.geometry.point.Collection} collection
	 */
	addPointCollectionListeners: function(collection) {
		var me = this;
		collection.on({
			scope: me,
			add: "onAddPoints",
			remove: "onRemovePoints"
		});
		collection.each(function(point) {
			me.addPointListeners(point);
		});
	},
	
	/**
	 * @param {Khusamov.svg.geometry.point.Collection} collection
	 */
	removePointCollectionListeners: function(collection) {
		var me = this;
		if (collection) {
			collection.un({
				scope: me,
				add: "onAddPoints",
				remove: "onRemovePoints"
			});
			collection.each(function(point) {
				me.removePointListeners(point);
			});
		}
	},
	
	/**
	 * @param {Khusamov.svg.geometry.Point} point
	 */
	addPointListeners: function(point) {
		point.on("update", "onUpdatePoint", this);
	},
	
	/**
	 * @param {Khusamov.svg.geometry.Point} point
	 */
	removePointListeners: function(point) {
		point.un("update", "onUpdatePoint", this);
	},
	
	/**
	 * Обработчик события "Изменились координаты определенной точки".
	 */
	onUpdatePoint: function(type, point) {
		this.fireEvent("update", "points", [point]);
		this.fireEvent("pointupdate", point);
	},
	
	onAddPoints: function(collection, details) {
		var me = this;
		me.fireEvent("update", "add", details.items);
		details.items.forEach(function(point) {
			me.addPointListeners(point);
		});
	},
	
	onRemovePoints: function(collection, details) {
		var me = this;
		me.fireEvent("update", "remove", details.items);
		details.items.forEach(function(point) {
			me.addPointListeners(point);
		});
	},
	
	/**
	 * Получить полилинию в виде массива точек.
	 * @param {boolean} pointAsPoint Если равен true, то выдать массив Khusamov.svg.geometry.Point[].
	 * @return {Number[x, y][] | Khusamov.svg.geometry.Point[]}
	 */
	toArray: function(pointAsPoint) {
		var me = this;
		var result = [];
		me.points.each(function(point) {
			result.push(pointAsPoint ? point : point.clone().toArray());
		});
		return result;
	},
	
	/**
	 * @return {Object}
	 */
	toObject: function() {
		var me = this;
		return Ext.Object.merge(me.callParent(), {
			points: me.toArray()
		});
	},
	
	/**
	 * Конвертировать массив точек в строку в формате SVG.
	 * @param points {Khusamov.svg.geometry.Polyline}
	 */
	toString: function() {
		var me = this;
		var result = [];
		me.each(function(point) {
			result.push(point.toString());
		});
		return result.join(" ");
	},
	
	/**
	 * @return {Khusamov.svg.geometry.point.Collection}
	 */
	toCollection: function() {
		return this.points.clone();
	},
	
	/**
	 * Добавить точку в конец полилинии.
	 * @param {(Number, Number) | Array[x, y] | Khusamov.svg.geometry.Point} point
	 * @return Khusamov.svg.geometry.Point
	 */
	addPoint: function(point) {
		if (arguments.length == 2) points = [arguments[1], arguments[2]];
		if (Ext.isArray(point)) point = Ext.create("Khusamov.svg.geometry.Point", point);
		return this.points.add(point);
	},
	
	/**
	 * Добавить несколько точек в конец полилинии.
	 * @param {String | Array[x, y][] | Khusamov.svg.geometry.Point[] | Khusamov.svg.geometry.point.Collection | Khusamov.svg.geometry.Polyline} points
	 * @return Khusamov.svg.geometry.Point[]
	 */
	addPoints: function(points) {
		if (arguments.length > 1) points = Ext.Array.slice(arguments);
		if (Ext.isString(points)) points = Khusamov.svg.geometry.Polyline.parseSvgPointString(points);
		
		if (points instanceof Khusamov.svg.geometry.point.Collection) {
			var _points = [];
			points.each(function(point) { _points.push(point); });
			points = _points;
		}
		
		if (Ext.isArray(points)) points = points.map(function(point) {
			if (Ext.isArray(point)) point = Ext.create("Khusamov.svg.geometry.Point", point);
			return point;
		});
		
		if (points instanceof Khusamov.svg.geometry.Polyline) points = points.toArray(true);
		
		return this.points.add(points);
	},
	
	insertPoint: function(index, point) {
		
	},
	
	/**
	 * Вставить точку(и) перед точкой с индексом index.
	 * @param {Number} index
	 * @param {Array | Khusamov.svg.geometry.Point} point
	 * @param {String | Array[x, y][] | Khusamov.svg.geometry.Point[], Khusamov.svg.geometry.point.Collection | Khusamov.svg.geometry.Polyline} points
	 * @return Khusamov.svg.geometry.Point | Khusamov.svg.geometry.Point[]
	 */
	insertPoints: function(index, points) {
		/*if (arguments.length == 3) points = [arguments[1], arguments[2]];
		points = Khusamov.svg.geometry.Polyline.toPointArray(points);
		return this.points.insert(index, points);*/
	},
	
	removePoint: function(index) {
		this.points.removeAt(index);
		return this;
	},
	
	clear: function() {
		this.points.removeAll();
		return this;
	},
	
	/**
	 * Изменить координаты одной точки.
	 */
	movePoint: function(index, point) {
		var me = this;
		if (arguments.length == 3) point = [arguments[1], arguments[2]];
		me.getPoint(index).move(point);
		return me;
	},
	
	movePointBy: function() {
		
	},
	
	/**
	 * Цикл по всем точкам полилинии.
	 */
	each: function(fn, scope) {
		this.points.each(fn, scope);
		return this;
	},
	
	eachPoint: function(fn, scope) {
		this.points.each(fn, scope);
		return this;
	},
	
	eachLine: function(fn, scope) {
		for (var index = 0; index < this.points.getCount(); index++) {
			fn.call(scope, this.getLine(index), index);
		}
		return this;
	},
	
	/**
	 * Количество точек в полилинии.
	 * @return {Number}
	 */
	getCount: function() {
		return this.points.getCount();
	},
	
	/**
	 * Длина полилинии.
	 * @return {Number}
	 */
	getLength: function() {
		var me = this;
		var result = 0;
		me.each(function(point, index) {
			var next = me.getNextPoint(index);
			result += next ? point.distance(next) : 0;
		});
		return result;
	},
	
	getPointById: function(id) {
		return this.points.get(id);
	},
	
	getPoint: function(index) {
		return this.points.getAt(index);
	},
	
	getLine: function(index) {
		return Ext.create("Khusamov.svg.geometry.Line", this.getPoint(index), this.getNextPoint(index));
	},
	
	getNextPoint: function(index) {
		return this.getPoint(index + 1);
	},
	
	getPrevPoint: function(index) {
		return this.getPoint(index - 1);
	},
	
	getFirstPoint: function() {
		return this.getPoint(0);
	},
	
	getLastPoint: function() {
		return this.getPoint(this.getCount() - 1);
	},
	
	/**
	 * Координаты середины линии.
	 * @param {undefined | Number} index Номер первой точки.
	 * @return Khusamov.svg.geometry.Point
	 */
	getMiddlePoint: function(index) {
		var me = this;
		var from = me.getPoint(index || 0);
		var to = me.getNextPoint(index || 0);
		var middle = [(from.x() + to.x()) / 2, (from.y() + to.y()) / 2];
		return Ext.create("Khusamov.svg.geometry.Point", middle);
	},
	
	/**
	 * Площадь многоугольника, образованного полилинией.
	 */
	getArea: function() {
		return Math.abs(this.getRawArea());
	},
	
	/**
	 * Площадь многоугольника, образованного полилинией, со знаком обхода вершин.
	 * Положительное число - Полилиния задана по часовой стрелки (при условии что ось Оу смотрит вверх).
	 * Но обычно ось Оу смотрит вниз, поэтому положительное число указывает о направлении против часовой стрелки.
	 */
	getRawArea: function() {
		var me = this;
		var result = 0;
		me.each(function(point, index) {
			var next = me.getNextPoint(index);
			next = next ? next : me.getFirstPoint();
			result += ((next.y() + point.y()) / 2) * (next.x() - point.x());
		});
		return result;
	},
	
	/**
	 * Ось Оу обращена вниз (ситуация по умолчанию):
	 * Возвращает false при условии что полилиния задана по часовой стрелке.
	 * Возвращает true при условии что полилиния задана против часовой стрелке.
	 * Ось Оу обращена наверх:
	 * Возвращает true при условии что полилиния задана по часовой стрелке.
	 * Возвращает false при условии что полилиния задана против часовой стрелке.
	 */
	isClockwiseDirection: function() {
		var me = this;
		return me.getRawArea() > 0;
	},
	
	/**
	 * Вывернуть полилинию наизнанку.
	 */
	turnOut: function() {
		var me = this;
		me.points.sortItems(function(item, next) {
			return next.getIndex() - item.getIndex();
		});
		return me;
	}
	
});