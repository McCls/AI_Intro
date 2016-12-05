"use strict"

var distance = require('./tools/distance.js');

var population;
var configuration;
var data;

module.exports = function genetic_algorithm(ga_configuration) {
  configuration = ga_configuration;
  
  return run;
};

function run(concorde_data, previous_population, previous_history)
{
  data = concorde_data;
  
  if(typeof previous_population === 'undefined')
  {
    population = configuration.populate(configuration.population, data.dimension);
    initialize_populace(population);
  }
  else
  {
    population = previous_population;
  }
  
  // Add to previous history if it exists
  var history = (typeof previous_history !== 'undefined') ?  previous_history : [];
  
  // Sort the population and save the best initial set in the populace
  population.sort( function(a,b) { return a[1] - b[1] });
  history.push(population[0][1]);
  
  for(var rep = 0; rep < configuration.generations; rep++)
  {
    console.log('generation: '+(rep+1));
    var children = generate_children();
    integrateIntoPopulace(children);
    population.sort( function(a,b) { return a[1] - b[1] });
    cullThePopulation();
    diversifyUsingMutation();
    history.push(population[0][1]);
  }
  
  population.sort( function(a,b) { return a[1] - b[1] });
  return {results: population, logs: history};
}

function initialize_populace()
{
  for(var person in population)
  {
    population[person][1] = distance.calculate(data, population[person][0]);
  }
}

function generate_children() {
  var children = [];
  while(children.length < configuration.reproduce.number)
  {
    var parent1 = random_person();
    var parent2 = random_person();
    while( parent1 == parent2 )
    {
      parent2 = random_person();
    }
    
    var offspring = configuration.reproduce.method( population[parent1][0], population[parent2][0] );
    for(var child = 0; child < offspring.length; child++)
    {
      children.push( offspring[child] );
    }
  }
  
  return children;
}

function random_person() {
  // Get the percentage sections of the population used for selection
  var lower = Math.floor(Math.random() * (configuration.mutate.weights.length - 1));
  var upper = lower + 1;
  
  // Assign the actual border index values that the percentage sections would relate to
  var lower_index = Math.floor(configuration.mutate.weights[lower] * configuration.population);
  var index_range = Math.ceil((configuration.mutate.weights[upper] - configuration.mutate.weights[lower]) * configuration.population);

  // Return a value somewhere in the index_range
  return Math.floor(Math.random() * index_range) + lower_index;
}

function integrateIntoPopulace(children)
{
  for(var child = 0; child < children.length; child++)
  {
    // Innocent until proven guilty
    var is_a_clone = false;
    var route_length = distance.calculate(data, children[child]);
    for(var person = 0; person < population.length; person++) 
    {
      if (route_length == population[person][1])
      {
        if(children[child].toString() == population[person][0].toString())
        {
          // Don't trust the clones.
          is_a_clone = true;
          break;
        }
      }
    }
      
    if(is_a_clone == false)
    {
      var new_entry = [children[child], route_length];
      population.push(new_entry);
    }
  }
}

function cullThePopulation()
{
  while(population.length > configuration.population) { population.pop(); }
}

function diversifyUsingMutation()
{
  for(var mutants = 0; mutants < configuration.mutate.number; mutants++)
  {
    var mutant = random_non_elite();
    configuration.mutate.method(population[mutant][0]);
    population[mutant][1] = distance.calculate(data, population[mutant][0]);
  }
}

function random_non_elite() {
  // Get an index and then adjust to keep the elites safe
  var random_index = Math.floor(Math.random() * (configuration.population - configuration.elite_population_size));
  return random_index + configuration.elite_population_size;
}

function APlateauWasReached(history)
{
    if(history.length > configuration.plateau.minimum)
    {
      var plateau = true;
      var end_value = history[history.length - 1];
      for(var index = 1; index < configuration.plateau.target; index++)
      {
        if(end_value != history[history.length - (index + 1)]){plateau=false; break;}
      }
    }
    return plateau;
}
