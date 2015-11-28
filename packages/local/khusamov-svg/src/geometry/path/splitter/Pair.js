
/* global Ext */

/**
 * 
 * ПОКА НЕ ИСПОЛЬЗУЕТСЯ
 * 
 * Специальный класс для деления многоугольников 
 * (построенных при помощи объекта Путь).
 */

Ext.define("Khusamov.svg.geometry.path.splitter.Pair", {
	
	requires: ["Khusamov.svg.geometry.path.splitter.Linear"],
	
	
	
	/**
	 * Разбить полигон на две части отрезком, 
	 * зная координаты первой и последней точек отрезка.
	 * Причем координаты задаются следующим образом:
	 * индекс сегмента пути, расстояние от первой точки сегмента.
	 * Третий параметр это тип отрезка (потомок класса Khusamov.svg.geometry.path.segment.Segment).
	 * @param {Object} first
	 * @param {Number} first.index
	 * @param {Number} first.distance
	 * @param {Object} last
	 * @param {Number} last.index
	 * @param {Number} last.distance
	 * @param {Khusamov.svg.geometry.path.segment.Segment} segment
	 */
	splitByPointPair: function(first, last, segment) {
		var me = this;
		
		// МЕТОД ПОКА НЕ ИСПОЛЬЗУЕТСЯ
		
		var firstSegment = me.getSegment(first.index);
		var lastSegment = me.getSegment(last.index);
		
		
		
		var curSegment = lastSegment;
		while (curSegment.getNextSegment().getIndex() != firstSegment.getIndex()) {
			curSegment = curSegment.getNextSegment();
		}
		
		
		
		
		
	}
	
	
	
	
	
	
	
	
	
	
});