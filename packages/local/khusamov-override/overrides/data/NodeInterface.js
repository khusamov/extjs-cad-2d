
/* global Ext */

Ext.define("Khusamov.override.data.TreeModel", {
	
	override: "Ext.data.NodeInterface",
	
    /**
     * Gets the hierarchical path from the root of the current node.
     * Изменения по сравнению с официальным Ext.data.NodeInterface.getPath:
     * 1. Пропускаем пустые элементы пути.
     * 2. Добавлена опция withoutFirstSeparator.
     * @param {String} [field] Имя поля, на основании значений которого строится путь. 
     * По умолчанию равен значению поля, название которого хранится в Model.idProperty.
     * @param {String} [separator='/'] Использовать разделитель.
     * @param {String} [withoutFirstSeparator=false] Пропустить первый разделитель.
     * @return {String} The node path
     */
    getPath: function(field, separator, withoutFirstSeparator) {
        field = field || this.idProperty;
        separator = separator || '/';

        var path = [this.get(field)],
            parent = this.parentNode;

        while (parent) {
        	var cur = Ext.String.trim(parent.get(field));
        	// Пустые элементы пропускаем.
        	if (cur) path.unshift(cur);
            parent = parent.parentNode;
        }
        return (withoutFirstSeparator ? "" : separator) + path.join(separator);
    }
	
});