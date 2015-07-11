
Ext.define("Khusamov.svg.geometry.path.Command", {
	
	requires: ["Ext.data.identifier.Sequential"],
	
	mixins: ["Ext.mixin.Factoryable"],
	
	factoryConfig: {
		type: "khusamov.svg.geometry.path.command"
	},
	
	statics: {
		
		map: {},
		
		typeByLetter: function(letter) {
			return this.map[letter].toLowerCase();
		},
		
		xclassPrefix: null,
		
		
		
		/*xclass: function(config) {
			if (
				Ext.isObject(config) && 
				!(config instanceof this.self) && 
				config.type && 
				!("xclass" in config)
			) config.xclass = this.xclassPrefix + config.type;
		},*/
		
		configFromString: function(command) {
			command = command.split(" ");
			var letter = command[0];
			command.shift();
			
			
			
			return {
				type: this.typeByLetter(letter),
				parameters: command
			};
			/*return this.xclass({
				type: this.map[letter].toLowerCase(),
				parameters: command
			});*/
		},
		
		/**
		 * @property {Ext.data.identifier.Sequential}
		 */
		identifier: null,
		
		init: function() {
			//var Command = Khusamov.svg.geometry.path.Command;
			//this.xclassPrefix = Command.prototype.alias[0] + ".";
			this.identifier = Ext.create("Ext.data.identifier.Sequential");
			//Ext.Factory.define(this.prototype.alias[0]);
		},
		
		generateId: function() {
			return this.identifier.generate();
		}
		
	},
	
	letter: null,
	
	config: {
		
		id: 0,
		
		parameters: [],
		
	},
	
	constructor: function(config) {
		var me = this;
		
		//console.info(config);
		
		config = config || {};
		
		
		
		me.initConfig(config);
	},
	
	applyId: function(id) {
		return id ? id : Khusamov.svg.geometry.path.Command.generateId();
	},
	
	setParameter: function(index, value) {
		this.getParameters()[index] = value;
		return this;
	},
	
	toString: function() {
		return this.toArray().join(" ");
	},
	
	toArray: function() {
		return [this.letter].concat(this.getParameters());
	},
	
	toObject: function() {
		
	},
	
	clone: function() {
		return new this.self(this.toObject());
	},
	
	/*onClassExtended: function(cls, data) {
		var name = cls.getName().split(".");
		name = Ext.String.uncapitalize(name[name.length - 1]);
		Khusamov.svg.geometry.path.Command.map[data.letter] = name;
		
		console.dir(this);
		console.dir(cls.letter);
		
	}*/
	
}, function(Command) {
	
	Command.init();
	
	Command.onExtended(function(cls, data) {
		var name = cls.getName().split(".");
		name = Ext.String.uncapitalize(name[name.length - 1]);
		Command.map[data.letter] = name;
	});
	
});