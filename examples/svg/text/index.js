
/**
 * Демонстрация работы с текстом.
 */
	 
Ext.require([
	"Khusamov.svg.Svg",
	"Khusamov.svg.element.Line",
	"Khusamov.svg.element.Circle",
	"Khusamov.svg.geometry.Point",
	"Khusamov.svg.geometry.equation.Linear",
	"Khusamov.svg.geometry.equation.Circular",
	"Khusamov.svg.element.Title",
	"Khusamov.svg.geometry.Path",
	"Khusamov.svg.element.Path",
	"Khusamov.svg.element.Text"
]);

Ext.onReady(function() {
	
	var svg = Ext.create("Khusamov.svg.Svg");
	
	var panel = Ext.create("Ext.panel.Panel", {
		plugins: "viewport",
		renderTo: Ext.getBody(),
		layout: "fit",
		items: [svg]
	});
	
	
	var text = Ext.create("Khusamov.svg.element.Text", 100, 100, "Текст");
	
	
	
	svg.add(text);
	
	
	
});


