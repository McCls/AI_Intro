var distance = require('../TSP_utilities/pathCalculator.js');

var population;
var configuration;
var data;

module.exports = function genetic_algorithm(ga_configuration) {
  configuration = ga_configuration;
  
  return run;
};

function run(concorde_data)
{
  data = concorde_data;
  population = configuration.populate(configuration.population, data.dimension);
  
  initialize_populace(population);
  
  for(var rep = 0; rep < configuration.generations; rep++)
  {
    var children = generate_children();
    integrateIntoPopulace(children);
    population.sort( function(a,b) { return a[1] - b[1] })
    cullThePopulation();
    diversifyUsingMutation();
  }
  
  return population;
}

function initialize_populace()
{
  for(var person in population)
  {
    population[person][1] = distance.calculate(data, population[person][0]);
  }
}

function generate_children() {
  var parents = population.map(function(value,index) { return index; });
  var children = [];
  while(parents.length >= 2)
  {
    var parent1 = parents.splice(random_person(parents), 1);
    var parent2 = parents.splice(random_person(parents), 1);
    
    var offspring = configuration.reproduce(population[parent1][0], population[parent2][0]);
    for(var child = 0; child < offspring.length; child++)
    {
      children.push(offspring[child]);
    }
  }
  
  return children;
}

function random_person(population) {
    var random_index = Math.floor(Math.random() * (population.length));
    return random_index;
}

function integrateIntoPopulace(children)
{
  for(var child = 0; child < children.length; child++)
  {
    // Innocent until proven guilty
    var is_a_clone = false;
    for(var person = 0; person < population; person++) 
    {
      if (JSON.stringify(children[child]) == JSON.stringify(population[person][0]))
      {
        // Don't trust the clones.
        is_a_clone = true;
        break;
      }
    }
      
    if(is_a_clone == false)
    {
      var new_entry = [children[child], distance.calculate(data, children[child])];
      population.push(new_entry);
    }
  }
}

function BasedOnPathLength(a,b)
{
  if(a.distance > b.distance)
  {
    return 1;
  }
  else if(b.distance > a.distance)
  {
    return -1;
  }
  else
  {
    return 0;
  }
}

function cullThePopulation()
{
  while(population.length > configuration.population) 
  {
    population.pop();
  }
}

function diversifyUsingMutation()
{
  for(var mutants = 0; mutants < configuration.mutate.number; mutants++)
  {
    configuration.mutate.method(population[random_non_elite()][0]);
  }
}

function random_non_elite() {
  // Get an index and then adjust to keep the elites safe
  var random_index = Math.floor(Math.random() * (configuration.population - configuration.elite_population_size));
  return random_index + configuration.elite_population_size;
}
