
Ext.define("Kitchen.store.Examples", {
	
	alias: "store.examples",
	
	extend: "Ext.data.TreeStore",
	
	model: "Kitchen.model.Example",
	
	root: {
		text: "Примеры",
		path: "examples",
		expanded: true,
		children: [{
			text: "SVG",
			path: "svg",
			expanded: true,
			children: [{
				path: "path",
				text: "Элемент «Khusamov.svg.element.Path»",
				expanded: true,
				children: [{
					path: "arc",
					text: "Сегмент типа «Арка»",
					leaf: true,
				}]
			}]
		}]
	}
	
});