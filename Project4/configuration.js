/****************************************
 * Algorithms
 *
 * - Below are the available algorithms separated by use case
 ****************************************/
// Population algorithms
var random = require('./populate/random');

// Reproduction algorithms
var crossover = require('./reproduce/crossover');

// Mutation algorithms
var cosmic_radiation = require('./mutate/cosmic_radiation');

// Genetic algorithm. This is a generic function. It should not need to be changed
var genetic_algorithm = require('./GA');

/****************************************
 * Constants
 *
 * - Below are the constant values that will be used to decide
 * -    the number of cycles run, the number of kept each cycle
 ****************************************/
// Number of nodes in a path. This will be overwritten when the configuration is initialized
var nodes;
// How many generations
var generations = 100;
// How many parents per generation (after children are produced, the population will be culled down to this level)
var population_size = 100;

// Note: these are percentage values (0 < percent < 1), since the protected values can't be modified, ((mutation_rate + elites) < 1)
// How much dna should be swapped by parents
var percent_recombination = 0.3;
// How many children per generation (percent of population)
var reproduction_rate = 0.3
// What percent of the population will be mutated
var patients = 0.2;
// What percent will protected from mutation
var elites = 0.1;
// What percent of a path's genome will be changed due to a mutation
var mutation_rate = 0.05;

/****************************************
 * Algorithm assignment
 *
 * - From the list of available algorithms, the below assignments determine the
 * -    actual algorithms that will be used.
 ****************************************/
// What populate funciton will be used to produce the initial population (needs to be chosen from required functions at top of file)
var populate = random;

// What genetic funciton will be used to produce children (needs to be chosen from required functions at top of file)
var reproduce = crossover;

// What mutation algorithm will be applied (needs to be chosen from required functions at top of file)
var mutate = cosmic_radiation;


// Using the given path_length, return a valid configuration
module.exports = {
  GetConfig: function (nodes)
  {
    var upper_population_limit = factorial(nodes);
    if(upper_population_limit < population_size) { population_size = upper_population_limit; }
    
    var genes_to_swap = Math.ceil(nodes * mutation_rate);
    var genes_to_mutate = population_size * percent_recombination;
    console.log('Swapping: ' + genes_to_mutate + ' genes per recombination');
    
    // Must have values other than the end caps to swap.
    if(nodes < (genes_to_swap + 2))
    { console.error("Error in configuration parameters."); process.exit(1); }
    
    var configuration = 
    {
      populate: populate,
      reproduce: { method: reproduce(genes_to_swap), number: (population_size * reproduction_rate)},
      mutate: { method: mutate(genes_to_mutate), number: (population_size * patients) },
      population: population_size,
      elite_population_size: population_size * elites,
      generations: generations,
    }
    
    return configuration;
  },
}

function factorial(interger, product)
{
  var product = (typeof product !== 'undefined') ?  product : 1;
  interger = Math.floor(interger);
  
  if(interger > 0) { return factorial(interger - 1, product * interger) }
  else { return product; }
}
