
/* global Ext */

Ext.define("Khusamov.svg.geometry.path.splitter.linear.DividerSet", {
	
	requires: ["Khusamov.svg.geometry.path.splitter.linear.Divider"],
	
	/**
	 * @param {Khusamov.svg.geometry.Path} path Исходный многоугольник.
	 * @param {Khusamov.svg.geometry.equation.Linear} linear Прямая линия делитель многоугольника.
	 * @param {Khusamov.svg.geometry.Point} [selPoint] Точка, определяющая какой делитель оставить.
	 */
	constructor: function(path, linear, selPoint) {
		var me = this;
		
		/**
		 * Массив пересечений.
		 * @private
		 * @property {Khusamov.svg.geometry.Point[]}
		 */
		me.intersection = path.intersection(linear, true) || [];
		
		/**
		 * Массив делителей.
		 * @private
		 * @property {Khusamov.svg.geometry.path.splitter.linear.Divider[]}
		 */
		me.dividers = [];
		
		if (me.intersection) {
			
			// Если определена точка, указывающая на выбранный делитель, 
			// то остальные делители из массива intersection удаляем.
			if (selPoint) me.intersection = me.selectDivider(me.intersection, selPoint);
			
			// Собрать массив делителей.
			var start;
			me.intersectionEach(function(point, index) {
				if (index % 2 == 0) {
					start = point;
				} else {
					me.dividers.push(Ext.create("Khusamov.svg.geometry.path.splitter.linear.Divider", start, point));
				}
			});
			
		}
	},
	
	/**
	 * Цикл по всем делителям.
	 * @param {Function} callback
	 * @param {Khusamov.svg.geometry.path.splitter.linear.Divider} callback.divider
	 * @param {Number} callback.index
	 * @param {Object} [scope]
	 */
	each: function(callback, scope) {
		this.dividers.forEach(callback, scope);
	},
	
	/**
	 * Цикл по всем точкам пересечений.
	 */
	intersectionEach: function(callback, scope) {
		this.intersection.forEach(callback, scope);
	},
		
	/**
	 * Удалить все делители кроме выбранного.
	 * Выбранный определяется точкой selPoint, которая находится на отрезке выбранного делителя.
	 * @private
	 * @param {Khusamov.svg.geometry.Point[]} intersection
	 * @param {Khusamov.svg.geometry.Point} selPoint
	 * @return {Khusamov.svg.geometry.Point[]} intersection
	 */
	selectDivider: function(intersection, selPoint) {
		var result = intersection, start;
		intersection.forEach(function(point, index) {
			if (index % 2 == 0) {
				start = point;
			} else {
				var divider = Ext.create("Khusamov.svg.geometry.Line", start, point);
				if (divider.contains(selPoint)) {
					result = [start, point];
				}
			}
		});
		return result;
	},
	
	/**
	 * Проверить точку пересечения с порядковым номером index, 
	 * где лежит ее парная точка (с порядковым номером index + 1): 
	 * на том же сегменте или нет.
	 * Иными словами проверка случая, когда сегмент-дуга пересечен дважды.
	 * Пояснение: Если в многоугольнике есть дуги, то линия пересечения 
	 * может дугу пересечь в двух местах. И этот случай обсчитывается отдельно.
	 * @param {Khusamov.svg.geometry.Point[]} intersection
	 * @param {Number} index
	 * @return {Boolean}
	 */
	himself: function(index) {
		var me = this;
		index = Number(index);
		var segment1 = me.intersection[index].segment;
		var segment2 = me.intersection[index + (index % 2 == 0 ? +1 : -1)].segment;
		return segment1.index == segment2.index;
	},
	
	/**
	 * Определить местоположение сегмента относительно делителей.
	 * Учитывается ситуация, если один из делителей удален из intersection.
	 * @param {Khusamov.svg.geometry.Point[]} intersection
	 * @param {Number} segmentIndex
	 * @return {Number} 1 | -1
	 */
	getSegmentLocation: function(segmentIndex) {
		var me = this;
		var result = 1;
		if (segmentIndex > me.intersection[0].segment.index) {
			me.intersection.forEach(function(point, index) {
				var isLast = index == me.intersection.length - 1;
				var start = point.segment.index;
				var end = isLast ? 0 : me.intersection[index + 1].segment.index;
				if (segmentIndex > start && (isLast || segmentIndex < end)) {
					result = index % 2 == 0 ? -1 : 1;
				}
			});
		}
		return result;
	}
	
});