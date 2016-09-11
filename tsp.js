var concorde = require('./TSP_utilities/concordeFileReader');
var agent = {};
agent['brute'] = require('./Project1/brute');

var args = process.argv.slice(2);
var path = concorde.verify(args);
var data = concorde.readFile(path);

console.log(data.dimension + ' cities to path.')
var best_trial = agent.permute(data);

console.log('Optimal path found:' + best_trial.route);
console.log('Distance required to transverse:' + best_trial.distance);
