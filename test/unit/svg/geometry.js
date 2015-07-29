
QUnit.module("svg.geometry");

/**
 * Khusamov.svg.geometry.Point
 */
 
Ext.require("Khusamov.svg.geometry.Point");

Ext.onReady(function() {
	
	// Тестирование конструктора
	
	QUnit.test("Khusamov.svg.geometry.Point: Создание точки", function (assert) {
		
		// Тестируемая точка
		var x = 100, y = 200;
		var point = Ext.create("Khusamov.svg.geometry.Point", x, y);
		var pointEqual = Ext.create("Khusamov.svg.geometry.Point", [x, y]);
		
		var distance0 = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
		var angle = Math.atan2(y, x);
		
		// Тесты
		
		assert.ok(point.isPoint, "Это точка");
		assert.equal(point.type, "point", "Тип примитива = точка");
		assert.equal(point.x(), x, "Координата точки X");
		assert.equal(point.y(), y, "Координата точки Y");
		assert.equal(point.distance(), distance0, "Расстояние от точки до начала координат");
		assert.ok(point.equal(pointEqual), "Сравнение точек");
		
		assert.deepEqual(point.getPolar(), [angle, distance0], "Полярные координаты точки");
		assert.equal(point.getRadius(), distance0, "Полярный радиус точки");
		assert.equal(point.getAngle(), angle, "Полярный угол точки в радианах");
		
		var pointObject = {
			type: "point",
			id: point.getId(),
			index: null,
			title: null,
			description: null,
			x: x, 
			y: y
		};
		
		assert.deepEqual(point.toObject(), pointObject, "Преобразование точки в объект");
		assert.deepEqual(point.toArray(), [x, y], "Преобразование точки в массив");
		assert.equal(point.toString(), String(x) + ", " + String(y), "Преобразование точки в строку");
		
	});
	
	// Тестирование перемещения точки
	
	QUnit.test("Khusamov.svg.geometry.Point: Перемещение точки", function (assert) {
		
		// Тестируемая точка
		var x = 100, y = 200;
		var point = Ext.create("Khusamov.svg.geometry.Point", x, y);
		
		// Новое положение точки
		var newCoords = [300, 600];
		var newPoint = Ext.create("Khusamov.svg.geometry.Point", newCoords);
		
		// Тесты
		
		var update = 0;
		point.on("update", function() {
			update++;
		});
		
		assert.ok(point.moveTo(newCoords).equal(newPoint), "Абсолютное перемещение точки");
		assert.ok(point.moveBy([50, 60]).equal(350, 660), "Относительное перемещение точки");
		assert.equal(update, 2, "Генерация события update при перемещении точки");
		
	});
	
	
	
});




/**
 * Khusamov.svg.geometry.equation.Circular
 */
 

Ext.require("Khusamov.svg.geometry.equation.Circular");

Ext.onReady(function() {
	
	// Тестирование окружности
	
	QUnit.test("Khusamov.svg.geometry.equation.Circular: Создание уравнения окружности", function(assert) {
		
		var circular = Ext.create("Khusamov.svg.geometry.equation.Circular", 100, 200, 300);
		
		assert.equal(circular.toString(), "Circular { (x - 100)^2 + (y - 200)^2 = 300^2 }", "Преобразование уравнения окружности в строку");
		
	});
	
});