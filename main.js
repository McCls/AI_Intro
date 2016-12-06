"use strict";

var readConcorde = require('./Project4/assignment-files/concordeFileReader.js');
var calc_dist = require('./Project4/tools/distance.js');
var cytoscape = require('./Project4/tools/cytoscape.js');
var GA_Init = require('./Project4/GA.js');

/****************************************
 ****************************************
 * Algorithms
 *
 * - Below are the available algorithms separated by use case
 ****************************************/
// Population algorithms
var polygonal_expansion = require('./Project4/populate/random');




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
    return document.getElementById(elementId).value;
}
function GetFileData()
{
    return readConcorde(files.getSelected());
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
    // Create a list to store all of the best paths and distances from each trial    
    var iterations = GetValueFor('starting_edge');
    
    // Start a timer to measure algorithm execution time.
    var beginning_time = Date.now();
    
    
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
    
    text.display('Best path:\n' + path_display + '\nBest Distance: ' + span + '\nAverage Distance: ' + span_sum/iterations + '\nAverage Execution Time: ' + total_time/iterations );
    chart.display(history.logs);
    graph.display(best, config.data);
    
    // End of timeout section    
    
    button.enable();
    }, 100);
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
    button.lastPress.logs = gaRun.logs;
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
