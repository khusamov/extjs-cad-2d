
Ext.define("Khusamov.svg.geometry.Angle", {
	
	statics: {
		
		DEGREE: "degree",
		
		RADIAN: "radian",
		
		degree: function(value) {
			return Ext.create("Khusamov.svg.geometry.Angle", value * Math.PI / 180);
		},
		
		radian: function(value) {
			return Ext.create("Khusamov.svg.geometry.Angle", value);
		}
			
	},
	
	config: {
		
		/**
		 * Значение в радианах.
		 */
		value: 0
		
	},
	
	constructor: function(config, unit) {
		var me = this;
		if (Ext.isNumber(config) || Ext.isString(config)) {
			unit = unit || Khusamov.svg.geometry.Angle.RADIAN;
			config = { value: config * (unit == Khusamov.svg.geometry.Angle.RADIAN ? 1 : Math.PI / 180) };
		}
		me.initConfig(config);
	},
	
	applyValue: function(value) {
		return Number(value);
	},
	
	get: function(unit, fixed) {
		unit = (unit ? unit : Khusamov.svg.geometry.Angle.RADIAN).toLowerCase();
		var result = this["get" + unit[0].toUpperCase() + unit.substr(1)].call(this);
		return fixed === undefined ? result : result.toFixed(fixed);
	},
	
	/**
	 * Получить значение в градусах.
	 */
	getDegree: function() {
		return this.getValue() * 180 / Math.PI;
	},
	
	/**
	 * Получить значение в радианах.
	 */
	getRadian: function() {
		return this.getValue();
	},
	
	toNumber: function(unit) {
		return this.get(unit);
	}
	
});