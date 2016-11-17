"use strict";

var R = require('ramda');
var cytoscape = require('./Project4/tools/cytoscape.js');

var square = function square (x) { return x * x; }  
var squares = R.chain(square, [1, 2, 3, 4, 5]); 

var cy = cytoscape({
    container: document.getElementById('cy'),
    layout: {
        name: 'preset'
    },
    style: [{
        "selector": "node",
        "style": {
            "label": "data(id)",
            "font-size": 3,
            "height": 3,
            "width": 3,
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
        "nodes": [{
            "data": {
                "id": 1
            },
            "position": {
                "x": 25.816993,
                "y": 74.261603
            },
            "locked": true
        }, {
            "data": {
                "id": 2
            },
            "position": {
                "x": 32.352941,
                "y": 77.42616
            },
            "locked": true
        }, {
            "data": {
                "id": 3
            },
            "position": {
                "x": 34.477124,
                "y": 73.839662
            },
            "locked": true
        }, {
            "data": {
                "id": 4
            },
            "position": {
                "x": 35.702614,
                "y": 59.2827
            },
            "locked": true
        }, {
            "data": {
                "id": 5
            },
            "position": {
                "x": 29.084967,
                "y": 52.109705
            },
            "locked": true
        }, {
            "data": {
                "id": 6
            },
            "position": {
                "x": 21.650327,
                "y": 58.016878
            },
            "locked": true
        }, {
            "data": {
                "id": 7
            },
            "position": {
                "x": 22.46732,
                "y": 64.556962
            },
            "locked": true
        }, {
            "data": {
                "id": 8
            },
            "position": {
                "x": 28.676471,
                "y": 76.160338
            },
            "locked": true
        }, {
            "data": {
                "id": 9
            },
            "position": {
                "x": 31.862745,
                "y": 55.274262
            },
            "locked": true
        }, {
            "data": {
                "id": 10
            },
            "position": {
                "x": 25.571895,
                "y": 53.164557
            },
            "locked": true
        }, {
            "data": {
                "id": 11
            },
            "position": {
                "x": 24.183007,
                "y": 69.198312
            },
            "locked": true
        }, {
            "data": {
                "id": 12
            },
            "position": {
                "x": 29.820261,
                "y": 65.822785
            },
            "locked": true
        }],
        "edges": [{
            "data": {
                "source": 1,
                "target": 8
            }
        }, {
            "data": {
                "source": 8,
                "target": 2
            }
        }, {
            "data": {
                "source": 2,
                "target": 3
            }
        }, {
            "data": {
                "source": 3,
                "target": 12
            }
        }, {
            "data": {
                "source": 12,
                "target": 4
            }
        }, {
            "data": {
                "source": 4,
                "target": 9
            }
        }, {
            "data": {
                "source": 9,
                "target": 5
            }
        }, {
            "data": {
                "source": 5,
                "target": 10
            }
        }, {
            "data": {
                "source": 10,
                "target": 6
            }
        }, {
            "data": {
                "source": 6,
                "target": 7
            }
        }, {
            "data": {
                "source": 7,
                "target": 11
            }
        }, {
            "data": {
                "source": 11,
                "target": 1
            }
        }]
    }
});