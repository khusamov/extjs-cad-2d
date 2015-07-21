
// TODO удалить, класс больше не будет использоваться

Ext.define("Khusamov.svg.geometry.path.Subpath", {
	
	segments: null,
	
	config: {
		
		closed: false,
		
		/**
		 * Последняя точка пути.
		 * @cfg {Khusamov.svg.geometry.path.Point}
		 */
		lastPoint: null
		
	},
	
	constructor: function(config) {
		var me = this;
		me.initConfig(config);
		me.segments = [];
	},
	
	applyLastPoint: function(point) {
		point = Ext.isArray(point) ? Ext.create("Khusamov.svg.geometry.path.Point", point) : point;
		point.setSubpath(this);
		return point;
	},
	
	getLastPoint: function(absolute) {
		return absolute ? this.callParent().toAbsolute() : this.callParent();
	},
	
	add: function(segment) {
		segment.setSubpath(this);
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
	},
	
	isClosed: function() {
		return this.getClosed();
	},
	
	close: function() {
		this.setClosed(true);
	},
	
	open: function() {
		this.setClosed(false);
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
	
	toString: function() {
		var me = this;
		var result = [];
		me.segments.forEach(function(segment) {
			result.push(segment.toString());
		});
		return result.join(" ");
	},
	
	eachSegment: function(fn, scope) {
		this.segments.forEach(fn, scope);
	},
	
	
	
	getPoint: function(index) {
		var segment = this.getSegment(index);
		return segment ? segment.getPoint() : this.getLastPoint();
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
		/*me.points.sortItems(function(item, next) {
			return next.getIndex() - item.getIndex();
		});*/
		
		
		
		/*me.eachPoint(function(point) {
			
		});*/
		
		
		
		var points = me.getPoints().sort(function(point, next) {
			return next.getIndex() - point.getIndex();
		});
		
		/*me.eachSegment(function(segment) {
			
		});*/
		
		this.segments.sort(function(point, next) {
			return next.getIndex() - point.getIndex();
		});
		
		points.forEach(function(point, index) {
			var segment = me.getSegment(index);
			if (segment) {
				segment.setPoint(point);
			} else {
				me.setLastPoint(point);
			}
		});
		
		
		
		return me;
	}
	
	
	
	
	
	
	
	
	
});