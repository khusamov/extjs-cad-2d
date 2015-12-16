
/* global Ext, Khusamov */

Ext.define("Khusamov.svg.geometry.path.Point", {
	
	extend: "Khusamov.svg.geometry.Point",
	
	config: {
		
		relative: false,
		
		segment: null,
		
		path: null
		
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
		
		me.callParent([config]);
	},
	
	/**
	 * Включить синхронизацию с другой точкой.
	 * @param {Khusamov.svg.geometry.Point} point Синхронизируемая точка. 
	 */
	syncWith: function(point) {
		var me = this;
		if (me.syncListener) me.syncListener.destroy();
		point.on("update", function() {
			me.moveTo(point);
		});
	},
	
	syncDestroy: function() {
		if (this.syncListener) this.syncListener.destroy();
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
	}
	
});