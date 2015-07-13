
Ext.require([
	"Khusamov.svg.geometry.equation.Linear",
	"Khusamov.svg.geometry.equation.Circular",
	"Ext.draw.Matrix"
]);

Ext.onReady(function() {
	
	var linear = Ext.create("Khusamov.svg.geometry.equation.Linear", 4, 25, 75);
	
	
	var matrix = Ext.create("Ext.draw.Matrix");
	matrix.rotate(-linear.getAngle() + Math.PI / 2, 0, 0);
	
	var linear2 = linear.getTransformLinear(matrix);
	
	matrix.translate(5, 55);
	var linear3 = linear.getTransformLinear(matrix);
	
	var fixed = 2;
	console.log(linear.getAngle(), linear.toString(fixed));
	console.log(linear2.getAngle(), linear2.toString(fixed));
	console.log(linear3.getAngle(), linear3.toString(fixed));

});


