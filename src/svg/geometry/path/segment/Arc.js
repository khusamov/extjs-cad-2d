
Ext.define("Khusamov.svg.geometry.path.segment.Arc", {
	
	extend: "Khusamov.svg.geometry.path.segment.Segment",
	
	requires: ["Khusamov.svg.geometry.Arc"],
	
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
		config = config || {};
		if (arguments.length == 1) config = point;
		if (point instanceof Khusamov.svg.geometry.Arc) config = { arc: point };
		if (arguments.length > 1) {
			config.arc = {};
			if (!Ext.isEmpty(radius)) config.arc.radius = radius;
			if (!Ext.isEmpty(point)) config.point = point;
		}
		me.callParent([config]);
		me.initArcPoints();
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
		if (this.getArc()) {
			this.getArc().setFirstPoint(this.getFirstPoint());
			if (this.getLastPoint()) this.getArc().setLastPoint(this.getLastPoint());
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
				path.on(eventName, function() {
					me.initArcPoints();
				});
				
			});
			
		me.initArcPoints();
	},
	
	toString: function() {
		var me = this, result = "";
		if (me.hasPath()) {
			result = [];
			var arc = me.getArc();
			var point = arc.getLastPoint();
			if (point) {
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