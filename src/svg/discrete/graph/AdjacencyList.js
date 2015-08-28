
/**
 * Класс для хранения графа при помощи списков смежности.
 * 
 * Ограничения:
 * 1) Для алгоритма Дейкстры нельзя использовать отрицательные веса ребер.
 * 2) Не поддерживаются паралельные ребра.
 * 
 */

Ext.define("Khusamov.svg.discrete.graph.AdjacencyList", {
	
	config: {
		directed: false
	},
	
	constructor: function(config) {
		
		/**
		 * Хранилище графа.
		 * Формат: Object{ index: Object{ index: weight } }
		 * Перечислены все вершины с массивом соседних вершин с весами ребер до них.
		 * @readonly
		 * @property {Object}
		 */
		this.graph = {};
		
		this.initConfig(config);
	},
	
	/**
	 * Проложить путь в соседние вершины.
	 * add(index, list)
	 * add(from, to, weight)
	 */
	add: function(index, list) {
		if (arguments.length == 3) {
			var _list = {};
			_list[arguments[1]] = arguments[2];
			list = _list;
		}
		this.graph[index] = Ext.applyIf(this.graph[index] || {}, list);
		
		if (!this.getDirected()) {
			// Проложить обратные пути.
			Ext.Object.each(list, function(adjacentIndex, weight) {
				this.graph[adjacentIndex] = this.graph[adjacentIndex] || {};
				this.graph[adjacentIndex][index] = weight;
			});
		}
		
		return this;
	},
	
	/**
	 * Получить список соседних узлов.
	 * Возвращается массив с индексами узлов и весами ребер до них.
	 * @param {Number | String} index Номер узла.
	 * @return {Object}
	 */
	getAdjacent: function(index) {
		return Ext.Object.merge({}, 
			this.getForwardAdjacent(index), 
			this.getBackAdjacent(index)
		);
	},
	
	/**
	 * Получить прямых соседей, 
	 * на которые есть ориентированные пути от искомого узла.
	 * Возвращается массив с индексами узлов и весами ребер до них.
	 * @param {Number | String} index Номер узла.
	 * @return {Object}
	 */
	getForwardAdjacent: function(index) {
		return this.graph[index];
	},
	
	/**
	 * Получить обратных соседей, 
	 * от которых есть ориентированные пути к искомому узлу.
	 * Возвращается массив с индексами узлов и весами ребер до них.
	 * @param {Number | String} index Номер узла.
	 * @return {Object}
	 */
	getBackAdjacent: function(index) {
		var me = this, back = {};
		Ext.Object.each(me.graph, function(i, adjacent) {
			if (index in adjacent) back[i] = adjacent[index];
		});
		return back;
	},
	
	getWeight: function(from, to) {
		return this.graph[from][to];
	},
	
	getPathWeight: function(path) {
		var me = this, result = 0;
		var from = path[0];
		path.forEach(function(to, index) {
			if (index) {
				result += me.getWeight(from, to);
				from = to;
			}
		});
		return result;
	},
	
	/**
	 * Цикл по всем узлам. Будут доступны номер узла и массивы прямых ребер.
	 */
	each: function(fn, scope) {
		Ext.Object.each(this.graph, fn, scope);
	},
	
	/**
	 * Найти кратчайший путь из узла в самого себя.
	 * Используется алгоритм Дейкстры (только для ребер с положительным весом).
	 */
	findBackPath: function(index) {
		var me = this;
		var all = this.findPath(index);
		
		var min = { weight: Infinity };
		Ext.Object.each(me.getBackAdjacent(index), function(adjacentIndex, weight) {
			//weight += all[adjacentIndex][adjacentIndex];
			
			/*var path = Ext.Array.clone(all[adjacentIndex]);
			path.unshift(index);*/
			weight += me.getPathWeight(all[adjacentIndex]);
			
			
			
			
			
			/*var p = index;
			all[adjacentIndex].forEach(function(i) {
				weight += me.getWeight(p, i);
				p = i;
			});*/
			
			
			
			if (weight < min.weight) {
				min.weight = weight;
				min.index = adjacentIndex;
			}
		});
		
		/*var result = all[min.index];
		result[index] = min.weight;*/
		
		
		
		
		return all[min.index];
	},
	
	/**
	 * Поиск кратчайшего пути из одной вершины в другую.
	 * Используется алгоритм Дейкстры (только для ребер с положительным весом).
	 * Если to не определен, то на выходе объект с путями до всех узлов.
	 * @param {Number | String} from Откуда строить путь.
	 * @param {Number | String} [to] До куда строить путь.
	 * @return {Array | Object}
	 */
	findPath: function(from, to) {
		
		// Веса кратчайших путей от искомой до всех остальных.
		// Ключ это номер узла, значение = вес пути от искомой до данного узла.
		var distance = {};
		
		// Кратчайшие пути от искомой до всех остальных.
		// Формат: Object{ index: Array[index, index, ...] }
		var paths = {};
		
		
		// Список посещенных узлов. По алгоритму.
		var visited = [];
		
		this.each(function(index) {
			distance[index] = Infinity;
		});
		distance[from] = 0;
		
		var min;
		
		console.groupCollapsed(from);
		console.log(this.graph);
		
		
		do {
			
			min = null;
			
			Ext.Object.each(this.graph, function(index) {
				if (!Ext.Array.contains(visited, index)) {
					if (min == null || distance[index] < distance[min]) {
						min = index;
					}
				}
			});
			
			if (min != null) {
				
				visited.push(min);
				
				Ext.Object.each(this.getForwardAdjacent(min), function(index, weight) {
					if (!Ext.Array.contains(visited, index)) {
						if (distance[index] > distance[min] + weight) {
							distance[index] = distance[min] + weight;
							
							
							/*var predPath = Ext.Object.merge({}, path[min] || {});
							predPath[index] = distance[index];*/
							
							
							paths[index] = Ext.Array.clone(paths[min] || []);
							paths[index].push(index);
							
						}
					}
				});
				
				
				
				// debug
				var _distance = {};
				Ext.Object.each(this.graph, function(index) {
					_distance[index] = distance[index].toFixed(0);
				});
				console.info("distance", _distance);
				// / debug
				
				
			}
			

			
			
		} while (min != null)
		
		Ext.Object.each(paths, function(index, path) {
			path.unshift(from);
		});
		
		
		console.info("visited", visited);
		console.info("path", paths);
		console.groupEnd();
		
		
		
		return to == undefined ? paths : paths[to];
	}
	
});