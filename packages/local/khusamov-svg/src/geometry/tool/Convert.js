
/* global Ext */

/**
 * @class
 * Класс для конвертации одного примитива в другой.
 */

Ext.define("Khusamov.svg.geometry.tool.Convert", {
	
	uses: ["Khusamov.svg.geometry.Path"],
	
	statics: {
		
		/**
		 * Конвертация полигона в путь.
		 * @param {Khusamov.svg.geometry.Polygon} polygon
		 * @return {Khusamov.svg.geometry.Path}
		 */
		polygonToPath: function(polygon) {
			var result = Ext.create("Khusamov.svg.geometry.Path");
			polygon.eachPoint(function(point) {
				result.point(point).line();
			});
			return result;
		}
		
	}
	
});