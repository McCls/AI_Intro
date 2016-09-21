var map = require('./assignment-files/2TSP_DFS_BFS_Connections.js');
var distance = require('../TSP_utilities/pathCalculator.js')

module.exports = {
  process: depthFirstSearch,
  path: path
}

// Global variables to store values while in recursive function.
var optimal_path = {
  route_simplest: [ ],
  route_shortest: [ ],
  distance: undefined
};

function depthFirstSearch(data) {
  var path = [ map.S() ];
  var stack = map.P(map.S());                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
  search_depth_recursive(path, stack, data);
  
  return optimal_path;
}

function search_depth_recursive(active_path, search_stack, data) {
  if(search_stack.length === 0)
  {
    return 'done';
  }
  else
  {
    // Retrieve the last element on the current active path
    var active_node = search_stack.pop();
    if(active_node === '*') 
    {
      // We have search all children states of the last node
      // Go down a different path
      active_path.pop();
      search_depth_recursive(active_path, search_stack, data);
    }
    else
    {
      // Mark our forward movement
      search_stack.push('*');
      active_path.push(active_node);
      
      if(active_node === map.G())
      {
        CheckNewPathToGoal(active_path, data);
      }
      else
      {
        // Find the possible children states, and add them to the search_stack
        StackInOrder(search_stack, map.P(active_node));
      }
      search_depth_recursive(active_path.slice(), search_stack, data);
    }
  }
}

function StackInOrder(search_stack, children_nodes)
{
  if(children_nodes.length > 0)
  {
    children_nodes.reverse()
    var node;
    for(node in children_nodes)
    {
      // Put the nodes on the stack in reverse order, so that we search the
      //   table in order from least to greatest (i.e. alphabetically.
      search_stack.push(children_nodes[node]);
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
      optimal_path = new_path;
    }
    if(optimal_path.distance > distance.calculate(data, new_path))
    {
      optimal_path.route_shortest = new_path;
      optimal_path.distance = distance.calculate(data, new_path);
    }
  }
}

function path() {
  return __dirname;
}
