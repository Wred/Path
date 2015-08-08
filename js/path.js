var Path = function (dom, nodes) {
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
		context.strokeStyle = COLOR_EDGES;
		context.lineWidth = "1";
		context.fillStyle = COLOR_EDGES;
		context.font = "12px sans-serif";

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

					midX = ((edgeTarget.x - node.x) / 2) + node.x;
					midY = ((edgeTarget.y - node.y) / 2) + node.y;

					context.fillText(Math.floor(nodeDistance(prop, edge)), midX, midY);
				});
			}
		}
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

		while (currentNode) {
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

		context.strokeStyle = "#0000EE";
		context.lineWidth = "3";
		context.fillStyle = "black";
		context.font = "10px sans-serif";

		for (var prop in pathTree) {
			node = nodes[prop];
			
			context.fillText(Math.floor(pathTree[prop].weight), node.x + 10, node.y);

			if (pathTree[prop].parent) {
				nodeParent = nodes[pathTree[prop].parent];

				context.beginPath();
				context.setLineDash([5, 15]);
				context.moveTo(node.x, node.y);
				context.lineTo(nodeParent.x, nodeParent.y);
				context.stroke();
			}
		}
	}

	function drawPath(arr) {
		context.strokeStyle = "#EE0000";
		context.lineWidth = "5";
		context.setLineDash([]);
				
		for (var i=0,l=arr.length - 1; i<l; i++) {
			context.beginPath();
			context.moveTo(nodes[arr[i]].x, nodes[arr[i]].y);
			context.lineTo(nodes[arr[i + 1]].x, nodes[arr[i + 1]].y);
			// context.arcTo(node.x, node.y, edgeTarget.x, edgeTarget.y, 50);
			// context.arc(node.x, node.y, )
			context.stroke();
		}
	}


	drawGraph();

	var path = findShortestPath("A", "H");

	drawPath(path);
};