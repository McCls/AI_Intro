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


// What of the population will be mutated (patients), and what percentage will protected (elites)
// Note: these are percentage values (0 < percent < 1), since the protected values can't be modified, ((mutation_rate + elites) < 1)
var patients = 0.2;
var elites = 0.1;
// What percent of a path's genome will be changed due to a mutation
var mutation_rate = 0.05;

var percentage = { mutate: patients, protect: elites, mutation_rate: mutation_rate};

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
  GetConfig: function (path_length)
  {
    nodes = path_length;
    
    var genes_to_swap = Math.ceil(path_length * mutation_rate);
    var genes_to_mutate = population_size * mutation_rate;
    
    if(path_length < (genes_to_swap + 2))
    {
        console.error("Error in configuration parameters.");
        process.exit(1);
    }
    
    var configuration = 
    {
      populate: populate,
      reproduce: reproduce(genes_to_swap),
      mutate: { method: cosmic_radiation(genes_to_mutate), number: (population_size * patients) },
      
      // Constants and require elements, do not tamper with these values
      population: population_size,
      elite_population_size: population_size * elites,
      generations: generations,
    }
    
    return configuration;
  },
  
  GetPath: path_to_file()
}

function path_to_file() {
  return __dirname;
}

