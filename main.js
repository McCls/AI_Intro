"use strict";

var readConcorde = require('./Project4/assignment-files/concordeFileReader.js');
var calc_dist = require('./Project4/tools/distance.js');
var cytoscape = require('./Project4/tools/cytoscape.js');
var Chartist = require('./node_modules/chartist/dist/chartist.min.js');
var GA_Init = require('./Project4/GA.js');

/****************************************
 ****************************************
 * Algorithms
 *
 * - Below are the available algorithms separated by use case
 ****************************************/
// Population algorithms
var random = require('./Project4/populate/random');
// Reproduction algorithms
var crossover = require('./Project4/reproduce/crossover');
// Mutation algorithms
var cosmic_radiation = require('./Project4/mutate/cosmic_radiation');


/*****************************************************************************  Assignment of Default Values  **************************************************************/
var defaults = {};

/****************************************
 ****************************************
 * Defaults
 *
 * - Below are the default values that will be used to implement the standard genetic algorithm.
 * -    Included are values for reproduction, mutation, and re-evaluation in the event of a local minima.
 ****************************************/
// How many generations should be executed given a button press?
defaults.generations = 3000;
// How many parents per generation (after children are produced, the population will be culled down to this level)
defaults.population_size = 200;

/****Catch and Release****/ //Play on words. This provides additional randomization if a local minima is reached.
// After how many runs should we start looking for a plateau? Percent of target generations value.
defaults.local_start_check = .1;
// How long of a plateau is required before additional randomization is added?
//    note: must be less than "local_minima" value
defaults.local_plateau = .50;
// What percent of the sets will be replaced with random paths?
defaults.local_percent_escape = 0.25;

/*************************************************************************************************************
 *                      Note: The below values are all percentages (0 < percent < 1)                         *
 *************************************************************************************************************/
/****Reproduction****/
// How much dna should be swapped by parents
defaults.percent_geneswap = 0.3;
// How many children per generation (percent of population)
defaults.percent_reproduced = 0.3;

/****Mutation****/
// What percent will protected from mutation (taken from the fittest sets)
defaults.percent_elites = 0.1;
// What percent of the population will be mutated
defaults.percent_patients = 0.2;
// What percent of a path's genome will be changed due to a mutation
defaults.percent_mutated = 0.2;

// Weighted mutation lookup table. Split the table into several sections, giving 
//    each section an equal chance of being selected.
var weighted_selection = [0, 0.1, 0.3, 0.6, 1]; // Note: as this would be rather complex to put into a user input, it will only be set to this default value

/****Safety Catch****/
// After how many runs should we start looking for a plateau? Can be integer or percent (of target generations) value.
defaults.min_run = 1; // Set to 100% (i.e. no plateau catch)
// How long of a plateau is required before triggering an escape? Can be integer or percent (of target generations) value.
//    note: must be less than "min_run" value
defaults.percent_monitored = 0.0001;


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
var reproduce = crossover;
// What mutation algorithm will be applied (needs to be chosen from required functions at top of file)
var mutate = cosmic_radiation;


/***************************************************************************  Algorithm Configuration Generator  ************************************************************/
// Take in the settings for this concorde path and generate a GA configuration.
function GetConfig()
{
    var settings = GetSettings();
    
    // Form and return the full configuration.
    var configuration = 
    {
        generations: settings.generations,
        population: settings.population_size,
        elite_population_size: Math.ceil(settings.population_size * Percentage(settings.percent_elites)),
        
        populate: populate,
        reproduce: { method: reproduce(Percentage(settings.percent_geneswap) * settings.nodes), number: (settings.population_size * Percentage(settings.percent_reproduced))},
        mutate: { method: mutate(Math.floor(Percentage(settings.percent_mutated) * settings.nodes)), number: (settings.population_size * Percentage(settings.percent_patients)), weights: weighted_selection },
        plateau: { minimum: Math.ceil(Percentage(settings.local_start_check) * settings.generations), target: (Percentage(settings.local_pleateau) * settings.generations), number: (Percentage(settings.local_percent_escape) * settings.population_size) },
        
        data: settings.data
    };
    return configuration;
}



/***************************************************************************** Initialization of HTML Elements **************************************************************/

/*********************************************
 *********************************************
 * File list
 *
 * - Get the html file list instance
 *********************************************
 *********************************************/
var list = document.getElementById("selectableFiles");

/*--------->Chart Helper Functions<----------*/
var files = {};
files.getSelected = function() { return list.options[list.selectedIndex].value; };
/*-------------------------------------------*/
    


/*********************************************
 *********************************************
 * Text
 *
 * - Get the html instance for the on screen text display and text inputs
 *********************************************
 *********************************************/
var text_box = document.getElementById('results');
var input_boxes = Object.keys(defaults);

// Set the text boxes to their specified default values
setTimeout( function() 
{
  for(var box in input_boxes)
  {
    console.log(box);
        console.log(input_boxes[box]);
        document.getElementById(input_boxes[box]).defaultValue = defaults[input_boxes[box]];
        setTimeout(function(){document.getElementById(input_boxes[box]).value = defaults[input_boxes[box]];}, 5);
        
  }
}, 10);

/*--------->Text Helper Functions<-----------*/
var text = {};
text.display = function(txt) { text_box.innerHTML = '<pre>'+txt+'</pre>'; };
function GetValueFor(elementId) {
    var input_value = document.getElementById(elementId).value;
    if((input_value != undefined) && (input_value != ''))
    { return input_value; }
    else
    { return defaults[elementId]; }
}
function GetSettings()
{
    var file_data = readConcorde(files.getSelected());
    
    var settings = {};
    settings.data = file_data;
    settings.nodes = file_data.dimension;
    
    for(var box in input_boxes)
    { settings[input_boxes[box]] = GetValueFor(input_boxes[box]); }
    
    return settings;
}
/*-------------------------------------------*/



/*********************************************
  *********************************************
  * Cytoscape graph
  *
  * - Initialize the cytoscape graph to display tsp pathing
  *********************************************
  *********************************************/
var cy = cytoscape({
    container: document.getElementById('cy'),
    layout: { name: 'preset' },
    style: [{
        "selector": "node",
        "style": {
            "label": "data(id)",
            "font-size": 2,
            "height": 2,
            "width": 2,
            "background-color": "#0033A0"
        } }, 
        {
        "selector": "edge",
        "style": {
            "width": 0.75,
            "line-color": "#E31B23",
            "target-arrow-shape": "none",
            "target-arrow-fill": "filled",
            "target-arrow-color": "#E31B23",
            "curve-style": "bezier"
        } }],
    elements: {
        "nodes": [],
        "edges": []
    }
});

/*--------->Graph Helper Functions<----------*/
var graph = {};
graph.clear = function() { cy.nodes().remove(); cy.edges().remove(); };
graph.display = function(nodes, data) { addNodes(nodes,data); addEdges(nodes,data); setTimeout( function(){ cy.reset(); cy.fit(); cy.forceRender(); }, 500); };
function addNodes(nodes, data) { 
    for(var node in nodes) {
        var coordinates = calc_dist.xy(nodes[node], data);
        cy.add({ group: "nodes", data: { id: nodes[node] }, position: { x: coordinates[0] , y: coordinates[1] } }); }
}
function addEdges(nodes, data) {
    for(var node = 0; node + 1 < nodes.length; node++)
    { cy.add([ { group: "edges", data: { source: nodes[node], target: nodes[node+1] } } ]); }
}
/*-------------------------------------------*/



/*********************************************
  *********************************************
  * Fitness log chart
  *
  * - Get the html chartist chart instance
  *********************************************
  *********************************************/
var line_chart = document.getElementById('line_chart');

/*--------->Chart Helper Functions<----------*/
var chart = {};

chart.display = function(logs) { setTimeout( function(){ new Chartist.Line( line_chart, chart_data(logs), { height: '250px' } ); }, 500); };
/*-------------------------------------------*/



/*********************************************
  *********************************************
  * Initialize buttons
  *
  * Run
  * - Initialize a button so users can trigger GA runs
  * 
  * Continue
  * - Run the GA several additional generations
  *********************************************
  *********************************************/
var button = {};
button.run = document.getElementById('run');
button.continue = document.getElementById('continue');
button.lastPress = {};

// Default button states
button.run.disabled = false;
button.continue.disabled = true;

button.run.onclick = function()
{
    button.disable();
    graph.clear();
    
    setTimeout( function() 
    {
            
    // Start a timer to measure algorithm execution time.
    var beginning_time = Date.now();
    
    // Initialize a configuration for the genetic algorithm
    var config = GetConfig();
    
    var GA = GA_Init(config);
    
    // Execute the genetic algorithm
    var gaRun = GA(config.data);
    var best_survivor = gaRun.results[0];
    
    // Get the path of the best survivor
    var best = best_survivor[0];
    // Get the length of the best survivor
    var span = best_survivor[1];
    
    // Save the execution time for the algorithm
    var ending_time = Date.now();
    
    // Display a text output for the results of the GA
    //    Note: Due to html issues, manually wrap the text
    var path_display = '' + best[0];
    for(var node = 1; node < best.length; node++)
    {
        if((node + 1) % 15 == 0) { path_display = path_display + ',\n' + best[node]; }
        else { path_display = path_display + ', ' + best[node]; }
    }
    
    var total_time = ( ending_time - beginning_time );
    
    // Save values in case an Continue is requested.
    button.lastPress = gaRun;
    // Data must be saved individually in-case of a file selection change.
    button.lastPress.data = config.data;
    button.lastPress.configuration = config;
    button.lastPress.time = total_time;
    
    text.display('Best path:\n' + path_display + '\nTotal Distance: ' + span + '\nExecution Time: ' + total_time );
    chart.display(gaRun.logs);
    graph.display(best, config.data);
    
    // End of timeout section    
    }, 100);
    
    button.enable();
};

button.continue.onclick = function()
{
    button.disable();
    graph.clear();
    
    setTimeout( function() 
    {
    
    // Start a timer to measure algorithm execution time.
    var beginning_time = Date.now();
    
    // Execute the genetic algorithm using the data from the last run
    var gaRun = Continuation();
    var best_survivor = gaRun.results[0];
    
    // Get the path of the best survivor
    var best = best_survivor[0];
    // Get the length of the best survivor
    var span = best_survivor[1];
    
    // Save the execution time for the algorithm
    var ending_time = Date.now();
    
    // Display a text output for the results of the GA
    //    Note: Due to html issues, manually wrap the text
    var path_display = '' + best[0];
    for(var node = 1; node < best.length; node++)
    {
        if((node + 1) % 15 == 0) { path_display = path_display + ',\n' + best[node]; }
        else { path_display = path_display + ', ' + best[node]; }
    }
    
    var total_time = button.lastPress.time + ( ending_time - beginning_time );
    
    text.display('Best path:\n' + path_display + '\nTotal Distance: ' + span + '\nExecution Time: ' + total_time );
    chart.display(gaRun.logs);
    graph.display(best, button.lastPress.data);
    
    
    button.lastPress.results = gaRun.results;
    button.lastPress.log = gaRun.log;
    button.lastPress.time = total_time;
    
    // End of timeout section    
    }, 100);
    
    button.enable();
};


/*-------->Button Helper Functions<----------*/
button.disable = function() { setTimeout( function(){ for(var instance in button) { button[instance].disabled = true; } }, 100); };
button.enable = function() { setTimeout( function(){ for(var instance in button) { button[instance].disabled = false; } }, 100); };
function Continuation() 
{
    // Reinitialize the GA using any new user inputted values
    var config = GetConfig();
    config.data = button.lastPress.data;
    var GA = GA_Init(config);
    
    return GA(button.lastPress.data, button.lastPress.results, button.lastPress.logs);
}
/*-------------------------------------------*/



/*********************************************
  *********************************************
  * Extra helper functions
  * 
  * - general helper functions or functions too large to fit into their
  *      respective sections.
  *********************************************
  *********************************************/
function chart_data(history)
{
    var selective_history = [];
    var selected_labels = [];
    
    if(history.length < 40)
    {
        for(var index = 0; index < history.length; index++)
        {
            selected_labels.push(index);
            selective_history.push(history[index]);
        }
    }
    else
    {
        var division = Math.floor(history.length / 40);
        var postfix = pow10(division);
        for(var point = 0; point < history.length; point = point + division )
        {
            // Use scientific notation to ensure the graph is readable
            if(postfix < 2) { selected_labels.push(point); }
            else { selected_labels.push( scientific_notation(point) ); }
            
            selective_history.push(history[point]);
        }
        
        if(selected_labels[selected_labels.length - 1] != (history.length - 1))
        {
            selected_labels.push(history.length - 1);
            selective_history.push(history[history.length - 1]);
        }
    }
    
    return { labels: selected_labels, series: [selective_history] };
}

function pow10(number)
{
    var counter = { num: number, divs: 0 };
    while(counter.num > 10)
    {
        counter.num = counter.num / 10;
        counter.divs++;
    }
    return counter.divs;
}

function scientific_notation(number)
{
    if(number > 999) { return Math.round(number/Math.pow( 10, pow10(number) - 1 ) ) + "e" + ( pow10(number) - 1 ); }
    else { return number; }
}

function Percentage(check_value) {
  if (check_value > 1) {
    console.error('Error: Percent value not in acceptable range');
    process.exit(2);
  }
  else {
    return check_value;
  }
}
