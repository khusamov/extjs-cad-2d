
Ext.define("Khusamov.svg.element.Polyline", {
	
	extend: "Khusamov.svg.element.Element",
	
	requires: ["Khusamov.svg.geometry.Polyline"],
	
	xtype: "khusamov-svg-element-polyline",
    
    isSvgPolyline: true,
	
	type: "polyline",
    
    baseCls: Ext.baseCSSPrefix + "khusamov-svg-polyline",
	
	autoEl: {
		tag: "polyline"
	},
	
	geometryClass: "Polyline",
	
	/**
	 * Ext.create("Khusamov.svg.element.Polyline");
	 * Ext.create("Khusamov.svg.element.Polyline", String);
	 * Ext.create("Khusamov.svg.element.Polyline", Array[x, y][]);
	 * Ext.create("Khusamov.svg.element.Polyline", Khusamov.svg.geometry.Point[]);
	 * Ext.create("Khusamov.svg.element.Polyline", Khusamov.svg.geometry.Polyline);
	 */
	constructor: function(config) {
		var me = this;
		
		if (
			Ext.isString(config) ||
			Ext.isArray(config) ||
			config instanceof Khusamov.svg.geometry.Polyline
		) {
			config = { geometry: config };
		}
		
		me.callParent([config]);
	},
	
	delegates: {
		geometry: {
			addPoint: true,
			addPoints: true,
			movePoint: true,
			each: true,
			clear: true,
			removePoint: true,
			insertPoints: false,
			getMiddlePoint: false,
			getLastPoint: false,
			getFirstPoint: false,
			getPrevPoint: false,
			getNextPoint: false,
			getPoint: false,
			getPointById: false,
			getCount: false,
			getLength: false
		}
	}
	
}, function(Polyline) {
	
	Khusamov.svg.Element.override({
		
		statics: {
			
			/**
			 * Создать элемент Полилиния.
			 * @return {Khusamov.svg.element.Polyline}
			 */
			createPolyline: function() {
				return Polyline.create.apply(Polyline, arguments);
				//return Ext.create.apply(Ext, ["Khusamov.svg.element.Polyline"].concat(Ext.Array.slice(arguments)));
			}
			
		}
		
	});
	
});