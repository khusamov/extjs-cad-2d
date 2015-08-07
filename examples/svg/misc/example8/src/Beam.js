
/**
 * Балка рамы окна.
 */

Ext.define("Example.Beam", {
	extend: "Khusamov.svg.desktop.surface.Piece",
	
	config: {
		index: null,
		frame: null,
		profileHeight: 0
	},
	
	points: [],
	
	baseLine: null,
	
	secondLine: null,
	
	initComponent: function() {
		var me = this;
		me.callParent(arguments);
		
		me.getFrame().on("ready", function() {
			var points = [];
			points.push(me.getFrame().getPoint(me.getIndex()));
			points.push(me.getFrame().getNextPoint(me.getIndex()));
			points.push(me.getIntersection(me.getSecondLine(), me.getFrame().getNextBeam(me.getIndex()).getSecondLine()));
			points.push(me.getIntersection(me.getSecondLine(), me.getFrame().getPrevBeam(me.getIndex()).getSecondLine()));
			var polygon = me.add({
				type: "polygon",
				attributes: {
					stroke: "black",
					"stroke-width": 1,
					fill: "transparent",
					points: points
				}
			});
			polygon.on("render", function() {
				polygon.getEl().on("click", function(e) {
					me.fireEvent("click", me, e);
				});
			});
			me.points = points;
		});
	},
	
	repaint: function() {
		var me = this;
		
		
		var points = [];
		points.push(me.getFrame().getPoint(me.getIndex()));
		points.push(me.getFrame().getNextPoint(me.getIndex()));
		points.push(me.getIntersection(me.getSecondLine(true), me.getFrame().getNextBeam(me.getIndex()).getSecondLine(true)));
		points.push(me.getIntersection(me.getSecondLine(true), me.getFrame().getPrevBeam(me.getIndex()).getSecondLine(true)));
		
		me.down().setPoints(points);
		
		me.points = points;
	},
	
	getBaseLine: function(recalc) {
		var me = this;
		if (!me.baseLine || recalc) {
			var from = me.getFrame().getPoint(me.getIndex());
			var to = me.getFrame().getNextPoint(me.getIndex());
			me.baseLine = me.getEquationLineByPoints(from, to);
		}
		return me.baseLine;
	},
	
	getSecondLine: function(recalc) {
		var me = this;
		if (!me.secondLine || recalc) {
			me.secondLine = me.getEquationParallelLine(me.getBaseLine(recalc), me.getProfileHeight());
		}
		return me.secondLine;
	},
	
	getEquationLineByPoints: function(from, to) {
		var x1 = from[0];
		var y1 = from[1];
		var x2 = to[0];
		var y2 = to[1];
		return {
			a: y1 - y2,
			b: x2 - x1,
			c: x1 * y2 - x2 * y1
		};
	},
	
	getEquationParallelLine: function(equation, h) {
		var a = equation.a;
		var b = equation.b;
		var c = equation.c;
		return {
			a: equation.a,
			b: equation.b,
			c: h * Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)) - c
		};
	},
	
	getIntersection: function(equation1, equation2) {
		var a1 = equation1.a;
		var b1 = equation1.b;
		var c1 = equation1.c;
		var a2 = equation2.a;
		var b2 = equation2.b;
		var c2 = equation2.c;
		var x = (c1 * b2 - c2 * b1) / (a1 * b2 - a2 * b1);
		var y = (a1 * c2 - a2 * c1) / (a1 * b2 - a2 * b1);
		return [x, y];
	}
	
});


