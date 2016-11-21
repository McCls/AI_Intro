"use strict";


var readConcorde = require('./Project4/assignment-files/concordeFileReader.js');
var calc_dist = require('./Project4/tools/distance.js');
var cytoscape = require('./Project4/tools/cytoscape.js');
var configuration = require('./Project4/configuration.js');
var GA_Init = require('./Project4/GA.js');

// Initialize the cytoscape graph
var cy = cytoscape({
    container: document.getElementById('cy'),
    layout: {
        name: 'preset'
    },
    style: [{
        "selector": "node",
        "style": {
            "label": "data(id)",
            "font-size": 2,
            "height": 2,
            "width": 2,
            "background-color": "#0033A0"
        }
    }, {
        "selector": "edge",
        "style": {
            "width": 0.75,
            "line-color": "#E31B23",
            "target-arrow-shape": "none",
            "target-arrow-fill": "filled",
            "target-arrow-color": "#E31B23",
            "curve-style": "bezier"
        }
    }],
    elements: {
        "nodes": [],
        "edges": []
    }
});

// Initialize the Run Button
var run_button = document.getElementById('run');
run_button.onclick = function() {
    cy.nodes().remove();
    cy.edges().remove();
    
    run_button.disabled = true;
    
    display('working');
    var list = document.getElementById("selectableFiles");
    var data = readConcorde(list.options[list.selectedIndex].value);
    
    // Start a timer to measure algorithm execution time.
    var beginning_time = Date.now();
    
    // Initialize a configuration for the genetic algorithm
    var settings = configuration.GetConfig(data.dimension);
    
    // Create a genetric algorithm using this configuration data
    var GA = GA_Init(settings);
    var best_survivor = GA(data).results[0];
    var best = best_survivor[0];
    var span = best_survivor[1];
    
    // Save the execution time for the algorithm
    var ending_time = Date.now();
    
    // Graph all nodes then all edges
    for(var node = 0; node + 1 < best.length; node++)
    {
        var coordinates = calc_dist.xy(best[node], data);
        console.log("Adding: " + best[node] + ' with position x:' + coordinates[0] +' y:' + coordinates[1])
        cy.add({
            group: "nodes",
            data: { id: best[node] },
            position: { x: coordinates[0] , y: coordinates[1] }
        });
    }
    for(var node = 0; node + 1 < best.length; node++)
    {
        var coordinates = calc_dist.xy(best[node], data);
        console.log("Adding: " + best[node] + ' with position x:' + coordinates[0] +' y:' + coordinates[1])
        cy.add([
            { group: "edges", data: { source: best[node], target: best[node+1] } }
        ]);
    }
    
    display('Best path: '+best+'\nTotal Distance: '+span+'\nExecution Time: '+(ending_time-beginning_time));
    
    cy.forceRender();
    cy.reset();
    cy.fit();
    
    run_button.disabled = false;
};

function display(text)
{
    document.getElementById('results').innerHTML = '<pre>'+text+'</pre>';
}
