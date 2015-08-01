var Path = function (dom) {
	var MAXWIDTH = 1000,
		MAXHEIGHT = 800,
		nodes = {
			A: {
				x: 10,
				y: 100,
				edges: ["B", "C", "F"]
			},
			B: {
				x: 400,
				y: 400,
				edges: ["E"]
			},
			C: {
				x: 300,
				y: 50,
				edges: ["D", "B"]
			},
			D: {
				x: 600,
				y: 250,
				edges: ["G"]
			},
			E: {
				x: 800,
				y: 500,
				edges: ["D", "G"]
			},
			F: {
				x: 300,
				y: 700,
				edges: ["E"]
			},
			G: {
				x: 900,
				y: 100
			}
		},
		context = dom.getContext("2d");

	dom.width = MAXWIDTH;
	dom.height = MAXHEIGHT;

	function drawGraph() {
		context.clearRect(0, 0, MAXWIDTH, MAXHEIGHT);

		context.fillStyle = "black";
		context.strokeStyle = "#EEEEEE";
		context.lineWidth = "3";
		var node, edgeTarget;
		for (var prop in nodes) {
			console.log("Drawing "+ prop);

			node = nodes[prop];

			// context.fillRect(node.x, node.y, 10, 10);
			context.font = "16px sans-serif";
			context.fillText(prop, node.x - 5, node.y);

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

	drawGraph();
}