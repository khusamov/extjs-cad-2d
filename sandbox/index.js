
Ext.Loader.setPath("Khusamov.svg", "../../src");
Ext.Loader.setPath("Zevs", "../../examples/zevs/app");
Ext.require("Khusamov.svg.override.dom.Element");

// — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —

Ext.ClassManager.registerPostprocessor("delegates", function(name, cls, data) {
	var overrideConfig = {};
	Ext.Object.each(data.delegates, function(delegate, methods) {
		Ext.Object.each(methods, function(delegateMethodName, method) {
			method = Ext.isObject(method) ? method : { chainable: method };
			var overrideMethodName = method.name ? method.name : delegateMethodName;
			overrideConfig[overrideMethodName] = function() {
				var result = this[delegate][delegateMethodName].apply(this[delegate], arguments);
				return method.chainable ? this : result;
			};
		});
	});
	cls.override(overrideConfig);
});

// — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —

// Песочница

Ext.require([
	"Zevs.model.project.Item", 
	"Zevs.model.project.Project", 
	"Zevs.model.project.Construction"
]);

Ext.onReady(function() {
	
	Ext.create("Ext.data.Store", {
		storeId: "items",
		model: "Zevs.model.project.Item",
		autoLoad: true,
		proxy: {
			type: "memory"
		},
		data: [{
			id: 1,
			itemType: "project"
		}, {
			id: 2,
			itemType: "construction"
		}]
	});
	
	Ext.create("Ext.data.Store", {
		storeId: "projects",
		model: "Zevs.model.project.Project",
		autoLoad: true,
		proxy: {
			type: "memory"
		},
		data: [{
			id: 1
		}]
	});
	
	Ext.create("Ext.data.Store", {
		storeId: "constructions",
		model: "Zevs.model.project.Construction",
		autoLoad: true,
		proxy: {
			type: "memory"
		},
		data: [{
			id: 1,
			projectId: 1
		}]
	});
	
	var projects = Ext.data.StoreManager.lookup("projects");
	
	//console.info(projects.first());
	
});



// — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —

// Песочница № 2
/*
Ext.require([
	"Khusamov.svg.Svg", 
	"Khusamov.svg.element.Line",
	"Khusamov.svg.element.Polyline",
	"Khusamov.svg.element.Circle"
]);

Ext.onReady(function() {
	
	// Создаем SVG холст
	
	var svg = Khusamov.svg.Element.createSvg({
		
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

	var line = Khusamov.svg.Element.createLine([[100, 100], [320, 170]]);
	line.setStyle({
		stroke: "green",
		strokeWidth: 1
	});
	svg.add(line);
	
	
	var circle = Khusamov.svg.Element.createCircle({
		center: [320, 170],
		radius: 10,
		draggable: {
			listeners: {
				drag: function() {
					line.getLastPoint().move(circle.getCenter());
				}
			}
		}
	});
	circle.setStyle({
		stroke: "green",
		strokeWidth: 1,
		fill: "transparent",
		cursor: "pointer"
	});
	svg.add(circle);
	
	
	
	var parallel = line.getGeometry().getParallelByDestination(-40);
	parallel = Khusamov.svg.Element.createLine(parallel);
	parallel.setStyle({
		stroke: "green",
		strokeWidth: 1
	});
	svg.add(parallel);
	
	
	
	

	var lineRed = Khusamov.svg.Element.createLine();
	lineRed.setStyle({
		stroke: "red",
		strokeWidth: 1
	});
	svg.add(lineRed);
	
	
	
	line.on("update", function() {
		parallel.setGeometry(line.getGeometry().getParallelByDestination(-40));
		
		
		
		
		
		lineRed.setGeometry([
			[100, 100],
			//line.getLastPoint().toVector().clone().toPoint()
			line.getLastPoint().toVector().getIdentity().scale(200).toPoint()
			//line.getLastPoint().toVector().getNormal().scale(200).toPoint().moveBy([100, 100])
			//line.getGeometry().toLinear().getParallel().scale(200).toPoint().moveBy([100, 100])
			//line.getGeometry().toLinear().getNormal().scale(200).toPoint().moveBy([100, 100])
		]);
		
		
		//console.log(line.getLastPoint().toVector().getNormal().getLength());
		
	});
	
	
});

*/





// — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — — —

// Песочница № 3

Ext.require([
	"Khusamov.svg.Svg", 
	"Khusamov.svg.element.Line",
	"Khusamov.svg.element.Polyline",
	"Khusamov.svg.element.Circle",
	"Khusamov.svg.element.Group",
	"Khusamov.svg.geometry.vector.Vector"
]);

Ext.onReady(function() {
	
	// Создаем SVG холст
	
	var svg = Khusamov.svg.Element.createSvg({
		
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
	
	// Координатные оси
	
	var group = Khusamov.svg.Element.createGroup();
	svg.add(group);
	
	var sizeCoodLine = 300;
	group.transform.translate(sizeCoodLine + 20, sizeCoodLine + 20);
	
	group.add(Khusamov.svg.Element.createLine([[0, sizeCoodLine], [0, -sizeCoodLine]]).setStyle({
		stroke: "gray",
		strokeWidth: 1
	}));
	group.add(Khusamov.svg.Element.createLine([[sizeCoodLine, 0], [-sizeCoodLine, 0]]).setStyle({
		stroke: "gray",
		strokeWidth: 1
	}));
	
	/*
	// Отрисовка вектора vector в виде линии
	
	var vector = Khusamov.svg.geometry.Vector.create(100, 100);
	

	var line = Khusamov.svg.Element.createLine();
	line.setStyle({
		stroke: "green",
		strokeWidth: 1
	});
	line.setGeometry([[0, 0], vector.toPoint()]);
	group.add(line);
	
	vector.on("update", function() {
		line.setGeometry([[0, 0], vector.toPoint()]);
	});
	
	
	
	// Управляющий вектором кружок
	
	var circle = Khusamov.svg.Element.createCircle({
		center: vector.toPoint(),
		radius: 10,
		draggable: true
	});
	circle.setStyle({
		stroke: "green",
		strokeWidth: 1,
		fill: "transparent",
		cursor: "pointer"
	});
	group.add(circle);
	
	circle.dd.on("drag", function() {
		vector.move(circle.getCenter());
	});
	*/
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	
	
	// Нормальный вектор к исходному вектору vector
	/*
	var vectorNormal = vector.getNormal().scale(100);
	
	var lineNormal = Khusamov.svg.Element.createLine();
	lineNormal.setStyle({
		stroke: "red",
		strokeWidth: 1
	});
	lineNormal.setGeometry([[0, 0], vectorNormal.toPoint()]);
	group.add(lineNormal);
	
	
	vector.on("update", function() { // обновление исходного вектора влечет обновление его нормали
		vectorNormal.move(vector.getNormal().scale(100).toPoint());
		//vectorNormal.move(vector.getIdentity().scale(100).toPoint());
	});
	vectorNormal.on("update", function() { // обновление нормали ведет к обновлению линии, отражающей нормальный вектор
		lineNormal.setGeometry([[0, 0], vectorNormal.toPoint()]);
	});
	*/
	
	
	
	// Перпендикуляр к исходному вектору в середине (и на концах) его линии
	// на основе вычисления уравнения 
	
	// ЗДЕСЬ ПРОБЛЕМА - ПЕРПЕНДИКУЛЬ МЕНЯЕТ СВОЙ ЗНАК В РАЗНЫХ КВАДРАНТАХ
	// хотя возможно это не проблема, просто здесь задача решена так, что он скачет
	/*
	function getLinePoint() {
		//return line.getGeometry().getLastPoint();
		//return line.getGeometry().getFirstPoint();
		return line.getGeometry().getMiddlePoint();
	}
	
	function getLineNormalLinear() {
		//return line.getGeometry().getLastNormalLinear();
		//return line.getGeometry().getFirstNormalLinear();
		return line.getGeometry().getMiddleNormalLinear();
	}
	
	var first = getLinePoint().toVector().add(getLineNormalLinear().getParallel().scale(150)).toPoint();
	var last = getLinePoint();
	
	var lineMiddleNormal = Khusamov.svg.Element.createLine();
	lineMiddleNormal.setStyle({
		stroke: "magenta",
		strokeWidth: 1
	});
	lineMiddleNormal.setGeometry([first, last]);
	group.add(lineMiddleNormal);
	
	
	line.on("update", function() {
		first = getLinePoint().toVector().add(getLineNormalLinear().getParallel().scale(150)).toPoint();
		last = getLinePoint();
		lineMiddleNormal.setGeometry([first, last]);
	});
	*/
	
	
	
	
	// Паралельная прямая к линии, построенной на векторе vector
	// Созданная из уравнения прямой на расстоянии
	/*
	var lineParallel = Khusamov.svg.Element.createLine();
	lineParallel.setStyle({
		stroke: "blue",
		strokeWidth: 1
	});
	lineParallel.setGeometry(line.getGeometry().getParallelByDestination(40));
	group.add(lineParallel);
	
	line.on("update", function() {
		lineParallel.setGeometry(line.getGeometry().getParallelByDestination(40));
	});
	*/
	
	
	
	// Пересечение 
	
	
	/*
	var lineLast = Khusamov.svg.Element.createLine();
	lineLast.setStyle({
		stroke: "blue",
		strokeWidth: 1
	});
	group.add(lineLast);
	
	var line1 = Khusamov.svg.Element.createLine();
	line1.setStyle({
		stroke: "red",
		strokeWidth: 1
	});
	group.add(line1);
	var line2 = Khusamov.svg.Element.createLine();
	line2.setStyle({
		stroke: "cyan",
		strokeWidth: 1
	});
	group.add(line2);
	
	function paintLineLast() {
		var parallelLinear = line.getGeometry().toLinear().getParallelLinearByDestination(50);
		var point = line.getGeometry().getLastPoint();
		//var last = line.getGeometry().toLinear().getNormalLinear(point).intersection(parallelLinear);
		//lineLast.setGeometry([point, last]);
		
		
		// Проблема - когда line совпадает с осью Ох то на выходе { a: 0 b: 1 c: -171 } 
		var linear = line.getGeometry().toLinear().getNormalLinear(point);
		//var linear = line.getGeometry().toLinear();
		
		
		var fr = -300;
		var to = 300;
		
		try{
			lineLast.setGeometry([[0, 0], linear.intersection(parallelLinear)]);
		} catch(e) {
			// green red cyan
			//Linear { a: 0 b: 171 c: 0 } Linear { a: 0 b: 1 c: -171 } Linear { a: 0 b: 171 c: 8550 }
			console.log(line.getGeometry().toLinear().toString(), linear.toString(), parallelLinear.toString());
		}
		
		if (linear.y(fr) != Infinity && linear.y(to) != Infinity) {
			line1.setGeometry([[fr, linear.y(fr)], [to, linear.y(to)]]);
			line2.setGeometry([[fr, parallelLinear.y(fr)], [to, parallelLinear.y(to)]]);
		}
	}
	
	paintLineLast();
	line.on("update", paintLineLast);
	*/
	
	
	function updateVectorLineElement(vector, line) {
		line.setGeometry([[0, 0], vector.toPoint()]);
	}
	
	function createVectorLineElement(vector) {
		var line = Khusamov.svg.Element.createLine();
		line.setStyle({ stroke: "black", strokeWidth: 1 });
		updateVectorLineElement(vector, line);
		vector.on("update", function() {
			updateVectorLineElement(vector, line);
		});
		return group.add(line);
	}
	
	function createControlCircleElement() {
		var circle = Khusamov.svg.Element.createCircle({
			radius: 10,
			draggable: true
		});
		circle.setStyle({
			stroke: "black",
			strokeWidth: 1,
			fill: "transparent",
			cursor: "pointer"
		});
		return group.add(circle);
	}
	
	function createControlVector(vector) {
		var controlCircleElement = createControlCircleElement();
		controlCircleElement.setCenter(vector.toPoint());
		controlCircleElement.dd.on("drag", function() {
			vector.move(controlCircleElement.getCenter())
		});
	}
	
	function createControlPoint(point) {
		var controlCircleElement = createControlCircleElement();
		controlCircleElement.setCenter(point);
		controlCircleElement.dd.on("drag", function() {
			point.move(controlCircleElement.getCenter())
		});
	}
	
	function createLinearLineElement(lineElement) {
		var linear = lineElement.getGeometry().toLinear();
		var linearLineElement = Khusamov.svg.Element.createLine();
		linearLineElement.setStyle({ stroke: "black", strokeWidth: 1 });
		linearLineElement.setGeometry([[-sizeCoodLine, linear.y(-sizeCoodLine)], [sizeCoodLine, linear.y(sizeCoodLine)]]);
		lineElement.on("update", function() {
			var linear = lineElement.getGeometry().toLinear();
			linearLineElement.setGeometry([[-sizeCoodLine, linear.y(-sizeCoodLine)], [sizeCoodLine, linear.y(sizeCoodLine)]]);
		});
		return group.add(linearLineElement);
	}
	
	function createLinearLineElement_byLinear(updater, linearFn) {
		var linearLineElement = Khusamov.svg.Element.createLine();
		linearLineElement.setStyle({ stroke: "black", strokeWidth: 1 });
		linearLineElement.setGeometry([[-sizeCoodLine, linearFn().y(-sizeCoodLine)], [sizeCoodLine, linearFn().y(sizeCoodLine)]]);
		updater.on("update", function() {
			linearLineElement.setGeometry([[-sizeCoodLine, linearFn().y(-sizeCoodLine)], [sizeCoodLine, linearFn().y(sizeCoodLine)]]);
		});
		return group.add(linearLineElement);
	}
	
	function createSegmentLineElement(geometry) {
		var lineElement = Khusamov.svg.Element.createLine();
		lineElement.setStyle({ stroke: "black", strokeWidth: 1 });
		lineElement.setGeometry(geometry);
		createControlPoint(lineElement.getFirstPoint());
		createControlPoint(lineElement.getLastPoint());
		return group.add(lineElement);
	}
	
	
	
	/*var vector = Khusamov.svg.geometry.Vector.create(100, 100);
	var vectorLineElement = createVectorLineElement(vector);
	createControlVector(vector);
	createLinearLineElement(vectorLineElement);
	createLinearLineElement_byLinear(vectorLineElement, function() {
		return vectorLineElement.getGeometry().toLinear().getParallelLinearByDestination(-40);
	});*/
	
	
	var segmentLineElement = createSegmentLineElement([[-100, 100], [100, 100]]);
	
	createLinearLineElement_byLinear(segmentLineElement, function() {
		return segmentLineElement.getGeometry().toLinear().getParallelLinearByDestination(40);
	});
	
	
	
	/*Ext.override(Number, {
		
		
		
	});*/

	Ext.define("MyNumber", {
		
		override: "Number",
		
		unit: null,
		
		setUnit: function(unit) {
			this.unit = unit;
			return this;
		},
		
		getUnit: function() {
			return this.unit;
		},
		
		toString: function(withUnit) {
			return withUnit ? String(this) + " " + this.unit : this;
		}
		
	});
	
	
	console.log((5).setUnit("мм").toString(true));
	
	
});