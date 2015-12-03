
/* global Ext */

Ext.define("Khusamov.svg.geometry.path.splitter.linear.CycleSet", {
	
	requires: ["Khusamov.svg.geometry.path.splitter.linear.Cycle"],
	
	constructor: function() {
		var me = this;
		
		/**
		 * Массив циклов.
		 * @property {Khusamov.svg.geometry.path.splitter.linear.Cycle[]}
		 */
		me.cycles = [];
	},
	
	add: function(cycle) {
		var me = this;
		cycle = Ext.isArray(cycle) ? Ext.create("Khusamov.svg.geometry.path.splitter.linear.Cycle", cycle) : cycle;
		me.cycles.push(cycle);
	},
	
	/**
	 * Проверка наличия узла в циклах коллекции.
	 * @param {String} node
	 * @return {Boolean}
	 */
	contains: function(node) {
		var result = false;
		this.each(function(cycle) {
			if (cycle.contains(node)) result = true;
		});
		return result;
	},
	
	/**
	 * Цикл по всем циклам.
	 * @param {Function} callback
	 * @param {Khusamov.svg.geometry.path.splitter.linear.Cycle} callback.cycle
	 * @param {Number} callback.index
	 * @param {Object} [scope]
	 */
	each: function(callback, scope) {
		this.cycles.forEach(callback, scope);
	},
	
	/**
	 * Конвертация циклов в Khusamov.svg.geometry.Path.
	 * @return {Khusamov.svg.geometry.Path[]}
	 */
	toPath: function() {
		var me = this, result = [];
		me.cycles.forEach(function(cycle) {
			result.push(cycle.toPath());
		});
		return result;
	}
	
});