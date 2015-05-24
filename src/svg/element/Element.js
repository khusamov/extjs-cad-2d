
Ext.define("Khusamov.svg.element.Element", {
	
	extend: "Ext.container.Container",
	
    alternateClassName: "Khusamov.svg.Element",
	
	requires: [
		"Khusamov.svg.layout.Svg", 
		"Khusamov.svg.element.attribute.transform.Transform",
		"Ext.draw.Matrix"
	],
    
    xtype: "khusamov-svg-element",
    
    isSvgElement: true,
    
    type: "element",
	
	baseCls: Ext.baseCSSPrefix + "khusamov-svg-element",
	
	layout: "khusamov-layout-svg",
	
	defaultType: null,
	
	statics: {
	
		/**
		 * Создать элемент.
		 * @return {Khusamov.svg.element.Element}
		 */
		createElement: function(config) {
			config.xtype = config.xtype ? config.xtype :"khusamov-svg-element-" + config.type;
			return Ext.create(config);
		}
	
	},
	
	/**
	 * Класс геометрии элемента. 
	 * Если {String}, то без префикса "Khusamov.svg.geometry." (например, Polyline).
	 * В потомках переопределяется: полилиния, линия, полигон, квадрат и пр.
	 * @protected
	 * @property {String | Ext.Base}
	 */
	geometryClass: null,
	
	/**
	 * Имя аттрибута, отвечающего за геометрию элемента.
	 * @protected
	 * @property {String}
	 */
	geometryAttributeName: "points",
	
	/**
	 * Геометрия элемента.
	 * @readonly
	 * @property {Khusamov.svg.geometry.*}
	 */
	geometry: null,
	
	/**
	 * Трансформации элемента.
	 * @readonly
	 * @param {Khusamov.svg.element.attribute.transform.Transform}
	 */
	transform: null,
	
	/**
	 * @event update Обновление элемента.
	 * @param {String} type Тип обновления.
	 * @param {Mixed} what Затронутые объекты.
	 */
	
	config: {
	
		/**
		 * Геометрия элемента.
		 * @property {Khusamov.svg.geometry.*}
		 */
		geometry: null,
		
		/**
		 * Трансформации элемента.
		 * @param {Khusamov.svg.element.attribute.transform.Transform}
		 */
		transform: null
	
	},
	
	constructor: function(config) {
		var me = this;
		if (me.geometryClass) me.geometryClass = Khusamov.svg.geometry[me.geometryClass];
		me.callParent([config]);
	},
	
	/**
	 * Внимание, initComponent вызывается после вызова методов apply*.
	 */
	initComponent: function() {
		var me = this;
		me.callParent();if (me.geometryClass && !me.getGeometry()) me.setGeometry();
		if (!me.getTransform()) me.setTransform();
		me.initElement();
	},
	
	initElement: Ext.emptyFn,
	
	applyGeometry: function(geometry) {
		// TODO return new this.geometryClass(geometry);
		return geometry instanceof this.geometryClass ? geometry : new this.geometryClass(geometry);
	},
	
	updateGeometry: function(geometry, oldGeometry) {
		var me = this;
		me.geometry = geometry;
		me.repaintGeometry();
		if (oldGeometry) oldGeometry.un("update", "onUpdateGeometryInner", me);
		geometry.on("update", "onUpdateGeometryInner", me);
		me.fireEvent("update", "clear");
		me.fireEvent("update", "add", geometry);
	},
	
	/**
	 * Обработчик события "Изменение содержимого геометрии элемента".
	 */
	onUpdateGeometryInner: function(type, items) {
		var me = this;
		me.repaintGeometry();
		me.fireEvent("update", type, items);
	},
	
	/**
	 * Перерисовать геометрию элемента.
	 * Определяет общий метод перерисовки.
	 * В потомках можно переопределить.
	 */
	repaintGeometry: function() {
		var me = this;
		if (me.geometryClass && me.rendered) {
			var attributes = {};
			attributes[me.geometryAttributeName] = me.geometry.toString();
			me.getEl().set(attributes);
		}
	},
	
	/**
	 * Замена всех фильтров.
	 * Для работы с фильтрами используйте свойство Element.transform.
	 * Element.setTransform(String);
	 * Element.setTransform(String[]);
	 * Element.setTransform(Khusamov.svg.element.attribute.transform.Filter);
	 * Element.setTransform(Khusamov.svg.element.attribute.transform.Filter[]);
	 * Element.setTransform(Khusamov.svg.element.attribute.transform.Transform);
	 */
	applyTransform: function(transform) {
		var Transform = Khusamov.svg.element.attribute.Transform;
		return transform instanceof Transform ? transform : new Transform(transform);
	},
	
	updateTransform: function(transform, oldTransform) {
		var me = this;
		me.transform = transform;
		me.repaintTransform();
		if (oldTransform) oldTransform.un("update", "onUpdateTransformFilters", me);
		transform.on("update", "onUpdateTransformFilters", me);
		me.fireEvent("update", "transform");
		me.fireEvent("transform");
	},
	
	onUpdateTransformFilters: function() {
		var me = this;
		me.repaintTransform();
		me.fireEvent("update", "transform");
		me.fireEvent("transform");
	},
	
	repaintTransform: function() {
		var me = this;
		if (me.rendered && me.getTransform().count()) me.getEl().set({
			transform: me.transform.toString()
		});
	},
	
	afterRender: function() {
		var me = this;
		me.callParent(arguments);
		me.repaintGeometry();
		me.repaintTransform();
		me._setSize(me.width, me.height);
	},
	
	/**
	 * Получить результирующую матрицу.
	 * Если ancestor === true, то учитываются также матрицы предков.
	 */
	getMatrix: function(ancestor) {
		var me = this;
		var result = Ext.create("Ext.draw.Matrix");
		if (ancestor === true && me.up() instanceof Khusamov.svg.element.Element) {
			result = me.up().getMatrix(ancestor);
		}
		result.multiply(me.transform.toMatrix());
		return result;
	},
	
	/**
	 * Добавить дочерний(е) элемент(ы).
	 * Добавлена обработка параметров type.
	 * В конфигах можно вместо xtype указать type, например type: "circle".
	 * @return added
	 */
	add: function() {
		var me = this;
		var prefix = "khusamov-svg-element-";
		var xtype = function(o) { if (Ext.isObject(o) && o.type && !("xtype" in o)) o.xtype = prefix + o.type; };
		Ext.Array.each(arguments, function(a) { if (Ext.isArray(a)) a.forEach(xtype); else xtype(a); });
		return me.callParent(arguments);
	},
	
	
	
	
	
	
	
	
	
	/*onBeforeRender: function() {
	Ext.Object.merge(me.autoEl, me.renderAttributes(Ext.Object.merge({}, me.getAttributes())));
	},*/
	
	/**
	* Эта функция вызывается перед непосредственной отрисовкой элемента.
	* Метод является защищенным.
	*/
	/*renderAttributes: function(attributes) {
	var me = this;
	if ("transform" in attributes) {
	attributes.transform = me.convertTransformToSvgString(attributes.transform);
	}
	return attributes;
	},*/
	/*
	applyAttributes: function(attributes) {
	var me = this;
	
	
	
	// Если transform задан строкой, то его надо конвертировать в массив
	if ("transform" in attributes && Ext.isString(attributes.transform)) {
	attributes.transform = me.convertPointsToArray(attributes.transform);
	}
	
	// Имеющиеся аттрибуты не затираем, а добавляем новые
	attributes = Ext.Object.merge(me.getAttributes() || {}, attributes);
	
	// Обновляем элемент
	if (me.rendered) {
	me.getEl().set(me.renderAttributes(Ext.Object.merge({}, attributes)));
	}
	
	return attributes;
	},
	*/
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	/*
	convertTransformToArray: function(transform) {
	var result = [];
	//rotate(-30) translate(100, 200) translate(100 200) scale(0.5) matrix(a, b, c, d, e, f)
	transform = transform.replace(/,/g, " ");
	//rotate(-30) translate(100  200) translate(100 200) scale(0.5) matrix(a  b  c  d  e  f)
	transform = transform.split(")");
	//rotate(-30
	//translate(100  200
	//translate(100 200
	//scale(0.5
	//matrix(a  b  c  d  e  f
	//
	Ext.Array.each(transform, function(filter) {
	filter = filter.split("(");
	var type = filter[0].trim();
	var params = filter[1];
	params = params.split(" ");
	var _params = [];
	Ext.Array.each(params, function(param) {
	_params.push(new Number(param));
	});
	params = _params;
	if (type) result.push({
	type: type,
	params: params
	});
	});
	return result;
	},
	
	convertTransformToSvgString: function(transform) {
	var result = [];
	Ext.Array.each(transform, function(filter) {
	result.push(filter.type.concat("(", filter.params.join(", "), ")"));
	});
	return result.join(" ");
	},*/
	
	/**
	* Element.transform(filtername, param1, param2, ...)
	*/
	/*transform: function() {
	var me = this;
	var args = Ext.Array.slice(arguments);
	var attributes = me.getAttributes();
	if (!("transform" in attributes)) attributes.transform = [];
	var filter = args[0];
	args.shift();
	
	var _args = [];
	Ext.Array.each(args, function(arg, index) {
	if (arg === undefined) return false;
	_args.push(arg);
	});
	args = _args;
	
	filter = {
	type: filter,
	params: args
	};
	if (filter.type == "matrix") {
	if (!(filter.params[0] instanceof Ext.draw.Matrix)) {
	filter.matrix = new Ext.draw.Matrix.apply(Ext.draw, params);
	} else {
	filter.matrix = filter.params[0];
	}
	filter.params = filter.matrix.toVerticalArray();
	}
	attributes.transform.push(filter);
	if (me.rendered) {
	me.getEl().set({
	transform: me.convertTransformToSvgString(attributes.transform)
	});
	}
	me.fireEvent("transform", filter, attributes.transform);
	return me;
	},
	
	clearTransform: function() {
	var me = this;
	delete me.getAttributes().transform;
	me.getEl().dom.removeAttribute("transform");
	return me;
	},*/
	
	/**
	* Element.matrix(xx, xy, yx, yy, dx, dy)
	* Element.matrix(Ext.draw.Matrix)
	*/
	/*matrix: function(xx, xy, yx, yy, dx, dy) {
	return this.transform("matrix", xx, xy, yx, yy, dx, dy);
	},
	
	translate: function(tx, ty) {
	return this.transform("translate", tx, ty);
	},
	
	scale: function(sx, sy) {
	return this.transform("scale", sx, sy);
	},
	
	rotate: function(angle, cx, cy) {
	return this.transform("rotate", angle, cx, cy);
	},
	
	skewx: function(angle) {
	return this.transform("skewx", angle);
	},
	
	skewy: function(angle) {
	return this.transform("skewy", angle);
	},*/
	
	/**
	* Получить результирующую матрицу.
	* Если ancestor === true, то учитываются также матрицы предков.
	*/
	/*getTransformMatrix: function(ancestor) {
	var me = this;
	
	var result = (ancestor === true && me.up() instanceof Khusamov.svg.element.Element) ? 
	me.up().getTransformMatrix(ancestor) : 
	Ext.create("Ext.draw.Matrix");
	
	Ext.Array.each(me.getAttributes().transform, function(filter) {
	switch (filter.type) {
	case "matrix":
	result.multiply(filter.matrix);
	break;
	case "translate":
	var tx = filter.params[0];
	var ty = filter.params[1];
	result.multiply(Ext.create("Ext.draw.Matrix", 1, 0, 0, 1, tx, ty));
	break;
	case "scale":
	var sx = filter.params[0];
	var sy = filter.params[1] === undefined ? sx : filter.params[1];
	result.multiply(Ext.create("Ext.draw.Matrix", sx, 0, 0, sy, 0, 0));
	break;
	case "rotate":
	break;
	case "skewx":
	break;
	case "skewy":
	break;
	}
	});
	return result;
	},*/
	
	
	
	
	
	
	
	
	
	
	
	
	setPagePosition: function(x, y) {
	var me = this;
	
	// TODO Для объекта Khusamov.svg.Svg вызывать родительский метод
	
	me.setX(x);
	me.setY(y);
	return me;
	},
	
	setX: function(x) {
	var me = this;
	
	
	// TODO сделать сбор всех матриц предков, их соединение и из результирующей матрицы брать scale и DX
	
	// TODO для каждого shape делать свои setX setY
	
	
	var scale = me.getSurface().getTransformMatrix().getScaleX();
	var offset = me.getSurface().getTransformMatrix().getDX();
	
	x = x - me.getSvg().getX();
	
	x -= offset;
	
	x /= scale;
	
	//x += me.getAttributes().r;
	
	me.getEl().set({ x: x });
	return me;
	},
	
	setY: function(y) {
	var me = this;
	
	
	var scale = me.getSurface().getTransformMatrix().getScaleY();
	var offset = me.getSurface().getTransformMatrix().getDY();
	
	y = y - me.getSvg().getY();
	
	y -= offset;
	
	y /= scale;
	
	//y += me.getAttributes().r;
	
	me.getEl().set({ y: y });
	return me;
	},
	
	
	
	
	setSize: function(width, height) {
	var me = this;
	me.callParent(arguments);
	me._setSize(width, height);
	return me;
	},
	
	_setSize: function(width, height) {
	var me = this;
	if (me.rendered) {
	me.getEl().setStyle("width", null);
	me.getEl().setStyle("height", null);
	me.getEl().set({
	width: width,
	height: height
	});
	}
	return me;
	},
	
	


});

