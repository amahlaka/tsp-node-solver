var Graph = require('js-data-structs');

var g = Graph.Graph(false, true);
const distances = require('./dist.json');
// OR
// Create a graph from an adjacency matrix


g.fromAdjMatrix(distances)

// Pass the start node
console.log(g.dijkstra(10));
console.log(g.DFS(10)); 
console.log(g.BFS(10)); 