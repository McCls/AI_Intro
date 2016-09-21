// File for handling basic pathing functions belonging to the dfs and bfs problems in Project 2

// Since the project data was not given in standardized data storage file, the below values
//  represent the pathing tree specified in the Project 2 description. Normally, this would
//  not be hardcoded, but due to the very small data set provided, and lack of standardized
//  formating for that data, this was the fastest method.
var A = 0xA;
var B = 0xB;

var start = 1;
var goal = B;

var city_matrix = {
    //  1 2 3 4 5 6 7 8 9 A B <- Using Hex to keep good table format
    1: function(){return [, 2, 3, 4,  ,  ,  ,  ,  ,  ,  ];},
    2: function(){return [,  , 3,  ,  ,  ,  ,  ,  ,  ,  ];},
    3: function(){return [,  ,  , 4, 5,  ,  ,  ,  ,  ,  ];},
    4: function(){return [,  ,  ,  , 5, 6, 7,  ,  ,  ,  ];},
    5: function(){return [,  ,  ,  ,  ,  , 7, 8,  ,  ,  ];},
    6: function(){return [,  ,  ,  ,  ,  ,  , 8,  ,  ,  ];},
    7: function(){return [,  ,  ,  ,  ,  ,  ,  , 9, A,  ];},
    8: function(){return [,  ,  ,  ,  ,  ,  ,  , 9, A, B];},
    9: function(){return [,  ,  ,  ,  ,  ,  ,  ,  ,  , B];},
  0xA: function(){return [,  ,  ,  ,  ,  ,  ,  ,  ,  , B];},
  0xB: function(){return [,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ];}
}

// Export the standard path searching functions
module.exports = {
    S: fetch_start,
    P: successors,
    G: fetch_goal,
    cost: uniform,
    city: city_matrix
}

function fetch_start() {
    return start;
}

function successors(state) {
    var successor_list = [];
    successor_list = city_matrix[state]();

    var cleaned_list = clean(successor_list);
    return cleaned_list;
}

// Nice prototyped array command written by user 'CMS' at: 
//   http://stackoverflow.com/questions/281264/remove-empty-elements-from-an-array-in-javascript
// This removes all empty entries in an array, and will allow for easy successor city retrieval. 
function clean(array) {
  var cleaned_array = [ ];
  for (var i in array) {
    if (!(array[i] ==  '')) {         
      cleaned_array.push(array[i]);
    }
  }
  return cleaned_array;
};

function fetch_goal() {
    return goal;
}

function uniform(pointA, pointB) {
    return 1;
}