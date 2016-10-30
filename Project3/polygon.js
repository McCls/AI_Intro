var distance = require('../TSP_utilities/pathCalculator.js')

module.exports = {
  process: polygonal_expansion,
  path: path
}

// Global variables to store values while in recursive function.
var optimal_path = {
  route_shortest: [ ],
  distance: undefined
};

function polygonal_expansion(data)
{
  if(data === '')
  {
    console.exit('No pathing data was recieved. Exiting.');
  }
  if(data.dimension < 3)
  {
    console.exit('Need 3 or more points to create a full circular path.');
  }

  var city_array = [];
  var i;
  for(i = 0; i < data.dimension; i++)
  {
    city_array[i] = i + 1;
  }

  // Initialize the optimal_path variables
  optimal_path.route_shortest = city_array.slice();
  optimal_path.route_shortest.push(1);
  optimal_path.route_shortest.unshift(1);
  optimal_path.distance = distance.calculate(data, optimal_path.route_shortest);

  // Find the best path from 3 different edge seeds
  MinMaxRandExpansion(city_array, data);
  return optimal_path;
}

function MinMaxRandExpansion(cities, data)
{
  var starting_edges = FindStartEdges(cities, data);
  var paths = {
    longest: [],
    shortest: [],
    random: []
  } 
  
  console.log('Longest edge: ' + starting_edges.longest)
  paths['longest'] = ExpandPolygon(starting_edges.longest, cities, data);
  console.log('Shortest edge: ' + starting_edges.shortest)
  paths['shortest'] = ExpandPolygon(starting_edges.shortest, cities, data);
  console.log('Random edge: ' + starting_edges.random)
  paths['random'] = ExpandPolygon(starting_edges.random, cities, data);
  
  var distances = {};
  for (var path in paths)
  {
    distances[path] = distance.calculate(data, paths[path]);
  }
  
  // Check if the path produced by the longest seeded edge is best
  if(( distances.longest <= distances.shortest ) &&
    ( distances.longest <= distances.random))
  {
    console.log("Using path generated from longest edge seed.")
    optimal_path.route_shortest = paths.longest;
    optimal_path.distance = distances.longest;
  }
  // Check if the path produced by the shortest seeded edge is best
  else if( distances.shortest <= distances.random )
  {
    console.log("Using path generated from shortest edge seed.")
    optimal_path.route_shortest = paths.shortest;
    optimal_path.distance = distances.shortest;
  }
  // Process of elimination leaves us with the path from the random seeded edge
  else
  {
    console.log("Using path generated from random edge seed.")
    optimal_path.route_shortest = paths.random;
    optimal_path.distance = distances.random;
  }
}

function FindStartEdges(cities, data)
{
  var edges = {
    longest: { distance: distance.calculate(data, [1, 2]), edge: [1,2] },
    shortest: { distance: distance.calculate(data, [1, 2]), edge: [1,2] },
    random: { edge: [0,0] }
  }
  
  // Get the longest and the shortest edges
  for( var start_node = 1; start_node < cities.length + 1; start_node++ )
  {
    for(var end_node = start_node + 1; end_node < cities.length + 1; end_node ++)
    {
      var distanceToCheck = distance.calculate(data, [start_node, end_node]);
      if(distanceToCheck > edges.longest.distance)
      {
        edges.longest = { distance: distanceToCheck, edge: [start_node, end_node] };
      }
      else if(distanceToCheck < edges.shortest.distance)
      {
        edges.shortest = { distance: distanceToCheck, edge: [start_node, end_node] };
      }
    }
  }
  
  // Get a pseudo-random edge
  while(
    (edges.random.edge[0] == edges.random.edge[1]) || // Make sure to select 2 distinct nodes
    (edges.random.edge == edges.longest.edge) || // Make sure that it is not the longest edge
    (edges.random.edge == edges.shortest.edge)) // Make sure that it is not the shortest edge
    {
      edges.random.edge[0] = Math.floor(Math.random() * cities.length) + 1;
      edges.random.edge[1] = Math.floor(Math.random() * cities.length) + 1;
    }
  
  return { 
    longest: edges.longest.edge,
    shortest: edges.shortest.edge,
    random: edges.random.edge
  };
}

function ExpandPolygon(initial_edge, cities, data)
{
  // Remove the visited cities
  var available_nodes = cities.slice();
  RemoveNodes(available_nodes, initial_edge);
  
  // Start the path with the initial edge. Loop back to the first node to
  //    get the path in Hameltonian form.
  var path = initial_edge.slice();
  path.push(initial_edge[0]);
  
  var section_to_expand = 
  {
    source_edge: [],
    target_node: []
  }
  
  while(available_nodes.length > 0)
  {
    section_to_expand = FindNearestNode(path, available_nodes, data);
    RemoveNodes(available_nodes, [section_to_expand.target_node])
    InsertNode(path, section_to_expand); console.log('Added node: '+section_to_expand.target_node + ' to edge: ' + section_to_expand.source_edge)
  }

  return path
}

function FindNearestNode(path, available_nodes, data)
{
  var least_costly_expansion = {
    source_edge: [path[0], path[1]],
    target_node: available_nodes[0],
  }
  
  // To ensure that the initial minimum is calculated as a clockwise, outward
  //    facing distance, we must check both sides of the initial edge
  var side1_cost = EdgeToPointCost(least_costly_expansion.source_edge, available_nodes[0], data)
  var side2_cost = EdgeToPointCost(least_costly_expansion.source_edge.reverse(), available_nodes[0], data)
  var minimum_cost;
  
  if(side1_cost >= 0)
  {
    minimum_cost = side1_cost;
  }
  else if(side2_cost >= 0)
  {
    minimum_cost = side2_cost;
  }
  else
  {
    var new_edge = least_costly_expansion.source_edge.slice();
    new_edge.splice(1, 0, least_costly_expansion.target_node);
    minimum_cost = distance.calculate(data, new_edge) - distance.calculate(data, least_costly_expansion.source_edge);
  }
  
  for(var i = 0; i < path.length - 1; i ++)
  {
    var selected_edge = [path[i], path[i+1]];
    for(var node in available_nodes)
    {
      var selected_node = available_nodes[node];
      var edge_to_node_cost = EdgeToPointCost(selected_edge, selected_node, data);
      
      // If we recieve an invalid cost, ignore it
      if(edge_to_node_cost >= 0)
      {
        if(edge_to_node_cost < minimum_cost)
        {
          least_costly_expansion.source_edge = [path[i], path[i+1]];
          least_costly_expansion.target_node = selected_node;
          
          minimum_cost = edge_to_node_cost;
        }
        else if(edge_to_node_cost == minimum_cost)
        {
          if(NewEdgeIsBetter(least_costly_expansion, {source_edge: selected_edge, target_node: selected_node}, data))
          {
            least_costly_expansion.source_edge = selected_edge;
            least_costly_expansion.target_node = selected_node;
            
            minimum_cost = edge_to_node_cost;
          }
        }
      }
    }
  }
  return least_costly_expansion
}

function NewEdgeIsBetter(current, alternative, data)
{
  var current_selection = current.source_edge.slice();
  current_selection.splice(1, 0, current.target_node)
  var alternative_selection = alternative.source_edge.slice();
  alternative_selection.splice(1, 0, alternative.target_node);
  
  return (distance.calculate(data, alternative_selection) < distance.calculate(data, current_selection));
}

function EdgeToPointCost(source_edge, target_node, data)
{
  // The cost to include the point is calculated as the perpendicular distance 
  //    from the edge of nodes 1 and 2 to the target node 3.
  // Note: Since the city numbers start at 1 we must subtract 1 to get the index
  var x1 = data.cities[source_edge[0] - 1][1];
  var x2 = data.cities[source_edge[1] - 1][1];
  var y1 = data.cities[source_edge[0] - 1][2];
  var y2 = data.cities[source_edge[1] - 1][2];
  var magnitude = distance.calculate(data, source_edge);
  
  var x3 = data.cities[target_node - 1][1];
  var y3 = data.cities[target_node - 1][2];
  
  // Edge's parallel vector
  var parallel_vector = [x2 - x1, y2 - y1]
  
  // Edge's perpendicular vector
  var perpendicular_vector = [(y2 - y1), -(x2 - x1)]
  
  // Make it an actual unit vector by scaling it by its inverse magnitude
  parallel_vector = parallel_vector.map(function(x) { return (x / magnitude); });
  perpendicular_vector = perpendicular_vector.map(function(x) { return (x / magnitude); });;
  
  // Vector to target node (from the center of the edge)
  var target_vector = {
    x: x3 - ((x2 + x1) / 2),
    y: y3 - ((y2 + y1) / 2)
  }
  
  // Find the components of the magnitude that are parallel and perpendicualr to the source edge
  var component_parallel = ((parallel_vector[0] * target_vector[0]) + (parallel_vector[1] * target_vector[1]));
  var component_perpendicular = ((perpendicular_vector[0] * target_vector[0]) + (perpendicular_vector[1] * target_vector[1]));

  var cost;
  if(component_perpendicular < 0)
  {
    // Expanding to this point would require that the edge expands backwards (towards the center of the polygon)
    //    To avoid having crossed lines, return an invalid value.
    cost = -1;
  }
  else if(Math.abs(component_parallel) < (magnitude / 2))
  {
    // The target point is closest to a location on the interior of the line segment
    cost = component_perpendicular;
  }
  else
  {
    // The target point is closest to one of the line segment's endpoints. Return the distance to the
    //    closest endpoint
    cost = Math.min(
      distance.calculate(data, [source_edge[0], target_node]), 
      distance.calculate(data, [source_edge[1], target_node]));
  }
  return cost;
}

function RemoveNodes(cities, edge)
{
  for(var endpoint = 0; endpoint < edge.length; endpoint ++)
  {
    for(var node = 0; node < cities.length; node++)
    {
      if(edge[endpoint] === cities[node])
      {
        cities.splice(node, 1);
      }
    }
  }
}

function InsertNode(path, expansion)
{
  for(var i = 0; i < path.length - 1; i++)
  {
    var current_section = [path[i], path[i+1]]
    if(JSON.stringify(expansion.source_edge) == JSON.stringify(current_section))
    { 
      path.splice(i + 1, 0, expansion.target_node);
      break;
    }
  }
}

function path()
{
  return __dirname;
}
