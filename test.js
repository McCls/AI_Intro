var random = require('./Project4/populate/random.js');
var reproduce = require('./Project4/reproduce/crossover.js')

var output_folder = './Project4/results/';
var data = 'Total paths: ' + 1000 + '\n\n';

module.exports = function ()
{
var parent1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var parent2 = [3, 4, 2, 1, 10, 9, 7, 8, 6, 5];

var offspring = reproduce(parent1.slice(), parent2.slice(), 3, 4);

data = data + 'parent1: ' + parent1 + '\nparent2: ' + parent2 + '\n\n' +
    'child1: ' + offspring.child1 + '\n' + 'child2: ' + offspring.child2;

    return data;
};
// // Test of random.js
// for(var i=0; i < 1000; i++)
// {
//     var next = random(10);
//     var log = 'Path ' + i + ': ';
//     var city;
    
//     for (city in next) { log = log + next[city] + ' '; };
//     log = log.replace(/[\[\]&]+|,/g, ' ');
    
//     data = data + log + '\n';
// }


function createFolder(path)
{
    var fs = require('fs');

    var mkdirSync = function (folder_path) {
        try 
        {
            fs.mkdirSync(folder_path);
        } catch(e) {
            if ( e.code != 'EEXIST' ) throw e;
        }
    };
    
    mkdirSync(path);
}

function fileWrite(config)
{
    var fs = require('fs');
    
    var fileName = config.output_path + 'run_' + config.time_stamp + '.txt';
    var stream = fs.createWriteStream(fileName);
    
    stream.once('open', function(fd) { stream.end(config.data) });
}

