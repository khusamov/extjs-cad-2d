
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
		 * @return {null | Khusamov.svg.geometry.Path[]}
		 */
		split: function(path, primitive) {
			var type = Ext.String.capitalize(primitive.type);
			var splitter = Khusamov.svg.geometry.path.splitter[type];
			return splitter.split(path, primitive);
			
			
			
			
			
			
			/*var prefix = "Khusamov.svg.geometry.path.splitter.";
			
			var classname = prefix + type;
			
			var splitter = Ext.create(classname);
			
			return splitter.split(path, primitive);*/
			
			//var method = "splitWith" + Ext.String.capitalize(primitive.type);
			//return this[method].call(this, path, primitive);
		}
	}
	
});