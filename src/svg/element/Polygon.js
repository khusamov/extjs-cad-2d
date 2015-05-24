
Ext.define("Khusamov.svg.element.Polygon", {
	
	extend: "Khusamov.svg.element.Polyline",
	
	requires: ["Khusamov.svg.geometry.Polygon"],
	
	xtype: "khusamov-svg-element-polygon",
    
    isSvgPolygon: true,
	
	type: "polygon",
    
    baseCls: Ext.baseCSSPrefix + "khusamov-svg-polygon",
	
	autoEl: {
		tag: "polygon"
	},
	
	geometryClass: "Polygon",
	
	delegates: {
		geometry: {
			getNextPoint: false,
			getPrevPoint: false,
			getPerimeter: false
		}
	}
    
}, function(Polygon) {
	
	Khusamov.svg.Element.override({
		
		statics: {
			
			/**
			 * Создать элемент Полигон.
			 * @return {Khusamov.svg.element.Polygon}
			 */
			createPolygon: function() {
				return Polygon.create.apply(Polygon, arguments);
				//return Ext.create.apply(Ext, ["Khusamov.svg.element.Polygon"].concat(Ext.Array.slice(arguments)));
			}
			
		}
		
	});
	
});