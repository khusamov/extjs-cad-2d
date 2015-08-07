
/**
 * Управление эскизом рамы окна (когда только намечается контур рамы пунктирными линиями).
 * При добавлении вершины рамы добавляется управляющий кружок.
 */

Ext.define("Example.handle.FrameGhost", {
	extend: "Khusamov.svg.desktop.Handle",
	
	requires: ["Khusamov.svg.element.Circle"],
	
	config: {
		frameghost: null
	},
	
	initComponent: function() {
		var me = this;
		me.callParent(arguments);
		// Задаем обработчик события "Добавление точки в эскиз рамы".
		// При добавлении вершины рамы добавляется управляющий кружок.
		me.getFrameghost().on("addpoint", "onAddPoint", me);
	},
	
	/**
	 * Обработчик события "Добавление точки в эскиз рамы".
	 * На входе порядковый номер точки и координаты в системе холста.
	 */
	onAddPoint: function(index, point) {
		var me = this;
		// Переводим координаты из системы холста в систему панели управления холстом.
		point = me.getSurface().getTransformMatrix().transformPoint(point);
		// Добавляем управляющий кружок для данной точки.
		var circle = me.add(me.getConfigCircle(point));
		// Запретить передачу события клика по кружку, 
		// чтобы в данном месте не появилась новая вершина эскиза рамы.
		circle.getEl().on("click", function(e) {
			e.stopEvent();
			// Если кликнули по первой точке, то генерируем событие
			var index = me.items.indexOf(circle);
			if (index == 0) me.fireEvent("close");
		});
	},
	
	/**
	 * Формирование конфига управляющего кружка.
	 * На входе координаты в системе рабочего стола.
	 */
	getConfigCircle: function(point) {
		var me = this;
		return {
			type: "circle",
			attributes: {
				cx: point[0],
				cy: point[1],
				stroke: "white",
				"stroke-width": 1.5,
				fill: "#157fcc",
				r: 10,
				cursor: "pointer"
			},
			draggable: {
				tolerance: 0,
				listeners: {
					// При перемещении управляющего кружка меняем координату вершины рамы.
					drag: me.onCircleMove
				}
			}
		};
	},
	
	/**
	 * Обработчик события "Перемещение управляющего кружка".
	 * Контекстом (this) является Ext.util.ComponentDragger.
	 */
	onCircleMove: function() {
		var dragger = this;
		var circle = dragger.comp;
		var handle = circle.up();
		var matrix = handle.getSurface().getTransformMatrix();
		// При перемещении управляющего кружка меняем координату вершины рамы.
		// Переводим координаты из системы рабочего стола в систему холста.
		var point = matrix.inverse().transformPoint(circle.getCenterPoint());
		// Изменяем координаты точки эскиза рамы
		var index = handle.items.indexOf(circle);
		handle.getFrameghost().setPoint(index, point);
	},
	
	/**
	 * Обработчик события "Холст изменил свой масштаб".
	 */
	onSurfaceTransform: function() {
		var me = this;
		// При масштабировании холста в цикле меняем координаты всех управляющих кружков.
		me.items.each(function(circle) {
			// Получаем точку эскиза рамы по номеру.
			var index = me.items.indexOf(circle);
			var point = me.getFrameghost().getPoint(index);
			// Переводим координаты из системы холста в систему рабочего стола.
			point = me.getSurface().getTransformMatrix().transformPoint(point);
			// Устанавливаем новые координаты кружка.
			circle.setCenterPoint(point);
		});
	}
	
});


