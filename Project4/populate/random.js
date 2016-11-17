function populate(numberOfPaths, nodesPerPath)
{
    var population = [];
    
    for(var index = 0; index < numberOfPaths; index++)
    {
        population.push([path(nodesPerPath), undefined]);
    }

    return population;
}

function path(length)
{
    // Initialize the array with every city in order 
    // (note: node 1 is excluded, as it will be the starting city)
    var cities = [];
    for(var i=1; i<length; i++)
    {
        cities.push(i+1);
    }
    
    // randomly select a city form the available cities, and add it to a new path
    var new_path = [];
    while(cities.length > 0)
    {
        var index = random_index(cities.length);
        new_path.push(cities[index]);
        cities.splice(index,1);
    }
    new_path.unshift(1);
    new_path.push(1);
    
    verify(new_path);
    
    return new_path;
}

function random_index(array_size) {
    var random_index = Math.floor(Math.random() * (array_size));
    return random_index;
}

function verify(array)
{
    var unique;
    for(var index = 0; index < array.length; index++)
    {
        
    }
}

module.exports = populate;
