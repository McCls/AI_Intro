module.exports = {
  calculate: calculateDistance
}

function calculateDistance(data, route)
{
  var distance = 0;
  for(i = 0; i<data.dimension; i++)
  {
    // Reduce the city numbers by to get thier data indexes
    distance = distance + nextPathLength(data, route[i] - 1, route[i+1] - 1);
  }
  return distance;
}

function nextPathLength(data, city1, city2)
{
  var x_delta = data.cities[city1][1] - data.cities[city2][1];
  var y_delta = data.cities[city1][2] - data.cities[city2][2];

  return Math.sqrt(Math.pow(x_delta,2) + Math.pow(y_delta,2));
}
