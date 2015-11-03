
/**
 * Полигон (замкнутая полилиния) на плоскости.
 * Длина складывается как длина полилинии плюс длина отрезка между последней точкой и первой.
 * Команды получения следующей точки и предыдущей зациклены.
 */

Ext.define("Khusamov.svg.geometry.Polygon", {
	
	extend: "Khusamov.svg.geometry.Polyline",
	
	isPolygon: true,
	
	type: "polygon",
	
	/**
	 * Получить точку, следующую за index.
	 * Если это последняя точка, то будет выдана первая.
	 * @return Khusamov.svg.geometry.Point
	 */
	getNextPoint: function(index) {
		var me = this;
		var result = me.callParent([index]);
		return result ? result : me.getFirstPoint();
	},
	
	/**
	 * Получить точку, предыдущую перед index.
	 * Если это первая точка, то будет выдана последняя.
	 * @return Khusamov.svg.geometry.Point
	 */
	getPrevPoint: function(index) {
		var me = this;
		var result = me.callParent([index]);
		return result ? result : me.getLastPoint();
	},
	
	getPerimeter: function() {
		return this.getLength();
	},
	
	toPolyline: function() {
		return Ext.create("Khusamov.svg.geometry.Polyline", this.toArray());
	}
	
}, function() {
	
	Khusamov.svg.geometry.Polyline.override({
		
		toPolygon: function() {
			return Ext.create("Khusamov.svg.geometry.Polygon", this.toArray());
		}
		
	});
	
});


