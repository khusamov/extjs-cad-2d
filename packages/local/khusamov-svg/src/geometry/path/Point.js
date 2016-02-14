
/* global Ext, Khusamov */

// TODO При рефакторинге от синхронизации надо избавиться, что-то есть в этом нездоровое.
// Это используется в делении многоугольников прямой линией

Ext.define("Khusamov.svg.geometry.path.Point", {
	
	extend: "Khusamov.svg.geometry.Point",
	
	config: {
		
		relative: false,
		
		segment: null,
		
		path: null
		
	},
	
	statics: {
		
		/**
		 * Проверка, являются ли точки на входе синхронизированными или нет.
		 * Разные объекты точек могут быть синхронизированы от одной точки, такие точки 
		 * тоже являются синхронизированые и это обстоятельство проверяется данной функцией.
		 */
		isSyncPoints: function() {
			var me = this, syncPoints = [];
			Ext.Array.each(arguments, function(point) {
				syncPoints.push(me.getSyncPointOrSelf(point, true));
			});
			var first, result = true;
			syncPoints.forEach(function(point) {
				if (first) {
					if (point != first) result = false;
				} else {
					first = point;
				}
			});
			return result;
		},
		
		/**
		 * @private
		 * @param {Khusamov.svg.geometry.Point} point
		 * @param {Boolean} deep
		 * @return {Khusamov.svg.geometry.Point | Khusamov.svg.geometry.path.Point}
		 */
		getSyncPointOrSelf: function(point, deep) {
			return point instanceof Khusamov.svg.geometry.path.Point ? point.getSyncPointOrSelf(deep) : point;
		}
		
	},
	
	/**
	 * Ext.create("Khusamov.svg.geometry.Point", x, y, relative);
	 * Ext.create("Khusamov.svg.geometry.Point", Array[x, y], relative);
	 * Ext.create("Khusamov.svg.geometry.Point", Khusamov.svg.geometry.Point, relative);
	 * Ext.create("Khusamov.svg.geometry.Point", Array[x, y, relative]);
	 */
	constructor: function(config) {
		var me = this;
		if (arguments.length == 1 && Ext.isArray(config)) {
			config = { x: config[0], y: config[1], relative: config[2] };
		}
		if (arguments.length == 2 && Ext.isArray(config)) {
			config = { x: config[0], y: config[1], relative: arguments[1] };
		}
		if (arguments.length == 1 && config instanceof Khusamov.svg.geometry.Point) {
			this.syncWith(config);
			config = { x: config.x(), y: config.y() };
		}
		if (arguments.length == 2 && config instanceof Khusamov.svg.geometry.Point) {
			this.syncWith(config);
			config = { x: config.x(), y: config.y(), relative: arguments[1] };
		}
		if (arguments.length == 3) {
			config = { x: arguments[0], y: arguments[1], relative: arguments[2] };
		}
		
		/**
		 * @private
		 * @property {Object}
		 */
		me.syncListener = null;
		
		/**
		 * @private
		 * @property {Khusamov.svg.geometry.Point}
		 */
		me.syncPoint = null;
		
		me.callParent([config]);
	},
	
	/**
	 * Включить синхронизацию с другой точкой.
	 * @param {Khusamov.svg.geometry.Point} point Синхронизируемая точка. 
	 */
	syncWith: function(point) {
		var me = this;
		me.syncDestroy();
		me.syncPoint = point;
		me.syncListener = point.on({
			destroyable: true,
			update: function() {
				me.moveTo(point);
			}
		});
	},
	
	hasSyncPoint: function() {
		return !!this.syncPoint;
	},
	
	/**
	 * Получить точку, с которой синхронизирована данная точка.
	 * @param {Boolean} deep Если этот параметр = true, то будет найдена корневая точка.
	 * @return {null | Khusamov.svg.geometry.Point}
	 */
	getSyncPoint: function(deep) {
		var me = this, result = null, PathPoint = Khusamov.svg.geometry.path.Point;
		if (me.syncPoint) {
			result = me.syncPoint;
			if (deep && result instanceof PathPoint && result.hasSyncPoint()) {
				result = result.getSyncPoint(deep);
			}
		}
		return result;
	},
	
	getSyncPointOrSelf: function(deep) {
		var result = this.getSyncPoint(deep);
		return result ? result : this;
	},
	
	syncDestroy: function() {
		if (this.syncListener) {
			this.syncListener.destroy();
			this.syncListener = null;
			this.syncPoint = null;
		}
	},
	
	unlinkSegment: function() {
		this.setSegment(null);
	},
	
	updateSegment: function(segment, oldSegment) {
		if (oldSegment) oldSegment.setPoint(null);
	},
	
	applyRelative: function(value) {
		return !!value;
	},
	
	toString: function() {
		return String(this.x()) + " " + String(this.y());
	},
	
	isRelative: function() {
		return (this.getSegment() && this.getSegment().isFirst()) ? false : this.getRelative();
	},
	
	toAbsolute: function() {
		var point = this.clone();
		var segment = this.getSegment() ? this.getSegment().getPrevSegment() : this.getPath().getLastSegment();
		return this.isRelative() ? point.move(segment.getLastPoint(true)) : point;
	},
	
	getEdge: function() {
		return this.getSegment();
	}
	
});