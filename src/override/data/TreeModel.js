
Ext.define("Khusamov.override.data.TreeModel", {
	
	override: "Ext.data.TreeModel",
	
    getPath: function(field, separator) {
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
        return separator + path.join(separator);
    },
	
});