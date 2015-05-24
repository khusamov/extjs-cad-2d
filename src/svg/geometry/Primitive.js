
/**
 * Базовый, абстрактный класс геометрических элементов.
 */

Ext.define("Khusamov.svg.geometry.Primitive", {
	
	requires: ["Ext.data.identifier.Sequential"],
	
	mixins: ["Ext.mixin.Observable"],
	
	statics: {
		
		/**
		 * @property {Ext.data.identifier.Sequential}
		 */
		identifier: null,
		
		init: function() {
			var me = this;
			me.identifier = Ext.create("Ext.data.identifier.Sequential", {
				seed: 1000
			});
		},
		
		generateId: function() {
			return this.identifier.generate();
		}
		
	},
	
	isPrimitive: true,
	
	/**
	 * Тип примитива.
	 * @readonly
	 * @property {String}
	 */
	type: "primitive",
	
	config: {
		
		/**
		 * Уникальный идентификатор примитива.
		 * @property {String}
		 */
		id: null,
		
		/**
		 * Индекс примитива.
		 * @property {Number}
		 */
		index: null,
		
		/**
		 * Имя, название или заголовок примитива.
		 * @property {String}
		 */
		title: null,
		
		/**
		 * Текстовое описание примитива.
		 * @property {String}
		 */
		description: null,
		
	},
	
	constructor: function(config) {
		var me = this;
		if (config && !("id" in config)) config.id = Khusamov.svg.geometry.Primitive.generateId();
		me.mixins.observable.constructor.call(me, config);
		me.initConfig(config);
		me.initPrimitive();
	},
	
	applyId: function(value) {
		return String(value);
	},
	
	applyIndex: function(value) {
		return Number(value);
	},
	
	applyTitle: function(value) {
		return String(value);
	},
	
	applyDescription: function(value) {
		return String(value);
	},
	
	updateId: function(value, old) {
		this.fireEvent("update", "id", value, old, this);
	},
	
	updateIndex: function(value, old) {
		this.fireEvent("update", "id", value, old, this);
	},
	
	updateTitle: function(value, old) {
		this.fireEvent("update", "id", value, old, this);
	},
	
	updateDescription: function(value, old) {
		this.fireEvent("update", "id", value, old, this);
	},
	
	/**
	 * Получить тип примитива.
	 * @return {String}
	 */
	getType: function() {
		return this.type;
	},
	
	/**
	 * Инициализация примитива.
	 * Шаблон метода.
	 */
	initPrimitive: Ext.emptyFn,
	
	/**
	 * Клонировать (сделать копию) примитив.
	 * @return {Khusamov.svg.geometry.Primitive}
	 */
	clone: function() {
		return new this.self(this.toObject());
	},
	
	/**
	 * Получить примитив в виде объекта.
	 * Объект оформляется в виде конфига (по нему можно делать клона), все узлы имеют примитивные типы.
	 * @return {Object}
	 */
	toObject: function() {
		return {
			type: this.getType(),
			id: this.getId(),
			index: this.getIndex(),
			title: this.getTitle(),
			description: this.getDescription()
		};
	},
	
	/**
	 * Получить примитив в виде массива.
	 * Все узлы имеют примитивные типы.
	 * @return {Array}
	 */
	toArray: function() { return []; },
	
	/**
	 * Получить примитив в виде строки.
	 * Строка оформляется по стандартам SVG.
	 * @return {String}
	 */
	toString: function() { return String(); }
	
}, function(Primitive) {
	
	Primitive.init();
	
});