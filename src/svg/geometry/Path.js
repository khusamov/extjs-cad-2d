
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
		"Khusamov.svg.geometry.path.Subpath",
		"Khusamov.svg.geometry.path.segment.Line",
		"Khusamov.svg.geometry.path.segment.Arc"
	],
	
	isPath: true,
	
	type: "path",
	
	config: {
		
		closed: false,
		
		/**
		 * Последняя точка пути.
		 * Если равно null, то последней точкой является первая точка пути.
		 * @cfg {Khusamov.svg.geometry.path.Point}
		 */
		lastPoint: null
		
	},
	
	constructor: function() {
		this.callParent(arguments);
		
		/**
		 * Массив сегментов пути.
		 * @property {Array}
		 */
		this.segments = [];
		
		
		/*this.cursor = null;
		this.newCursoredSubpath = false;*/
	},
	
	applyLastPoint: function(point) {
		if (point) {
			point = Ext.isArray(point) ? Ext.create("Khusamov.svg.geometry.path.Point", point) : point;
			point.setPath(this);
		}
		return point;
	},
	
	getLastPoint: function(absolute) {
		return absolute ? this.callParent().toAbsolute() : this.callParent();
	},
	
	add: function(segment) {
		segment.setPath(this);
		this.segments.push(segment);
		return segment;
	},
	
	indexOf: function(segment) {
		return this.segments.indexOf(segment);
	},
	
	getCount: function() {
		return this.segments.length;
	},
	
	clear: function() {
		this.segments = [];
		this.setClosed(false);
		this.setLastPoint(null);
		this.fireEvent("update");
	},
	
	isClosed: function() {
		return this.getClosed();
	},
	
	getSegment: function(index) {
		return this.segments[index];
	},
	
	getFirstSegment: function() {
		return this.getSegment(0);
	},
	
	getLastSegment: function() {
		return this.getSegment(this.getCount() - 1);
	},
	
	getNextSegment: function(index) {
		var segment = this.getSegment(index + 1);
		return segment ? segment : this.getFirstSegment();
	},
	
	getPrevSegment: function(index) {
		var segment = this.getSegment(index - 1);
		return segment ? segment : this.getLastSegment();
	},
	
	eachSegment: function(fn, scope) {
		this.segments.forEach(fn, scope);
	},
	
	toString: function() {
		var me = this;
		var result = [];
		me.segments.forEach(function(segment) {
			result.push(segment.toString());
		});
		return result.join(" ");
	},
	
	
	
	
	
	
	
	getPoint: function(index) {
		var me = this;
		var segment = me.getSegment(index);
		return segment ? segment.getPoint() : ((!me.isClosed() && index == me.getCount()) ? me.getLastPoint() : null);
	},
	
	getPoints: function() {
		var result = [];
		this.segments.forEach(function(segment) {
			result.push(segment.getPoint());
		});
		var last = this.getLastPoint();
		if (last) result.push(last);
		return result;
	},
	
	eachPoint: function(fn, scope) {
		this.getPoints().forEach(fn, scope);
	},
	
	/**
	 * Площадь многоугольника, образованного путем (как если сегменты были бы прямыми), со знаком обхода вершин.
	 * Положительное число - Путь задан по часовой стрелке (при условии что ось Оу смотрит вверх).
	 * Но обычно ось Оу смотрит вниз, поэтому положительное число указывает о направлении против часовой стрелки.
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
	 * Ось Оу обращена вниз (ситуация по умолчанию):
	 * Возвращает false при условии что путь задан по часовой стрелке и ось Оу смотрит вверх.
	 * Возвращает true при условии что путь задан против часовой стрелке и ось Оу смотрит вниз.
	 * Ось Оу обращена наверх:
	 * Возвращает true при условии что путь задан по часовой стрелке.
	 * Возвращает false при условии что путь задан против часовой стрелке.
	 */
	isClockwiseDirection: function() {
		var me = this;
		return me.getPolygonRawArea() > 0;
	},
	
	/**
	 * Вывернуть путь наизнанку.
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
			if (segment) {
				segment.setPoint(point);
			} else {
				me.setLastPoint(point);
			}
		});
		me.fireEvent("update");
		return me;
	},
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	/*subpaths: null,
	
	privates: {
		
		cursor: null,
		
		newCursoredSubpath: false,
		
	},
	
	
	add: function(subpath) {
		var added = subpath ? subpath : Ext.create("Khusamov.svg.geometry.path.Subpath");
		this.subpaths.push(added);
		return added;
	},
	
	getCount: function() {
		return this.subpaths.length;
	},
	
	getSubpath: function(index) {
		return this.subpaths[index];
	},*/
	
	/*getCursoredSubpath: function() {
		var last = this.getCount() ? this.getSubpath(this.getCount() - 1) : this.add();
		if (this.newCursoredSubpath) {
			this.newCursoredSubpath = false;
			last = this.add();
		}
		return last;
	},*/
	
	
	
	
	
	/**
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
	 */
	point: function(x, y, relative) {
		var point = null;
		if (arguments[0] instanceof Khusamov.svg.geometry.path.Point) {
			point = arguments[0];
			if (arguments.length == 2) point.setRelative(arguments[1]);
		} else {
			if (arguments.length == 1) {
				point = Ext.create("Khusamov.svg.geometry.path.Point", arguments[0]);
			}
			if (arguments.length == 2 && !Ext.isNumber(x)) {
				point = Ext.create("Khusamov.svg.geometry.path.Point", arguments[0], arguments[1]);
			}
			if (arguments.length == 3 || arguments.length == 2 && Ext.isNumber(x)) {
				point = Ext.Array.slice(arguments);
			}
		}
		this.setLastPoint(point);
		return this;
	},
	
	segment: function(segment) {
		segment.setPoint(this.getLastPoint());
		this.setLastPoint(null);
		this.add(segment);
		return this;
	},
	
	line: function() {
		return this.segment(Ext.create("Khusamov.svg.geometry.path.segment.Line"));
	},
	
	arc: function(radius, config) {
		return this.segment(Ext.create("Khusamov.svg.geometry.path.segment.Arc", null, radius, config));
	},
	
	
	close: function() {
		var me = this;
		if (!me.getLastPoint()) me.setClosed(true);
		me.fireEvent("update");
		return me;
	},
	
	
	
	
});