
/* global Ext, Khusamov */

/**
 * Специальный класс для деления многоугольников 
 * (построенных при помощи объекта Путь).
 */

Ext.define("Khusamov.svg.geometry.path.splitter.Splitter", {
	
	alternateClassName: "Khusamov.svg.geometry.path.Splitter",
	
	requires: ["Khusamov.svg.geometry.path.splitter.Linear"],
	
	statics: {
		
		/**
		 * Разделить путь.
		 * @param {Khusamov.svg.geometry.Path} path
		 * @param {Khusamov.svg.geometry.Primitive} primitive
		 * @param {Khusamov.svg.geometry.Point} [selPoint] Точка, определяющая какой делитель оставить.
		 * @return {null | Khusamov.svg.geometry.Path[]}
		 */
		split: function(path, primitive, selPoint) {
			var type = Ext.String.capitalize(primitive.type);
			var splitter = Khusamov.svg.geometry.path.splitter[type];
			return splitter.split(path, primitive, selPoint);
		}
	}
	
});