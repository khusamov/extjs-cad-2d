
/**
 * Управление фильтрами параметра transform для SVG-элементов.
 */




// TODO сделать либо наследование либо на основе Коллекции




Ext.define("Khusamov.svg.element.attribute.transform.Transform", {
	
	alternateClassName: "Khusamov.svg.element.attribute.Transform",
    
    requires: ["Khusamov.svg.element.attribute.transform.Filter"],
	
	mixins: ["Ext.mixin.Observable"],
	
	statics: {
		
		/**
		 * Конвертировать строку или массив строк transform в формате SVG в массив.
		 * @param transform String | String[] | Khusamov.svg.element.attribute.transform.Filter[] | Ext.draw.Matrix | Ext.draw.Matrix[] | mixed[]
		 * @return Khusamov.svg.element.attribute.transform.Filter[]
		 */
		toArray: function(transforms) {
	    	var result = [];
	    	var Filter = Khusamov.svg.element.attribute.transform.Filter;
	    	if (transforms) {
		    	if (Ext.isString(transforms) || transforms instanceof Filter || transforms instanceof Ext.draw.Matrix) transforms = [transforms];
		    	transforms.forEach(function(transform) {
		    		if (transform instanceof Filter) {
		    			result.push(transform);
		    		} else if (transform instanceof Ext.draw.Matrix) {
		    			result.push(new Filter(transform));
		    		} else {
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
				    	transform = transform.filter(function(filter) {
				    		return filter.trim();
				    	});
				    	transform = transform.map(function(filter) {
				    		return filter.replace(/ /g, ", ") + ")";
				    	});
				    	//rotate(-30)
				    	//translate(100, 200)
				    	//translate(100, 200)
				    	//scale(0.5)
				    	//matrix(a, b, c, d, e, f)
				    	transform.forEach(function(filter) {
					    	result.push(new Filter(filter));
				    	});
		    		}
		    	});
	    	}
	    	return result;
		}
		
	},
	
	config: {
		
		/**
		 * Массив SVG-фильтров.
		 * @param Khusamov.svg.element.attribute.transform.Filter[]
		 */
		filters: []
		
	},
	
	/**
	 * @event update
	 */
	
	/**
	 * Ext.create("Khusamov.svg.element.attribute.Transform");
	 * Ext.create("Khusamov.svg.element.attribute.Transform", String);
	 * Ext.create("Khusamov.svg.element.attribute.Transform", String[]);
	 * Ext.create("Khusamov.svg.element.attribute.Transform", Ext.draw.Matrix);
	 * Ext.create("Khusamov.svg.element.attribute.Transform", Ext.draw.Matrix[]);
	 * Ext.create("Khusamov.svg.element.attribute.Transform", Khusamov.svg.element.attribute.transform.Filter);
	 * Ext.create("Khusamov.svg.element.attribute.Transform", Khusamov.svg.element.attribute.transform.Filter[]);
	 * Ext.create("Khusamov.svg.element.attribute.Transform", Mixed[]);
	 */
	constructor: function(config) {
		var me = this;
		me.mixins.observable.constructor.call(me, config);
		
		if (
			Ext.isString(config) ||
			Ext.isArray(config) ||
			config instanceof Ext.draw.Matrix ||
			config instanceof Khusamov.svg.element.attribute.transform.Filter
		) {
			config = { filters: config };
		}
		
		me.initConfig(config);
	},
	
	/**
	 * Заменить фильтры.
	 * Transform.setFilters(String) // Несколько фильтров через пробел
	 * Transform.setFilters(String[])
	 * Transform.setFilters(Ext.draw.Matrix)
	 * Transform.setFilters(Ext.draw.Matrix[])
	 * Transform.setFilters(Khusamov.svg.element.attribute.transform.Filter)
	 * Transform.setFilters(Khusamov.svg.element.attribute.transform.Filter[])
	 * Transform.setFilters(mixed[])
	 * @return Khusamov.svg.element.attribute.transform.Transform
	 */
	applyFilters: function(filters) {
		return Khusamov.svg.element.attribute.Transform.toArray(filters);
	},
	
	updateFilters: function(filters, old) {
		this.fireEvent("update", "clear");
		if (filters.length) this.fireEvent("update", "add", filters);
	},
	
	/**
	 * Добавить фильтр(ы).
	 * 
	 * Transform.add(String) // matrix(a, b, c, d, e, f)
	 * Transform.add(String) // Несколько фильтров через пробел
	 * Transform.add(String[])
	 * 
	 * Transform.add(String, Number, Number, ...) // Тип фильтра и параметры
	 * Transform.add(String, String) // Тип фильтра и параметры
	 * Transform.add({ type: String, params: String | Number[] })
	 * 
	 * Transform.add(Ext.draw.Matrix)
	 * Transform.add(Ext.draw.Matrix[])
	 * Transform.add(Khusamov.svg.element.attribute.transform.Filter)
	 * Transform.add(Khusamov.svg.element.attribute.transform.Filter[])
	 * 
	 * 
	 * @return Khusamov.svg.element.attribute.transform.Transform
	 */
	add: function(filters) {
    	var me = this;
    	//var filterClass = "Khusamov.svg.element.attribute.transform.Filter";
    	
    	var Filter = Khusamov.svg.element.attribute.transform.Filter;
    	
    	var Transform = Khusamov.svg.element.attribute.Transform;
    	
		if (
			Ext.isString(filters) ||
			Ext.isArray(filters) ||
			filters instanceof Ext.draw.Matrix ||
			filters instanceof Khusamov.svg.element.attribute.transform.Filter
		) {
			if (arguments.length > 1) {
				//filters = [Ext.create(filterClass, Ext.Array.slice(arguments))];
				
				
				
				filters = [Filter.create.apply(Filter, Ext.Array.slice(arguments))];
				
			} else {
				filters = Transform.toArray(filters);
			}
		} else {
			
			
			
			filters = [Filter.create(filters)];
			//filters = [Ext.create(filterClass, filters)];
		}
    	
    	me.getFilters().push.apply(me.getFilters(), filters);
    	me.fireEvent("update", "add", filters);
    	return me;
	},
	
    /**
     * Добавить матрицу.
     * Element.matrix(xx, xy, yx, yy, dx, dy)
     * Element.matrix(Ext.draw.Matrix)
     */
	matrix: function(xx, xy, yx, yy, dx, dy) {
		if (xx instanceof Ext.draw.Matrix) {
			return this.add(xx);
		} else {
			return this.add("matrix", xx, xy, yx, yy, dx, dy);
		}
	},
	
	/**
	 * Добавить матрицу переноса.
	 */
	translate: function(tx, ty) {
		return this.add("translate", tx, ty);
	},
	
	/**
	 * Добавить матрицу масштабирования.
	 */
	scale: function(sx, sy) {
		return this.add("scale", sx, sy);
	},
	
	/**
	 * Добавить матрицу вращения.
	 */
	rotate: function(angle, cx, cy) {
		return this.add("rotate", angle, cx, cy);
	},
	
	/**
	 * Добавить матрицу искажения по оси Ох.
	 */
	skewx: function(angle) {
		return this.add("skewx", angle);
	},
	
	/**
	 * Добавить матрицу искажения по оси Оy.
	 */
	skewy: function(angle) {
		return this.add("skewy", angle);
	},
	
	/**
	 * Удаление всех фильтров.
	 */
	clear: function() {
    	return this.setFilters();
	},
	
	/**
	 * Пройтись по всем фильтрам.
	 */
	each: function(fn) {
		this.getFilters().forEach(fn);
		return this;
	},
	
	/**
	 * Количество фильтров.
	 */
	count: function() {
		return this.getFilters().length;
	},
	
	/**
	 * Получить все трансформации в виде результирующей матрицы.
	 * @return Ext.draw.Matrix
	 */
	toMatrix: function() {
    	var me = this;
		var result = Ext.create("Ext.draw.Matrix");
		me.each(function(filter) {
			result.multiply(filter.toMatrix());
		});
		return result;
	},
	
	/**
	 * Получить строку фильтров в формате SVG.transform.
	 */
	toString: function() {
		var result = [];
		this.each(function(filter) {
			result.push(filter.toString());
		});
		return result.join(" ");
	}
	
});


