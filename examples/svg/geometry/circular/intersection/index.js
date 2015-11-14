
/**
 * Задача о пересечении окружности и прямой.
 * Необходимо найти пересечения и отобразить их на экране.
 */
	 
Ext.require([
	"Khusamov.svg.Svg",
	"Khusamov.svg.element.Line",
	"Khusamov.svg.element.Circle",
	"Khusamov.svg.geometry.equation.Linear",
	"Khusamov.svg.geometry.equation.Circular",
	"Khusamov.svg.element.Title",
]);

Ext.onReady(function() {
	
	/**
	 * Нахождение пересечения окружности и прямой.
	 */
	
	// Определяем прямую и окружность через их уравнения.
	

	
	var linear = Ext.create("Khusamov.svg.geometry.equation.Linear", -201, -102, 173955);
	var circular = Ext.create("Khusamov.svg.geometry.equation.Circular", 680.889981443295, 218.92467537232847, 100);
	var circular2 = Ext.create("Khusamov.svg.geometry.equation.Circular", 600, 210, 60);
	
	//var circular = Ext.create("Khusamov.svg.geometry.equation.Circular", 793.5364353922048, 284.90424873168536, 134.1525);
	//var circular2 = Ext.create("Khusamov.svg.geometry.equation.Circular", 759.7864613217582, 375.4801902487128, 184.1125);
	
	// Создаем холст.
	
	var svg = Ext.create("Khusamov.svg.Svg", {
		
		renderTo: Ext.getBody(),
		
		width: "100%",
		height: "100%",
		
		style: {
			overflow: "hidden",
			position: "absolute",
			left: "0px",
			top: "0px"
		}
	
	});
	
	// Создаем окружность и добавляем ее на холст.
	
	var circle = svg.add(Ext.create("Khusamov.svg.element.Circle", {
		center: circular.getCenter(),
		radius: circular.getRadius(),
		draggable: true,
		style: {
			stroke: "black",
			strokeWidth: 1,
			fill: "transparent",
			cursor: "pointer"
		}
	}));
	
	// Управляющие линией кружки
	
	var linearPoint1 = Ext.create("Khusamov.svg.geometry.Point", 600, linear.y(600));
	var linearPoint2 = Ext.create("Khusamov.svg.geometry.Point", 800, linear.y(800));
	var linearLine = Ext.create("Khusamov.svg.geometry.Line", linearPoint1, linearPoint2);
	
	svg.add(Ext.create("Khusamov.svg.element.Circle", {
		center: linearPoint1,
		radius: 10,
		draggable: true,
		style: {
			stroke: "black",
			strokeWidth: 1,
			fill: "transparent",
			cursor: "pointer"
		}
	}));
	svg.add(Ext.create("Khusamov.svg.element.Circle", {
		center: linearPoint2,
		radius: 10,
		draggable: true,
		style: {
			stroke: "black",
			strokeWidth: 1,
			fill: "transparent",
			cursor: "pointer"
		}
	}));
	
	
	
	// Создаем вторую окружность и добавляем ее на холст.
	// Для поиска пересечения двух окружностей.
	
	
	svg.add(Ext.create("Khusamov.svg.element.Circle", {
		center: circular2.getCenter(),
		radius: circular2.getRadius(),
		draggable: true,
		style: {
			stroke: "red",
			strokeWidth: 1,
			fill: "transparent",
			cursor: "pointer"
		}
	}));
	
	
	
	
	
	
	
	var linearElements = [];
	function linearRefresh() {
		
		Ext.destroy(linearElements);
		linearElements = [];
		
		// Создаем линию и добавляем ее на холст.
		var linear = linearLine.toLinear();
		//console.log(linear.getAngle("degree"));
		
		var line = Khusamov.svg.Element.createLine(20, linear.y(20), 1000, linear.y(1000));
		line.setStyle({
			stroke: "green",
			strokeWidth: 1
		});
		linearElements.push(svg.add(line));
		
		// Находим их пересечения.
		
		var circular = Ext.create("Khusamov.svg.geometry.equation.Circular", circle.getCenter(), circle.getRadius());
		
		var intersection = circular.intersection(linear);
		
		// Проверяем, есть ли пересечения. 
		
		if (intersection) {
			
			// Если есть, то в цикле отображаем их в виде маленьких кружочков.
			
			intersection.forEach(function(point) {
				var circle = Khusamov.svg.Element.createCircle(point, 4);
				circle.setStyle({
					stroke: "green",
					strokeWidth: 0,
					fill: "green"
				});
				linearElements.push(svg.add(circle));
			});
			
		}
		
		/**
		 * Подзадача. Найти пересечение двух окружностей.
		 */
		
		
		var intersection2 = circular.intersection(circular2);
		//var intersection2 = circular2.intersection(circular);
		
		
		// Проверяем, есть ли пересечения. 
		
		if (intersection2) {
			
			// Если есть, то в цикле отображаем их в виде маленьких кружочков.
			
			intersection2.forEach(function(point, index) {
				var circle = Khusamov.svg.Element.createCircle(point, 4);
				circle.setStyle({
					stroke: "red",
					strokeWidth: 0,
					fill: "red"
				});
				linearElements.push(svg.add(circle));
				var title = Khusamov.svg.Element.createTitle(index + 1);
				circle.add(title);
			});
			
		}
		
	}
	
	linearRefresh();
	linearPoint1.on("update", linearRefresh);
	linearPoint2.on("update", linearRefresh);
	circular.getCenter().on("update", linearRefresh);
	circular2.getCenter().on("update", linearRefresh);
	
});


