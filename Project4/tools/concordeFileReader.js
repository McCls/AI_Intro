var concordeFilePath;

module.exports = function(fileName)

function verify(args, path) {

  // Verify that a single file name was entered.
  console.log('Verifying file.');

  // Throw error if more than 1 file selected
  if (args.length > 2) {
    console.error("Too many arguments. Please select only a single file to process.");
    process.exit(1);
  }

  // One file was detected. Check that it exists.
  if (args.length > 1) {
    var pathToTest = path + '/assignment-files/' + args[1].toString();

    verifyFileExists(pathToTest);

    concordeFilePath = pathToTest;
  }
  else {
    console.error('No file specified.');
    process.exit(1);
  }

  console.log('Path recognized as: ' + concordeFilePath);
  return concordeFilePath;
}

function verifyFileExists(pathToTest) {
  try {
    fs.accessSync(pathToTest);
    console.log('File found. Ready to parse.');
  }
  catch (e) {
    console.error('File not found. Check spelling and verify that file is located in the \'assignment-files\' folder for the agent being used.');
    process.exit(1);
  }
}

function readFile(path) {
  console.log('Parsing data from: ' + path);
  var array = fs.readFileSync(path).toString().split("\n");
  var concordeData = {
    name: {},
    dimension: {},
    cities: {}
  };

  // Check name
  var name = array[0].split(' ');
  if (name[0] === 'NAME:') {
    concordeData.name = name[1];
  }
  else {
    throwError('1st Line Should hold data-set NAME');
  }

  // Check dimension
  var dimension = array[4].split(' ');
  if (dimension[0] === 'DIMENSION:') {
    concordeData.dimension = parseFloat(dimension[1]);
  }
  else {
    throwError('5th Line Should hold DIMENSION');
  }

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

function getX(cityId, data) {
  var cityIndex = cityId - 1;
  if (cityId != data.cities[cityIndex][0]) {
    console.error("Data not formatted correctly");
  }
  return data.cities[cityIndex][1];
}

function getY(cityId, data) {
  var cityIndex = cityId - 1;
  if (cityId != data.cities[cityIndex][0]) {
    console.error("Data not formatted correctly");
  }
  return data.cities[cityIndex][2];
}
