
/**
 * Управление балкой рамы.
 */

Ext.define("Example.handle.BeamGhost", {
	extend: "Khusamov.svg.desktop.Handle",
	
	requires: ["Khusamov.svg.element.Circle"],
	
	initComponent: function() {
		var me = this;
		me.callParent(arguments);
		
		me.add(me.getConfigCircle([-100, -100]));
		me.add(me.getConfigCircle([-100, -100]));
		
	},
	
	applyControled: function(beam) {
		var me = this;
		//var result = me.callParent(arguments);
		
		// Переводим координаты из системы холста в систему панели управления холстом.
		var point0 = me.getSurface().getTransformMatrix().transformPoint(beam.points[0]);
		var point1 = me.getSurface().getTransformMatrix().transformPoint(beam.points[1]);
		
		me.items.get(0).setCenterPoint(point0);
		me.items.get(1).setCenterPoint(point1);
		return beam;
	},
	
	/**
	 * Формирование конфига управляющего кружка.
	 * На входе порядковый номер точки и координаты в системе рабочего стола.
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
				r: 7,
				cursor: "pointer"
			},
			draggable: {
				tolerance: 0,
				listeners: {
					// При перемещении управляющего кружка меняем координату конца балки.
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
		var index = handle.getControled().getIndex();
		if (handle.items.indexOf(circle) == 0) {
			handle.getControled().getFrame().setPoint(index, point);
		} else {
			handle.getControled().getFrame().setNextPoint(index, point);
		}
	},
	
	/**
	 * Обработчик события "Холст изменил свой масштаб".
	 */
	onSurfaceTransform: function() {
		var me = this;
		var beam = me.getControled();

		// Переводим координаты из системы холста в систему панели управления холстом.
		var point0 = me.getSurface().getTransformMatrix().transformPoint(beam.points[0]);
		var point1 = me.getSurface().getTransformMatrix().transformPoint(beam.points[1]);
		
		me.items.get(0).setCenterPoint(point0);
		me.items.get(1).setCenterPoint(point1);
	}
	
});


