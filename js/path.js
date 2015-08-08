var Path = function (dom, nodes, sourceNodeName, destinationNodeName) {
	var MAXWIDTH = 1300,
		MAXHEIGHT = 900,
		INFINITY = Number.MAX_SAFE_INTEGER,
		context = dom.getContext("2d"),
		COLOR_EDGES = "#CCCCCC";

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
		var node, edgeTarget, midX, midY;
		context.fillStyle = COLOR_EDGES;
		context.font = "12px sans-serif";

		for (var prop in nodes) {
			node = nodes[prop];
			if (node.edges) {
				node.edges.forEach(function (edge) {
					edgeTarget = nodes[edge];

					drawLine(COLOR_EDGES, 1, [5], prop, edge);

					midX = ((edgeTarget.x - node.x) / 2) + node.x;
					midY = ((edgeTarget.y - node.y) / 2) + node.y;

					context.fillText(Math.floor(nodeDistance(prop, edge)), midX, midY);
				});
			}
		}
	}

	function drawLine(color, width, dash, sourceNodeName, destinationNodeName) {
		context.strokeStyle = color;
		context.lineWidth = width;
		context.setLineDash(dash);
		context.fillStyle = color;

		context.beginPath();
		context.moveTo(nodes[sourceNodeName].x, nodes[sourceNodeName].y);
		context.lineTo(nodes[destinationNodeName].x, nodes[destinationNodeName].y);
		// context.arcTo(node.x, node.y, edgeTarget.x, edgeTarget.y, 50);
		// context.arc(node.x, node.y, )
		context.stroke();

		// draw arrow
		// get reverse angle
		var angle = Math.atan2(nodes[sourceNodeName].x - nodes[destinationNodeName].x, nodes[sourceNodeName].y - nodes[destinationNodeName].y);
 		angle += .05 * Math.PI;

		var arrowStartX = nodes[destinationNodeName].x + (Math.sin(angle) * 30);
		var arrowStartY = nodes[destinationNodeName].y + (Math.cos(angle) * 30);

 		angle -= .1 * Math.PI;

		var arrowEndX = nodes[destinationNodeName].x + (Math.sin(angle) * 30);
		var arrowEndY = nodes[destinationNodeName].y + (Math.cos(angle) * 30);

		
		context.setLineDash([]);
		context.beginPath();
		context.moveTo(arrowStartX, arrowStartY);
		context.lineTo(nodes[destinationNodeName].x, nodes[destinationNodeName].y);
		context.lineTo(arrowEndX, arrowEndY);
		// context.arcTo(node.x, node.y, edgeTarget.x, edgeTarget.y, 50);
		// context.arc(node.x, node.y, )
		context.closePath();
		context.stroke();
		context.fill();

	}

	function nodeDistance(sourceNodeName, destinationNodeName) {
		var source = nodes[sourceNodeName];
		var destination = nodes[destinationNodeName];
		return Math.sqrt(Math.pow(destination.x - source.x, 2) + Math.pow(destination.y - source.y, 2));
	}


	var pathTree;

	function findShortestPath(sourceNodeName, destinationNodeName) {
		// using Dijkstra's
		// return an array of points for shortest path

		// keep track of where we've been
		pathTree = {};

		// put first node in 
		pathTree[sourceNodeName] = {
			weight: 0
			// no parent
		}

		// create pathTree
		visitNode(sourceNodeName);

		drawPathTree();

		var shortestPath = [],
			currentNode = destinationNodeName;

		while (currentNode && pathTree[currentNode]) {
			shortestPath.splice(0, 0, currentNode);
			currentNode = pathTree[currentNode].parent;
		}

		return shortestPath;
	}


	function visitNode(nodeName) {
		var node = pathTree[nodeName],
			edges = nodes[nodeName].edges ? nodes[nodeName].edges : [];

		if (node.visited) {
			return;
		} else {
			node.visited = true;
		}

		for (var i=0,l=edges.length; i<l; i++) {
			if (!pathTree.hasOwnProperty(edges[i])) {
				// node hasn't been added
				pathTree[edges[i]] = {
					parent: nodeName,
					weight: node.weight + nodeDistance(nodeName, edges[i]),
					visited: false
				};
			} else {
				if (pathTree[edges[i]].weight > node.weight + nodeDistance(nodeName, edges[i])) {
					// this node is closer
					pathTree[edges[i]].parent = nodeName;
					pathTree[edges[i]].weight = node.weight + nodeDistance(nodeName, edges[i]);
				}
			}
			
			// recurse
			visitNode(edges[i]);
		}
	}



	function drawPathTree() {
		var node,
			nodeParent;

		context.fillStyle = "black";
		context.font = "10px sans-serif";

		for (var prop in pathTree) {
			node = nodes[prop];
			
			context.fillText(Math.floor(pathTree[prop].weight), node.x + 10, node.y);

			if (pathTree[prop].parent) {
				drawLine("#0000EE", 3, [10], pathTree[prop].parent, prop);
			}
		}
	}

	function drawPath(arr) {
		for (var i=0,l=arr.length - 1; i<l; i++) {
			drawLine("#EE0000", 5, [], arr[i], arr[i+1]);
		}
	}

	drawGraph();
	drawPath(findShortestPath(sourceNodeName, destinationNodeName));
};