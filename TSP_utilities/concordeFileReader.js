module.exports = {
  verify: function (args){
    var fs = require('fs');
    // 
    // // Verify that a single file name was entered.
    // if(args.length > 1)
    // {
    //   console.error("Too many arguments. Please select only a single file to process.");
    //   process.exit(1);
    // }
    // // Throw error if more than 1 file selected
    // else
    if(args.length < 1)
    {
      console.error("No file selected. No data to process, terminating instance.");
    }
    // One file was detected. Check that it exists.
    else
    {
      fs.exists('./bruteTSP/assignment-files/' + args[0].toString(), function(exists) {
        if(exists)
        {
          console.log('File found. Ready to parse.');
        }
        else{
          console.error(('File ./bruteTSP/assignment-files/' + args[0].toString() + ' not found. Check spelling and verify that file is located in the \'assignment-files\' folder.'));
        }
      });
    }
    return ('./bruteTSP/assignment-files/' + args[0].toString())
  },

  readFile: function (path){
    var fs = require('fs');
    var array = fs.readFileSync(path).toString().split("\n");
    var line;
    var concordeData = {
      name: {},
      dimension: {},
      cities: {}
    };

    // Check name
    if(array[0].split(' ')[0] === 'NAME:')
    {
      concordeData.name = array[0].split(' ')[1];
    }
    else {throwError(1);}

    // Check dimension
    if(array[4].split(' ')[0] === 'DIMENSION:')
    {
      concordeData.dimension = array[4].split(' ')[1];
    }
    else { throwError(3); }

    // Gather the distance values
    var cities = array.slice(7);
    for(i in cities)
    {
      concordeData.cities[i] = cities[i].split(' ');
      for(x in cities[i])
      {
        cities[i][x] = parseFloat(cities[i][x]);
      }
    }

    return concordeData;
  }
}

var throwError = function(message)
{
  console.error('Failure to parse concorde file. See error: ' + message.toString());
}
