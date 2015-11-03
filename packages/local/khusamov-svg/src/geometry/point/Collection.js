

// этот класс нужен был для генерации ID для точек полилинии
// а также для переиндексации элементов
// теперь в примитиве id автоматом генерится - осталась пока переиндексация
// TODO надо бы избавиться от этого класса


Ext.define("Khusamov.svg.geometry.point.Collection", {
	
	extend: "Ext.util.Collection",
	
	requires: ["Ext.data.identifier.Sequential"],
	
	listeners: {
		add: "reindex",
		remove: "reindex"
	},
	
	constructor: function() {
		var me = this;
		me.callParent(arguments);
		me.identifier = Ext.create("Ext.data.identifier.Sequential");
	},
	
	reindex: function() {
		var me = this;
		me.each(function(point, index, length) {
			point.setIndex(index);
			point.isFirst = (index == 0);
			point.isLast = (index == length - 1);
		});
		return me;
	},
	
	add: function(items) {
		var me = this;
		
		if (!Ext.isArray(items)) items = [items];
		items.map(function(item) {
			var key = me.getKey(item);
			if (key === undefined || key === null) me.setKey(item);
			return item;
		});
		
		
		return me.callParent(items);
	},
	
	setKey: function(item, id) {
		id = id || this.identifier.generate();
		if (item.setId) item.setId(id); else item.id = id;
        return this;
	}
	
});