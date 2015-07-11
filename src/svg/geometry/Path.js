
/**
 * Полилиния на плоскости.
 */

Ext.define("Khusamov.svg.geometry.Path", {
	extend: "Khusamov.svg.geometry.Primitive",
	
	requires: [
		"Ext.util.Collection",
		"Khusamov.svg.geometry.path.Command",
		"Khusamov.svg.geometry.path.Move",
		"Khusamov.svg.geometry.path.MoveBy",
		"Khusamov.svg.geometry.path.Line",
		"Khusamov.svg.geometry.path.LineBy",
		"Khusamov.svg.geometry.path.Arc",
		"Khusamov.svg.geometry.path.Close"
	],
	
	statics: {
		
		/**
		 * Конвертирование строки с описанием последовательности команд path в формате SVG
		 * в массив с командами, представленных в виде массива [x, y].
		 * @return {Array[x, y][]}
		 */
		parseSvgPathString: function(value) {
			var result = [];
			// TODO
			return result;
		},
		
		/**
		 * Преобразование массива с сырыми данными в массив с командами.
		 * Во входном массиве могут быть команды в виде строк (например 'L 40 42.68'), конфиги команд.
		 * @param {String[] | Object[] | Mixed[]} items
		 * @return {Khusamov.svg.geometry.path.Command[]}
		 */
		toArray: function(items) {
			var Command = Khusamov.svg.geometry.path.Command;
			return items ? items.map(function(item) {
				if (Ext.isString(item)) item = Command.configFromString(item);
				
				//console.info(item);
				
				if (!(item instanceof Command)) item = Command.create(item);
				return item;
			}) : [];
		},
		
		toCollection: function(data) {
			var result = Ext.create("Ext.util.Collection");
			result.add(this.toArray(data));
			return result;
		}
		
	},
	 
	privates: {
		
		
		
	},
	
	isPath: true,
	
	type: "path",
	
	/**
	 * Доступ к массиву команд.
	 * @readonly
	 * @property {Ext.util.Collection}
	 */
	data: null,
	
	config: {
		
		/**
		 * Массив команд.
		 * @property {Ext.util.Collection}
		 */
		data: null
		
	},
	
	/**
	 * Ext.create("Khusamov.svg.geometry.Path");
	 */
	constructor: function(config) {
		var me = this;
		if (Ext.isString(config) || Ext.isArray(config)) config = { data: config };
		me.callParent([config]);
	},
	
	initPrimitive: function() {
		var me = this;
		if (!me.data) me.setData();
	},
	
	applyData: function(data) {
		return Khusamov.svg.geometry.Path.toCollection(data);
	},
	
	updateData: function(data) {
		var me = this;
		me.data = data;
		this.fireEvent("update", "clear");
		this.fireEvent("update", "add", data.items);
		
		//console.info("updateData", data);
			
		data.on({
			add: "onDataAdd",
			remove: "onDataRemove",
			scope: me
		});
	},
	
	onDataAdd: function(data, details) {
		
		console.info("onDataAdd", data, details.items);
		
		this.fireEvent("update", "add", details.items);
	},
	
	onDataRemove: function(data, details) {
		this.fireEvent("update", "remove", details.items);
	},
	
	add: function() {
		//var Command = Khusamov.svg.geometry.path.Command;
		//var prefix = Command.prototype.alias[0] + ".";
		
		var items = [];
		
		Ext.Array.each(arguments, function(item) {
			items = items.concat(item);
		});
		
		
		
		/*items = items.map(function(item) {
			if (Ext.isString(item)) item = Command.configFromString(item);
			if (!(item instanceof Command)) {
				//if (item.type && !("xclass" in item)) item.xclass = prefix + item.type;
				//item = Ext.create(item);
				
				Command.create(item);
				
			}
			return item;
		});*/
		
		items = Khusamov.svg.geometry.Path.toArray(items);
		
		
		
		return this.data.add(items);
	},
	
	command: function(name) {
		name = Ext.String.capitalize(name);
		var args = Ext.Array.slice(arguments);
		args.shift();
		var commandClass = Khusamov.svg.geometry.path[name];
		this.add(commandClass.create.apply(commandClass, args));
		return this;
	},
	
	/**
	 * Получить путь в виде массива команд.
	 * @param {boolean} pointAsPoint Если равен true, то выдать массив Khusamov.svg.geometry.Point[].
	 * @return {Number[x, y][] | Khusamov.svg.geometry.Point[]}
	 */
	toArray: function(commandAsCommand) {
		var me = this;
		var result = [];
		me.data.each(function(command) {
			result.push(commandAsCommand ? command : command.clone().toObject());
		});
		return result;
	},
	
	toObject: function() {
		var me = this;
		return Ext.Object.merge(me.callParent(), {
			data: me.toArray()
		});
	},
	
	/**
	 * Конвертировать путь в строку в формате SVG.
	 */
	toString: function() {
		var me = this;
		var result = [];
		
		//console.info(me.data);
		
		me.data.each(function(command) {
			result.push(command.toString());
		});
		return result.join(" ");
	},
	
	/**
	 * @return {Ext.util.Collection}
	 */
	toCollection: function() {
		return this.data.clone();
	},
	
}, function(Path) {
	
	// Добавление в Path методов добавления команд, например Path.move(), Path.arc() и т.п.
	var commands = {};
	Ext.Object.each(Khusamov.svg.geometry.path.Command.map, function(letter, name) {
		commands[name] = function() {
			var args = [name].concat(Ext.Array.slice(arguments));
			this.command.apply(this, args);
			return this;
		};
	});
	Path.override(commands);
	
});