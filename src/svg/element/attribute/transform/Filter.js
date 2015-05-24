
Ext.define("Khusamov.svg.element.attribute.transform.Filter", {
    
    requires: ["Ext.draw.Matrix"],
	
	statics: {
		
		/**
		 * Конвертация строки фильтра в объект.
		 * @param {String} filter Строка с фильтром в формате SVG.
		 * @return {Object} filter Объект с параметрами фильтра.
		 * @return {String} filter.type Тип фильтра (matrix | rotate | skewx | skewy | scale | translate).
		 * @return {Number[]} filter.params Массив с параметрами фильтра.
		 */
		toObject: function(filter) {
			// matrix(a, b, c, d, e, f)
			filter = filter.replace(/\)/g, "");
			// matrix(a, b, c, d, e, f
			filter = filter.split("(");
			// matrix
			// a, b, c, d, e, f
	    	return {
				type: filter[0].trim(),
				params: filter[1].split(",").map(function(param) {
		    		return Number(param);
		    	})
			};
		},
		
		/**
		 * Создать матрицу на основе параметров фильтра.
		 * @param {String} type
		 * @param {Number[]} params
		 * @return Ext.draw.Matrix
		 */
		createMatrix: function(type, params) {
			return this["createMatrix" + type[0].toUpperCase() + type.substr(1)].call(this, params);
		},
		
		createMatrixMatrix: function(params) {
			return Ext.create("Ext.draw.Matrix", params[0], params[1], params[2], params[3], params[4], params[5]);
		},
		
		createMatrixTranslate: function(params) {
			var tx = params[0];
			var ty = params[1];
			return Ext.create("Ext.draw.Matrix", 1, 0, 0, 1, tx, ty);
		},
		
		createMatrixScale: function(params) {
			var sx = params[0];
			var sy = params[1] === undefined ? sx : params[1];
			return Ext.create("Ext.draw.Matrix", sx, 0, 0, sy, 0, 0);
		},
		
		createMatrixRotate: function(params) {},
		createMatrixSkewx: function(params) {},
		createMatrixSkewy: function(params) {}
		
	},
	
	config: {
		
		/**
		 * Тип фильтра (matrix | translate | scale | rotate | skewx | skewy).
		 * @param String
		 */
		type: null,
		
		/**
		 * Параметры фильтра. Массив чисел.
		 * @param Number[]
		 */
		params: [],
	},
	
	/**
	 * Ext.create("Khusamov.svg.element.attribute.transform.Filter", String); // matrix(a, b, c, d, e, f)
	 * Ext.create("Khusamov.svg.element.attribute.transform.Filter", [String]);
	 * Ext.create("Khusamov.svg.element.attribute.transform.Filter", String, Number, Number, ...);
	 * Ext.create("Khusamov.svg.element.attribute.transform.Filter", [String, Number, Number, ...]);
	 * Ext.create("Khusamov.svg.element.attribute.transform.Filter", String, String); // matrix, (a, b, c, d, e, f)
	 * Ext.create("Khusamov.svg.element.attribute.transform.Filter", [String, String]);
	 * Ext.create("Khusamov.svg.element.attribute.transform.Filter", { type: String, params: String | Number[] });
	 * Ext.create("Khusamov.svg.element.attribute.transform.Filter", Ext.draw.Matrix);
	 */
	constructor: function(config) {
    	var me = this;
    	
    	
    	if (arguments.length > 1) config = Ext.Array.slice(arguments);
    	
    	if (Ext.isArray(config)) {
    		var type = config.shift();
    		config = {
    			type: type,
    			params: config
    		};
    	}
    	
    	if (Ext.isString(config)) {
    		config = Khusamov.svg.element.attribute.transform.Filter.toObject(config);
    	}
    	
    	if (config instanceof Ext.draw.Matrix) {
    		config = {
    			type: "matrix",
    			params: config.toVerticalArray()
    		};
    	}
    	
    	
		me.initConfig(config);
	},
	
	/**
	 * Filter.setParams(String);
	 * Filter.setParams(Number[]);
	 */
	applyParams: function(params) {
    	// Строку конвертируем в массив чисел
    	if (Ext.isString(params)) params = params.split(",");
    	// Параметры конвертируем в числа
    	params = params.map(function(param) {
    		return Number(param);
    	});
		// Не определенные параметры удаляем
		params = params.filter(function(param) {
    		return param !== undefined;
    	});
		return params;
	},
	
	/**
	 * Получить фильтр в виде матрицы.
	 * @return Ext.draw.Matrix
	 */
	toMatrix: function() {
    	return Khusamov.svg.element.attribute.transform.Filter.createMatrix(this.getType(), this.getParams());
	},
	
	/**
	 * Получить фильтр в виде строки в формате SVG.
	 * @return String
	 */
	toString: function() {
		return this.getType().concat("(", this.getParams().join(", "), ")");
	},
	
	/**
	 * Получить фильтр в виде объекта.
	 * @param {Boolean} withMatrix Если true, то в объект подставляется также матрица фильтра.
	 * @return {Object} filter Объект с параметрами фильтра.
	 * @return {String} filter.type Тип фильтра (matrix | rotate | skewx | skewy | scale | translate).
	 * @return {Number[]} filter.params Массив с параметрами фильтра.
	 * @return {Ext.draw.Matrix} filter.matrix Матрица фильтра.
	 */
	toObject: function(withMatrix) {
		var result = {
			type: this.getType(),
			params: this.getParams()
		};
		if (withMatrix) result.matrix = this.toMatrix();
		return result;
	},
	
	/**
	 * Клонировать фильтр.
	 * @return {Khusamov.svg.element.attribute.transform.Filter}
	 */
	clone: function() {
		return new this.self(this.toObject());
	}
	
});


