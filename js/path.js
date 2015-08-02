var Path = function (dom, nodes) {
	var MAXWIDTH = 1300,
		MAXHEIGHT = 900,
		INFINITY = Number.MAX_SAFE_INTEGER,
		context = dom.getContext("2d");

	dom.width = MAXWIDTH;
	dom.height = MAXHEIGHT;

	function drawGraph() {
		context.clearRect(0, 0, MAXWIDTH, MAXHEIGHT);
		drawEdges();
		drawVertexes();
	}

	function drawVertexes() {
		context.fillStyle = "black";
		var node;
		for (var prop in nodes) {
			node = nodes[prop];
			// context.fillRect(node.x, node.y, 10, 10);
			context.font = "16px sans-serif";
			context.fillText(prop, node.x - 5, node.y);
		}
	}

	function drawEdges () {
		var node, edgeTarget;
		context.strokeStyle = "#EEEEEE";
		context.lineWidth = "3";
		for (var prop in nodes) {
			node = nodes[prop];
			if (node.edges) {
				node.edges.forEach(function (edge) {
					edgeTarget = nodes[edge];

					context.beginPath();
					context.setLineDash([15, 5]);
					context.moveTo(node.x, node.y);
					context.lineTo(edgeTarget.x, edgeTarget.y);
					// context.arcTo(node.x, node.y, edgeTarget.x, edgeTarget.y, 50);
					// context.arc(node.x, node.y, )
					context.stroke();
				});
			}
		}
	}

	function nodeDistance(a, b) {
		return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
	}

	function findShortestPath(a, b) {
		// using Dijkstra's
		// we'll make our own copy of the nodes to keep track of visited etc
		var nodesCopy = {};

		for (var prop in nodes) {
			nodesCopy[prop] = {
				visited: false,
				weight: INFINITY
			}
		}
	}


	drawGraph();
}