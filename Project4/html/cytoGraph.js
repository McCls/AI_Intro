"use strict";

var cytoscape = require('../tools/cytoscape.js');

module.exports = 
{
    init: cyto_graph,
    
}
    
function cyto_graph(id)
{
    cytoscape({
        container: document.getElementById(id),
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
}
