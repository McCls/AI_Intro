var concorde = require('./TSP_utilities/concordeFileReader');
var agent = {};

// Locate each of the search agents that could be used
agent['brute'] = require('./Project1/brute');
agent['bfs'] = require('./Project2/bfs.js');
agent['dfs'] = require('./Project2/dfs.js');

// Process the user input data, and select the appropriate agent if that agent exists
var args = process.argv.slice(2);
if(!(args[0] in agent))
{
  console.error('Unknown search agent:' + args[0] +'. Terminating process.');
}
console.log('Searching using:' + args[0]);
var active_agent = agent[(args[0])];

// var path = concorde.verify(args, active_agent.path);
// var data = concorde.readFile(path);

// console.log(data.dimension + ' cities to path.')
// var best_trial = agent[(args[1])].process(data);

// console.log('Optimal path found:' + best_trial.route);
// console.log('Distance required to transverse:' + best_trial.distance);

//To run: node tsp.js agent_type file