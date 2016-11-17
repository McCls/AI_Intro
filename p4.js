var concorde = require('./TSP_utilities/concordeFileReader');
var GA_tools = require('./Project4/configuration');
var html = require('./Html/HtmlWriter');
var GA_Init = require('./Project4/GA');

module.exports = 
function run_project()
{
  // Process the user input data, and assign it to the appropriate variables
  var args = process.argv.slice(2);
  console.log('Genetic material collected from: \'' + args[0] + '\'');
  
  // Add algorithm type to match the previous projects where algorithm was specified
  args.unshift('GA');
  
  // Check that the user specified file exists
  var path = concorde.verify(args, GA_tools.GetPath);
  
  // Parse the concorde file and extract the data
  var data = concorde.readFile(path);
  // Notify the user as to the size of the set being parsed.
  console.log(data.dimension + ' cities to path. \n')
  
  // Start a timer to measure algorithm execution time.
  var beginning_time = Date.now();
  console.time('GA had an execution time of')
  
  // Initialize a configuration for the genetic algorithm
  var configuration = GA_tools.GetConfig(data.dimension);
  
  // Create a genetric algorithm using this configuration data
  var GA = GA_Init(configuration);
  
  var final_generation = GA(data);
  var best_survivor = final_generation[0];
  
  var best_trial = { route_shortest: best_survivor[0], distance: best_survivor[1]};
  
  // Report the execution time for the algorithm
  console.timeEnd('GA had an execution time of');
  var ending_time = Date.now();
  
  console.log('Best distance solution found:' + best_trial.route_shortest);
  console.log('Distance required to transverse:' + best_trial.distance);
  
  // Graph the results in a cyctoscape html file found in the Html/Output folder
  html.graph({
    agent: args[0],
    file: args[1],
    data: data.cities,
    path: best_trial.route_shortest,
    time: ending_time - beginning_time,
    distance: best_trial.distance,
    output_path: './Html/Output/'
  });
}
