var concorde = require('./TSP_utilities/concordeFileReader');
var html = require('./Html/HtmlWriter');
var agent = {};

// Locate each of the search agents that could be used
agent['brute'] = require('./Project1/brute');
agent['bfs'] = require('./Project2/bfs.js');
agent['dfs'] = require('./Project2/dfs.js');
agent['polygon'] = require('./Project3/polygon.js');

// Process the user input data, and select the appropriate agent if that agent exists
var args = process.argv.slice(2);
if(!((args[0]) in agent))
{
  console.error('Unknown search agent:' + args[0] +'. Terminating process.');
}
console.log('Searching using \'' + args[0] + '\' agent');
var active_agent = agent[(args[0])];

// Check that the user specified file exists
var path = concorde.verify(args, active_agent.path());
// Parse the concorde file and extract the data
var data = concorde.readFile(path);

var beginning_time = Date.now();
console.time(args[0] + ' had an execution time of')

console.log(data.dimension + ' cities to path. \n')
var best_trial = active_agent.process(data);

// Report the execution time for the algorithm
console.timeEnd(args[0] + ' had an execution time of');
var ending_time = Date.now();

// Based on the data returned, report the results
if('route_simplest' in best_trial)
{
    console.log('Path with least nodes found:' + best_trial.route_simplest);
}
console.log('Best distance solution found:' + best_trial.route_shortest);
console.log('Distance required to transverse:' + best_trial.distance);

// Graph the results in a cyctoscape html file found in the Html/Output folder
html.graph(
    {
      agent: args[0],
      file: args[1],
      data: data.cities,
      path: best_trial.route_shortest,
      time: ending_time - beginning_time,
      distance: best_trial.route_shortest
    }
  );

