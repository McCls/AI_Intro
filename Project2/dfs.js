var map = require('./assignment-files/2TSP_DFS_BFS_Connections.js');

module.exports = {
  process: depthFirstSearch,
  path: path
}

// Global variables to store values while in recursive function.
var optimal_path = {
  route: {},
  distance: 0
};
var usedChars = [];

function depthFirstSearch(data) {
  var path = {};
  path.push(map.S());
  optimal_path.route = path;
  return optimal_path;
}

function permute_recursive(input, data) {

}

function path() {
  return __dirname;
}
