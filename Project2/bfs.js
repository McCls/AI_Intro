var map = require('./assignment-files/2TSP_DFS_BFS_Connections.js')
var distance = require('../TSP_utilities/pathCalculator.js')

module.exports = {
  process: breadthFirstSearch,
  path: path
}

// Global variables to store values while in recursive function.
var optimal_path = {
  route_simplest: [ ],
  route_shortest: [ ],
  distance: undefined
};

function breadthFirstSearch(data) {
  var path = [ map.S() ];
  search_breadth_recursive(path, data);
  
  return optimal_path;
}

function search_breadth_recursive(active_path, data) {
  // Find all paths from the last node on the active path
  var search_stack = map.P(active_path[active_path.length - 1]);
  
  if(search_stack === [ ])
  {
    return 'done';
  }
  else
  {
    // For each potential path, continue the bfs
    for(var node in search_stack)
    {
      // Clone path once for each child state
      var new_path = active_path.slice();
      new_path.push(search_stack[node]);
      
      if(search_stack[node] === map.G() )
      {
        // For paths that have reached the goal, check if they are better than previously found paths.
        CheckNewPathToGoal(new_path, data);
      }
      else
      {
        if(new_path.length < data.dimension - 1)
        {
          // To avoid infinite loops, only continue on paths with lengths less than the set.
          search_breadth_recursive(new_path, data);
        }
      }
    }
  }
}

function CheckNewPathToGoal(new_path, data)
{
  if(optimal_path.distance === undefined)
  {
    optimal_path.route_shortest = new_path;
    optimal_path.route_simplest = new_path;
    optimal_path.distance = distance.calculate(data, new_path);
  }
  else
  {
    if(optimal_path.route_simplest.length > new_path.length)
    {
      console.log(new_path);
      optimal_path.route_simplest = new_path;
    }
    
    if( optimal_path.distance > distance.calculate(data, new_path) )
    {
      console.log(distance.calculate(data, new_path))
      optimal_path.route_shortest = new_path;
      optimal_path.distance = distance.calculate(data, new_path);
    }
  }
}

function path() {
  return __dirname;
}
