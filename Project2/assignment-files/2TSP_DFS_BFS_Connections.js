// File for handling basic pathing functions belonging to the dfs and bfs problems in Project 2

// Since the project data was not given in standardized data storage file, the below values
//  represent the pathing tree specified in the Project 2 description. Normally, this would
//  not be hardcoded, but due to the very small data set provided, and lack of standardized
//  formating for that data, this was the fastest method.
var A = 0xA;
var B = 0xB;

var start = 1;
var goal = B;

var city_matrix = 
{
    //  1 2 3 4 5 6 7 8 9 A B <- Using Hex to keep good table format
    1: [ ,2,3,4, , , , , , , ],
    2: [ , ,3, , , , , , , , ],
    3: [ , , ,4,5, , , , , , ],
    4: [ , , , ,5,6,7, , , , ],
    5: [ , , , , , ,7,8, , , ],
    6: [ , , , , , , ,8, , , ],
    7: [ , , , , , , , ,9,A, ],
    8: [ , , , , , , , ,9,A,B],
    9: [ , , , , , , , , , ,B],
  0xA: [ , , , , , , , , , ,B],
  0xB: [ , , , , , , , , , , ]
}

// Nice prototyped array command written by user 'CMS' at: 
//   http://stackoverflow.com/questions/281264/remove-empty-elements-from-an-array-in-javascript
// This removes all empty entries in an array, and will allow for easy successor city retrieval. 
Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {         
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};

// Export the standard path searching functions
module.exports = {
    S: fetch_start,
    P: successors,
    G: fetch_goal,
    cost: uniform,
    city: city_matrix
}



function fetch_start()
{
    return start;
}

function successors(state)
{
    var successor_list = city_matrix[state].slice();
    return successor_list.clean();
}

function fetch_goal()
{
    return goal;
}

function uniform(pointA, pointB)
{
    return 1;
}