
/* global Ext */

/**
 * @class
 * Класс для создания контура вокруг или внутри примитива.
 * Сейчас поддерживается только Путь.
 * В будущем будут поддерживаться: Окружность, Квадрат и т.п.
 */

Ext.define("Khusamov.svg.geometry.tool.Contour", {
	
	requires: [],
	
	statics: {
		
		/**
		 * Получить контур для примитива.
		 * @param {Khusamov.svg.geometry.Path}
		 * @param {String} type Тип контура inside | outside.
		 * @param {Number | Number[]} Смещение или массив смещений для каждого ребра.
		 * @return {Khusamov.svg.geometry.Path}
		 */
		contour: function(path, type, offset) {
			
		}
		
	}
	
});