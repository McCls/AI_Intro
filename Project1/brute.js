var distance = require('../TSP_utilities/pathCalculator.js')

module.exports = {
  process: permute,
  path: path
}

// Global variables to store values while in recursive function.
var optimal_path =   {
    route_shortest: {},
    distance: 0
  };
var usedChars = [];

function permute(data)
{
  if(data === '')
  {
    console.exit('No pathing data was recieved. Exiting.');
  }
  if(data.dimension < 3)
  {
    console.exit('Need 3 or more points to create a full circular path.');
  }

  // Create an array holding every city index except for the starting city '1'
  //    The starting city '1' is added as the initial and final points so that
  //    circular, non-repetative paths are generated.
  var city_array = [];
  var i;
  for(i = 0; i < data.dimension - 1; i++)
  {
    city_array[i] = i + 2;
  }

  //Initialize the optimal_path variables
  optimal_path.route = city_array.slice();
  optimal_path.route.push(1);
  optimal_path.route.unshift(1);
  optimal_path.distance = distance.calculate(data, optimal_path.route);

  permute_recursive(city_array, data);
  return optimal_path;
}

function permute_recursive(input, data)
{
  // Recursively loop through the array of cities, generating every possible
  //    permutation for the set.
  // This is adapted from code by SiGanteng found here: http://stackoverflow.com/questions/9960908/permutations-in-javascript
  var i, ch;
  var current_path;
  var current_distance;
  for (i = 0; i < input.length; i++) {
    ch = input.splice(i, 1)[0];
    usedChars.push(ch);
    if (input.length == 0)
    {
      current_path = usedChars.slice();
      current_path.push(1);
      current_path.unshift(1);
      current_distance = distance.calculate(data, current_path);

      if(current_distance < optimal_path.distance)
      {
        optimal_path.distance = current_distance;
        optimal_path.route_shortest = current_path;
      }
    }
    permute_recursive(input, data);
    input.splice(i, 0, ch);
    usedChars.pop();
  }
}

function path()
{
  return __dirname;
}
