
Ext.define("Khusamov.svg.geometry.path.segment.Arc", {
	
	extend: "Khusamov.svg.geometry.path.segment.Segment",
	
	requires: ["Khusamov.svg.geometry.Arc"],
	
	isArcSegment: true,
	
	config: {
		
		/**
		 * Khusamov.svg.geometry.Arc
		 */
		arc: null
		
	},
	
	/**
	 * Ext.create("Khusamov.svg.geometry.path.segment.Arc", arc);
	 * Ext.create("Khusamov.svg.geometry.path.segment.Arc", point, radius);
	 * Ext.create("Khusamov.svg.geometry.path.segment.Arc", point, radius, config);
	 * Внимание, есть возможность point не задавать, для этого нужно вызывать конструктор так:
	 * Ext.create("Khusamov.svg.geometry.path.segment.Arc", null, radius);
	 * Ext.create("Khusamov.svg.geometry.path.segment.Arc", null, radius, config);
	 */
	constructor: function(point, radius, config) {
		var me = this;
		config = config ? { arc: config } : {};
		if (arguments.length == 1) config = point;
		if (point instanceof Khusamov.svg.geometry.Arc) config = { arc: point };
		if (arguments.length > 1) {
			config.arc = config.arc || {};
			if (!Ext.isEmpty(radius)) config.arc.radius = radius;
			if (!Ext.isEmpty(point)) config.point = point;
		}
		me.callParent([config]);
		me.initArcPoints();
	},
	
	getPrimitive: function() {
		return this.getArc();
	},
	
	applyArc: function(arc) {
		if (!(arc instanceof Khusamov.svg.geometry.Arc)) {
			arc = Ext.create("Khusamov.svg.geometry.Arc", arc);
		}
		return arc;
	},
	
	updateArc: function(arc, oldArc) {
		this.onParamUpdate();
		if (oldArc) arc.un("update", "onParamUpdate", this);
		arc.on("update", "onParamUpdate", this);
	},
	
	initArcPoints: function() {
		var me = this, arc = me.getArc();
		if (arc) {
			arc.setFirstPoint(me.getFirstPoint());
			if (me.getLastPoint()) arc.setLastPoint(me.getLastPoint());
		}
	},
	
	updatePoint: function(point, oldPoint) {
		this.callParent(arguments);
		this.initArcPoints();
	},
	
	updatePath: function(path) {
		var me = this;
		
		["add", "splice", "clear", "changelastpoint", "turnout"]
			.forEach(function(eventName) {
				
				//http://javascript.ru/forum/extjs/57614-metod-tostring-v-polzovatelskom-komponente-i-problemy-s-nim.html
				/*path.on(eventName, function() {
					me.initArcPoints();
				});*/
				path.on(eventName, "initArcPoints", me);
			});
			
		me.initArcPoints();
	},
	
	toObject: function() {
		return Ext.Object.merge(this.callParent(), {
			arc: this.getArc().toObject()
		});
	},
	
	toString: function() {
		var me = this, result = "";
		if (me.hasPath()) {
			var arc = me.getArc();
			var point = arc.getLastPoint();
			if (point) {
				result = [];
				
				result.push(point.isRelative() ? "a" : "A");
				
				result.push(arc.getRadius(0));
				result.push(arc.getRadius(1));
				result.push(arc.getRotation());
				result.push(arc.isLarge() ? 1 : 0);
				result.push(arc.isSweep() ? 1 : 0);
				
				result.push(point.toString());
				
				result = me.callParent([result.join(" ")]);
			}
		}
		return result;
	}
	
});