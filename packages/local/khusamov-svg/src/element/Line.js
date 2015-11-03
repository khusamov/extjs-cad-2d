
Ext.define("Khusamov.svg.element.Line", {
	
	extend: "Khusamov.svg.element.Polyline",
	
	requires: ["Khusamov.svg.geometry.Line"],
	
	xtype: "khusamov-svg-element-line",
    
    isSvgLine: true,
	
	type: "line",
    
    baseCls: Ext.baseCSSPrefix + "khusamov-svg-line",
	
	autoEl: {
		tag: "line"
	},
	
	geometryClass: "Line",
	
	/**
	 * Ext.create("Khusamov.svg.element.Line", x1, y1, x2, y2);
	 * Ext.create("Khusamov.svg.element.Line", [x1, y1], [x2, y2]);
	 * Ext.create("Khusamov.svg.element.Line", Khusamov.svg.geometry.Point, Khusamov.svg.geometry.Point);
	 * Ext.create("Khusamov.svg.element.Line", Khusamov.svg.geometry.Point[]);
	 * Ext.create("Khusamov.svg.element.Line", Mixed[]);
	 * Ext.create("Khusamov.svg.element.Line", Khusamov.svg.geometry.Line);
	 */
	constructor: function(config) {
		var me = this, args = Ext.Array.slice(arguments);
		if (arguments.length == 4) config = [[args[0], args[1]], [args[2], args[3]]];
		if (arguments.length == 2) config = [args[0], args[1]];
		me.callParent([config]);
	},
	
	repaintGeometry: function() {
		var me = this;
		if (me.geometryClass && me.rendered) {
			if (me.getFirstPoint() && me.getLastPoint()) {
				me.getEl().set({
					x1: me.getFirstPoint().x(),
					y1: me.getFirstPoint().y(),
					x2: me.getLastPoint().x(),
					y2: me.getLastPoint().y()
				});
			}
		}
	}
    
}, function(Line) {
	
	Khusamov.svg.Element.override({
		
		statics: {
			
			/**
			 * Создать элемент Линия.
			 * @return {Khusamov.svg.element.Line}
			 */
			createLine: function() {
				return Line.create.apply(Line, arguments);
				//return Ext.create.apply(Ext, ["Khusamov.svg.element.Line"].concat(Ext.Array.slice(arguments)));
			}
			
		}
		
	});
	
});

