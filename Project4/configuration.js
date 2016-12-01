"use strict";
/****************************************
 ****************************************
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


/****************************************
 ****************************************
 * Constants
 *
 * - Below are the constant values that will be used to decide
 * -    the number of cycles run, the number of kept each cycle
 ****************************************/
// How many generations should be executed given a "RunGenetic" button press?
var generations = 3000;
// How many generation should be executed given a "Continue" button press?
var extra_generations = 500;
// How many parents per generation (after children are produced, the population will be culled down to this level)
var population_size = 200;

/*************************************************************************************************************
 * Note: The below values are percentages (0 < percent < 1), since the protected values                      *
 *       (starting and ending cities) can't be modified, ensure that: ((mutation_rate + elites) < 1) == true *
 *************************************************************************************************************/

/****Reproduction****/
// How much dna should be swapped by parents
var percent_recombination = 0.3;
// How many children per generation (percent of population)
var reproduction_rate = 0.3;

/****Mutation****/
// What percent will protected from mutation (taken from the fittest sets)
var elites = 0.1;
// What percent of the population will be mutated
var patients = 0.2;
// What percent of a path's genome will be changed due to a mutation
var mutation_rate = 0.2;
// Weighted mutation lookup table. Split the table into several sections, giving 
//    each section an equal chance of being selected.
var weighted_selection = [0, 0.1, 0.3, 0.6, 1];

/****Safety Catch****/
// After how many runs should we start looking for a plateau? Can be integer or percent (of target generations) value.
var min_run = 1; // Set to 100% (i.e. no plateau catch)
// How long of a plateau is required before triggering an escape? Can be integer or percent (of target generations) value.
//    note: must be less than "min_run" value
var sets_monitored = 0.0001;

/****Catch and Release****/ //Play on words. This provides additional randomization if a local minima is reached.
// After how many runs should we start looking for a plateau? Can be integer or percent (of target generations) value.
var local_minima = 200;
// How long of a plateau is required before additional randomization is added?
//    note: must be less than "min_run" value
var local_plateau = 100;



/****************************************
 ****************************************
 * Algorithm assignment
 *
 * - From the list of available algorithms, the below assignments determine the
 * -    actual algorithms that will be used.
 ****************************************/
// What populate funciton will be used to produce the initial population (needs to be chosen from required functions at top of file)
var populate = random;
// What genetic funciton will be used to produce children (needs to be chosen from required functions at top of file)
var reproduction = crossover;
// What mutation algorithm will be applied (needs to be chosen from required functions at top of file)
var mutate = cosmic_radiation;




/* End of variable assignment section */




// Automated configuration factory. Don't modify the below code.

// Using the given path_length, return a valid configuration.
module.exports = {
  GetConfig: function(data) {
    var nodes = data.dimension;
    // If the population size is greater than (n-1)!, where n is the number of nodes
    //    we will have a population size beyond the number of possible permutations 
    //    for the total path. If that is the case, limit the population.
    var upper_population_limit = factorial(nodes - 1);
    if (upper_population_limit < population_size) {
      population_size = upper_population_limit;
    }

    // Using the user specified percentages, find the actual mutation parameters.
    var genes_to_swap = BoundCheck(mutation_rate, nodes);
    var genes_to_mutate = Math.floor(population_size * Percentage(percent_recombination));
    console.log('Swapping: ' + genes_to_mutate + ' genes per recombination');

    // Must have values other than the end caps to swap.
    if (nodes < (genes_to_swap + 2)) {
      console.error("Error in configuration parameters.");
      process.exit(1);
    }

    // Form and return the full configuration.
    var configuration = {
      population: population_size,
      generations: generations,
      extra_generations: extra_generations,

      populate: populate,
      genes_to_swap: genes_to_swap,
      reproduction_rate: reproduction_rate,

      genes_to_mutate = genes_to_mutate,
      patients: patients,
      elites: elites,
      weights: weighted_selection,

      min_run: min_run,
      sets_monitored: sets_monitored,

      reproduce: {
        method: reproduction(genes_to_swap),
        number: BoundCheck(reproduction_rate, population_size)
      },
      mutate: {
        method: mutate(genes_to_mutate),
        number: (population_size * Percentage(patients)),
        weights: weighted_selection
      },
      plateau: {
        minimum: BoundCheck(min_run, generations),
        target: BoundCheck(sets_monitored, generations)
      },
      elite_population_size: Math.ceil(population_size * Percentage(elites)),
      update: UpdateValue
    };
    return configuration;
  }
};

function UpdateValue(me, elementId, new_value) {
  configuration[elementId] = new_value;

  me.reproduce.method = reproduction(me.genes_to_swap);
  me.reproduce.number = BoundCheck(me.reproduction_rate, me.population_size);
  me.mutate.method = mutate(me.genes_to_mutate);
  me.mutate.number = BoundCheck(me.patients, me.population_size);
  me.pleateau.minimum = BoundCheck(me.min_run, me.generations);
  me.pleateau.target = BoundCheck(me.sets_monitored, me.generations);
  me.elite_population_size = BoundCheck(me.elites, me.population_size);
}

function BoundCheck(check_value, value_maximum) {
  if (check_value <= 0) {
    console.error('Error: Value not in acceptable range');
    process.exit(2)
  }
  if (check_value > 1) {
    return check_value;
  }
  else {
    return Math.ceil(check_value * value_maximum);
  }
}

function Percentage(check_value) {
  if (check_value > 1) {
    console.error('Error: Percent value not in acceptable range');
    process.exit(2)
  }
  else {
    return check_value
  }
}

// Recursively find the factorial value for a given integer.
function factorial(interger, running_product) {
  var product = (typeof running_product !== 'undefined') ? running_product : 1;
  interger = Math.floor(interger);
  if (interger > 0) {
    return factorial(interger - 1, product * interger)
  }
  else {
    return product;
  }
}
