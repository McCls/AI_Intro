var concorde = require('./concordeFileReader');

module.exports = {
    intersection: checkEdgeForIntersection,
    intersectionIfIncluded: checkNodeForPossibleIntersections,
    insert: InsertNode,
    remove: RemoveNodes
};

function checkEdgeForIntersection(edge, path, data) {
    var edgeStart = findEdgeIndexInPath(edge[0], path);
    var loopIndex = edgeStart + 1;
    if (edgeStart == -1) {
        console.error("Failed to find: " + edge + " in the specified path: " + path);
    }

    var intersection = {
        found: false,
        at: []
    };

    while ((loopIndex != edgeStart) &&
        (intersection.found == false)) {
        if (loopIndex >= path.length - 1) {
            // If we have reached the end of the path, loop back to the start.
            loopIndex = 0;
        }
        else {
            var loopedEdge = [path[loopIndex], path[loopIndex + 1]];

            if (Intersects(edge, loopedEdge, data)) {
                intersection.found = true;
                intersection.at = loopedEdge;
            }
            loopIndex++;
        }
    }

    return intersection;
}

function RotationDirection(p1x, p1y, p2x, p2y, p3x, p3y) {
    if (((p3y - p1y) * (p2x - p1x)) > ((p2y - p1y) * (p3x - p1x)))
        return 1;
    else if (((p3y - p1y) * (p2x - p1x)) == ((p2y - p1y) * (p3x - p1x)))
        return 0;

    return -1;
}

function FaceRotations(edge1, edge2, data) {
    var x1 = concorde.extractX(edge1[0], data);
    var y1 = concorde.extractY(edge1[0], data);
    var x2 = concorde.extractX(edge1[1], data);
    var y2 = concorde.extractY(edge1[1], data);
    var x3 = concorde.extractX(edge2[0], data);
    var y3 = concorde.extractY(edge2[0], data);
    var x4 = concorde.extractX(edge2[1], data);
    var y4 = concorde.extractY(edge2[1], data);

    var counterClockwiseFacings = [];
    counterClockwiseFacings.push(RotationDirection(x1, y1, x2, y2, x4, y4));
    counterClockwiseFacings.push(RotationDirection(x1, y1, x2, y2, x3, y3));
    counterClockwiseFacings.push(RotationDirection(x1, y1, x3, y3, x4, y4));
    counterClockwiseFacings.push(RotationDirection(x2, y2, x3, y3, x4, y4));

    return counterClockwiseFacings;
}

function Intersects(edge1, edge2, data) {
    if ((edge1[0] == edge2[1]) ||
        (edge2[0] == edge1[1])) {
        // The intersection is a shared vertex node, and should be ingnored
        return false;
    }


    var counterClockwiseFacings = FaceRotations(edge1, edge2, data);

    // If face 1 and face 2 rotate different directions and face 3 and face 4 rotate different directions, 
    // then the lines intersect.
    var intersect = (counterClockwiseFacings[0] != counterClockwiseFacings[1]) && (counterClockwiseFacings[2] != counterClockwiseFacings[3]);

    return intersect;
}

function findEdgeIndexInPath(node, path) {
    var index = -1;
    for (var i = 0; i < path.length; i++) {
        if (path[i] == node) {
            index = i;
            break;
        }
    }

    return index;
}

function checkNodeForPossibleIntersections(selected_edge, selected_node, path, data) {
    var potential_path = path.slice();
    InsertNode(potential_path, {
        source_edge: selected_edge,
        target_node: selected_node
    });

    var newEdge1_Intersection = checkEdgeForIntersection([selected_edge[0], selected_node], potential_path, data);
    var newEdge2_Intersection = checkEdgeForIntersection([selected_node, selected_edge[1]], potential_path, data);

    return (newEdge1_Intersection.found == true) || (newEdge2_Intersection.found == true);

}

function RemoveNodes(cities, edge) {
    for (var endpoint = 0; endpoint < edge.length; endpoint++) {
        for (var node = 0; node < cities.length; node++) {
            if (edge[endpoint] === cities[node]) {
                cities.splice(node, 1);
            }
        }
    }
}

function InsertNode(path, expansion) {
    for (var i = 0; i < path.length - 1; i++) {
        var current_section = [path[i], path[i + 1]];
        if (JSON.stringify(expansion.source_edge) == JSON.stringify(current_section)) {
            path.splice(i + 1, 0, expansion.target_node);
            break;
        }
    }
}
