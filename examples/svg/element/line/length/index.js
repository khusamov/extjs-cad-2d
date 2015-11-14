
Ext.require([
	"Khusamov.svg.geometry.Point",
	"Khusamov.svg.geometry.Line"
]);

Ext.onReady(function() {
	
	var line = Ext.create("Khusamov.svg.geometry.Line", [0, 0], [100, 0]);
	
	console.log(line.getLength());
	
	
	
	var point1 = Ext.create("Khusamov.svg.geometry.Point", [0, 0]);
	var point2 = Ext.create("Khusamov.svg.geometry.Point", [100, 0]);
	
	console.log(point1.distance(point2));

});


