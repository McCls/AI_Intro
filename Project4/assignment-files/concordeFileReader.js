var fs = require('fs');

module.exports = function readFile(target) {
  
  switch(target) {
    case 'Random5':
        var array = fs.readFileSync(__dirname +'/Random5.tsp').toString().split("\n");
        break;
    case 'Random10':
        var array = fs.readFileSync(__dirname +'/Random10.tsp').toString().split("\n");
        break;
    case 'Random12':
        var array = fs.readFileSync(__dirname +'/Random12.tsp').toString().split("\n");
        break;
    case 'Random30':
        var array = fs.readFileSync(__dirname +'/Random30.tsp').toString().split("\n");
        break;
    case 'Random100':
        var array = fs.readFileSync(__dirname +'/Random100.tsp').toString().split("\n");
        break;
    default:
        throwError('Unknown file selected.');
  }
  
  var concordeData = {
    name: {},
    dimension: {},
    cities: {}
  };

  // Check name
  var name = array[0].split(' ');
  if (name[0] === 'NAME:') { concordeData.name = name[1]; }
  else { throwError('1st Line Should hold data-set NAME'); }

  // Check dimension
  var dimension = array[4].split(' ');
  if (dimension[0] === 'DIMENSION:') { concordeData.dimension = parseFloat(dimension[1]); }
  else { throwError('5th Line Should hold DIMENSION'); }

  // Gather the distance values
  var cities = array.slice(7);
  var i;
  for (i in cities) {
    if (typeof cities[i] === 'string') {
      concordeData.cities[i] = cities[i].split(' ');
      concordeData.cities[i][1] = parseFloat(concordeData.cities[i][1]);
      concordeData.cities[i][2] = parseFloat(concordeData.cities[i][2]);
    }
  }
  return concordeData;
}

var throwError = function(message) {
  console.error('Failure to parse concorde file. Error: ' + message.toString());
};
