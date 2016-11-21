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
    }, 
        {
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
    var gaRun = GA(data);
    var best_survivor = gaRun.results[0];
    CreateHistoryLog(gaRun.logs);
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

var RGraph = require("./rgraph/libraries/RGraph.line.js");
function CreateHistoryLog(data)
{
    var milestones = Math.ceil(data.length/10);
    var markers = [];
    for(var mile=0; mile <  milestones; mile++)
    {
        for(var count = 0; count < 9; count++)
        {
            markers.push('');
        }
        markers.push((mile+1)*10)
    }
    
    var line1 = new RGraph.Line('line1', data);
    line1.Set('chart.background.grid', true);
    line1.Set('chart.linewidth', 5);
    line1.Set('chart.gutter.left', 35);
    line1.Set('chart.hmargin', 5);
    if (RGraph.isIE9up()) {
        line1.Set('chart.shadow', true);
    }
    line1.Set('chart.tickmarks', null);
    line1.Set('chart.xticks', 8);
    line1.Set('chart.colors', 'blue');
    line1.Set('chart.labels', markers);
    line1.Set('chart.key', 'Sales (not good)');
    line1.Set('chart.key.shadow', true);
    line1.Set('chart.key.shadow.offsetx', 0);
    line1.Set('chart.key.shadow.offsety', 0);
    line1.Set('chart.key.shadow.blur', 15);
    line1.Set('chart.key.shadow.color', '#ddd');
    line1.Set('chart.key.rounded', true);
    line1.Set('chart.key.position', 'graph');
    line1.Set('chart.key.position.x', line1.Get('chart.gutter.left') + 4);
    line1.Set('chart.key.position.y', (line1.canvas.height / 2) + 5);
    line1.Set('chart.xaxispos', 'center');
    line1.Set('chart.background.grid.autofit', true);
    line1.Set('chart.background.grid.autofit.numhlines', 10);
    line1.Set('chart.title', 'Best Path Length');
    line1.Set('chart.curvy', true);
    line1.Set('chart.curvy.factor', 0.25);
    line1.Set('chart.animation.unfold.x',false);
    line1.Set('chart.animation.unfold.y',true);
    line1.Set('chart.animation.unfold.initial',0);
    RGraph.Effects.Line.Unfold(line1);
}

function display(text)
{
    document.getElementById('results').innerHTML = '<pre>'+text+'</pre>';
}
