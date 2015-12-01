
/* global Ext, Khusamov */

/**
 * Вектор на плоскости.
 * Потомок точки, конструктор аналогичный.
 */

Ext.define("Khusamov.svg.geometry.vector.Vector", {
	
	alternateClassName: "Khusamov.svg.geometry.Vector",
	
	extend: "Khusamov.svg.geometry.Point",
	
	requires: ["Khusamov.svg.geometry.Angle"],
	
	uses: ["Khusamov.svg.geometry.equation.Linear"],
	
	type: "vector",
	
	isVector: true,
	
	/**
	 * Получить модуль (длину) вектора.
	 * @chainable
	 * @return Number
	 */
	getLength: function() {
		return this.getRadius();
	},
	
	/**
	 * Установить модуль (длину) вектора.
	 * @chainable
	 * @param value Number
	 * @return Khusamov.svg.geometry.vector.Vector
	 */
	setLength: function(length) {
		return this.setRadius(length);
	},
	
	/**
	 * Получить единичный вектор, равный по направлению исходному.
	 * Он же направляющий вектор (единичный, равный по направлению).
	 * Создается новый вектор, а исходный вектор не меняется.
	 * @return Khusamov.svg.geometry.vector.Vector
	 */
	getIdentity: function() {
		return this.clone().setLength(1);
	},
	
	/**
	 * Нормаль вектора (единичный вектор, перпендикулярный исходному).
	 * Создается новый вектор, а исходный вектор не меняется.
	 * @return Khusamov.svg.geometry.vector.Vector
	 */
	getNormal: function() {
		return this.clone().rotate(Math.PI / 2).setLength(1);
		
		// TODO 
		/* проверить эту формулу нахождения перпендикулярного вектора
				a: 1 / parallel.x(),
				b: -1 / parallel.y(),
		*/
	},
	
	/**
	 * Создать линейное уравнение перпендикулярной прямой, проходящей через точку.
	 * @return Khusamov.svg.geometry.equation.Linear
	 */
	getNormalLinear: function(point) {
		return Khusamov.svg.geometry.equation.Linear.createByParallel(this.getNormal(), point);
	},
	
	/**
	 * Создать линейное уравнение паралельной прямой, проходящей через точку.
	 * @return Khusamov.svg.geometry.equation.Linear
	 */
	getParallelLinear: function(point) {
		return Khusamov.svg.geometry.equation.Linear.createByParallel(this.getIdentity(), point);
	},
	
	/**
	 * Получить угол между двумя векторами.
	 * http://hystory-for-vki.narod.ru/index/0-36
	 * http://ru.onlinemschool.com/math/library/vector/angl/
	 * @param value Khusamov.svg.geometry.vector.Vector
	 * @return Number
	 */
	getAngleTo: function(vector, unit, fixed) {
		// В итоге обсуждений:
		// https://goo.gl/cMH2dC (проблема с погрешностью )
		// https://toster.ru/q/270808
		// http://goo.gl/rWIIX4
		// ...найдены два способа вычисления угла:
		// По стандартной формуле:
		var cos = this.multiply(vector) / (this.getLength() * vector.getLength());
		var result = Math.acos(cos < 0 ? Math.max(cos, -1.0) : Math.min(cos, 1.0));
		// И вариант с использование функции Math.atan2(y, x):
		// var result = Math.abs(this.getAngle() - vector.getAngle())
		return Ext.create("Khusamov.svg.geometry.Angle", result).get(unit, fixed);
	},
	
	// @deprecated
	angleTo: function() {
		return this.getAngleTo.apply(this, arguments);
	},
	
	/**
	 * Получить угол вектора, относительно другого вектора (будто бы он является осью Ох).
	 */
	getAngleBy: function(vector, unit, fixed) {
		var result = this.getAngle() - vector.getAngle();
		result = result >= 0 ? result : this.getAngle() + (2 * Math.PI - vector.getAngle());
		return Ext.create("Khusamov.svg.geometry.Angle", result).get(unit, fixed);
	},
	
	/**
	 * Сложение векторов.
	 * Создается новый вектор (как сумма), а исходные вектора не меняется.
	 * @chainable
	 * @param vector Khusamov.svg.geometry.vector.Vector
	 * @return Khusamov.svg.geometry.vector.Vector
	 */
	add: function(vector) {
		return new this.self(this.x() + vector.x(), this.y() + vector.y());
	},
	
	/**
	 * Разность (вычитание) векторов.
	 * Создается новый вектор (как разность), а исходные вектора не меняется.
	 * @chainable
	 * @param vector Khusamov.svg.geometry.vector.Vector
	 * @return Khusamov.svg.geometry.vector.Vector
	 */
	sub: function(vector) {
		return new this.self(this.x() - vector.x(), this.y() - vector.y());
	},
	
	/**
	 * Скалярное произведение векторов.
	 * @chainable
	 * @param vector Khusamov.svg.geometry.vector.Vector
	 * @return Number
	 */
	multiply: function(vector) {
		//return this.getLength() * vector.getLength() * Math.cos(this.getAngleTo(vector));
		return this.x() * vector.x() + this.y() * vector.y();
	},
	
	/**
	 * Умножение вектора на число.
	 * Создается новый вектор, а исходный вектор не меняется.
	 * @chainable
	 * @param scale Number
	 * @return Khusamov.svg.geometry.vector.Vector
	 */
	scale: function(scale) {
		return new this.self(this.x() * scale, this.y() * scale);
	},
	
	/**
	 * Инверсия вектора (обратный вектор).
	 * @return Khusamov.svg.geometry.vector.Vector
	 */
	inverse: function() {
		return this.moveTo(-this.x(), -this.y());
	},
	
	/**
	 * Повернуть вектор на определенный угол.
	 * @chainable
	 * @param angle Number
	 * @return Khusamov.svg.geometry.vector.Vector
	 */
	rotate: function(angle) {
		
		return this.moveTo(
			this.getLength() * Math.cos(this.getAngle() + angle),
			this.getLength() * Math.sin(this.getAngle() + angle)
		);
		//return this.setAngle(this.getAngle() + angle);
	},
	
	/**
	 * Получить точку вектора.
	 * @return {Khusamov.svg.geometry.Point}
	 */
	toPoint: function() {
		return Ext.create("Khusamov.svg.geometry.Point", this);
	},
	
	/**
	 * Возвращает истину, если вектора коллинеарные (по сути паралелльные).
	 * @param {Khusamov.svg.geometry.vector.Vector} vector Вектор, с которым происходит сравнение.
	 * @param {Boolean} [codirectional]
	 * Для определения сонаправленности используйте опцию codirectional:
	 * Если codirectional === true, то возвращает true, если вектора коллинеарные и сонаправленные.
	 * Если codirectional === false, то возвращает true, если вектора коллинеарные и разнонаправленные.
	 * @return {Boolean}
	 */
	isCollinear: function(vector, codirectional) {
		var length = this.getLength() * vector.getLength();
		var multiply = this.multiply(vector);
		var isCollinear = Math.abs(multiply) == length;
		if (codirectional === undefined) return isCollinear;
		if (codirectional === true) return isCollinear && multiply > 0;
		if (codirectional === false) return isCollinear && multiply < 0;
	},
	
	/**
	 * Возвращает истину, если вектора сонаправлены.
	 * @param {Khusamov.svg.geometry.vector.Vector} vector Вектор, с которым происходит сравнение.
	 * @return {Boolean}
	 */
	isCodirectional: function(vector) {
		return this.isCollinear(vector, true);
	}
	
}, function(Vector) {
	
	Khusamov.svg.geometry.Point.override({
		
		toVector: function() {
			return new Vector(this);
		}
		
	});
	
});


