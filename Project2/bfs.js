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
var best_path_to_node = [];
var branching_paths = [];

function breadthFirstSearch(data) {
  branching_paths = [ [map.S()] ];
  var results = 'unfinished';
  while(results === 'unfinished')
  {
    results = search_breadth_recursive(branching_paths, data);
  }
  
  return optimal_path;
}

function search_breadth_recursive(unsolved_branches, data) {
  if(unsolved_branches.length === 0)
  {
    return 'done';
  }
  else
  {
    var next_breadth_level = [];
    for(var branch in unsolved_branches)
    {
      var active_path = [];
      active_path = unsolved_branches[branch];
      // Find all paths from the last node on the active path
      var search_stack = map.P(active_path[active_path.length - 1]);
      
      if(search_stack === [ ])
      {
        // do nothing
      }
      else
      {
        // For each potential path, continue the bfs
        for(var node in search_stack)
        {
          // Clone path once for each child state, and check if it reaches the goal.
          var new_path = active_path.slice();
          new_path.push(search_stack[node]);
          
          if(search_stack[node] === map.G() )
          {
            // For paths that have reached the goal, check if they are better than previously found paths.
            CheckNewPathToGoal(new_path, data);
          }
          else
          {
            // To avoid infinite loops, only continue on paths with lengths less than the total number of cities in the set.
            // Additionally, to limit stack size, new paths are only accepted if they will result in better reaching the next node.
            if((new_path.length < data.dimension - 1) &&
               (A_Star_Verifies(new_path, data)))
            {
              next_breadth_level.push(new_path);
            }
          }
        }
      }
    }
  }
  branching_paths = next_breadth_level;
  // Using the new breadth level that was reached, continue searching.
  return 'unfinished';
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
      optimal_path.route_simplest = new_path;
    }
    
    if( optimal_path.distance > distance.calculate(data, new_path) )
    {
      optimal_path.route_shortest = new_path;
      optimal_path.distance = distance.calculate(data, new_path);
    }
  }
}

function A_Star_Verifies(pathToCheck, data)
{
  var node_in_question = pathToCheck[pathToCheck.length - 1];
  
  if(best_path_to_node[node_in_question] === undefined)
  {
    best_path_to_node[node_in_question] = {
      distance: distance.calculate(data, pathToCheck),
      waypoints: pathToCheck.length
    }
    return true;
  }
  else
  {
    if(distance.calculate(data, pathToCheck) < best_path_to_node[node_in_question].distance)
    {
      best_path_to_node[node_in_question].distance = distance.calculate(data, pathToCheck)
      return true;
    }
    return false;
  }
}

function path() {
  return __dirname;
}
