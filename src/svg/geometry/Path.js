
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
		"Khusamov.svg.geometry.Arc"
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
	}
	
});