var crossover_size;

function transcribe(core_dna, cross_dna, check_dna, crossover_point)
{
    for(var strand in cross_dna)
    {
        var index = core_dna.findIndex( function FindMatching(element) { return element == cross_dna[strand]; } );
        if(!( index <= 0 ))
        {
            core_dna[index] = check_dna[strand];
        }
    }
    // Now that data has been validated, re-insert the swapped portion.
    core_dna.splice.apply(core_dna, [crossover_point, 0].concat(cross_dna));
    return core_dna;
}

function crossover(path1, path2)
{
    if(path1.length != path2.length)
    {
        console.error("Sets not of equal size. Cannot create child.");
        process.exit(1);
    }
    var parent1 = path1.slice();
    var parent2 = path2.slice();
    
    var crossover_point = random_start(path1.length);
    
    // Find the crossover values
    var crossover1 = parent2.splice(crossover_point, crossover_size);
    var crossover2 = parent1.splice(crossover_point, crossover_size);
    
    // Validate the paths and remove duplicates, then insert the crossover sections
    var child1 = transcribe(parent1, crossover1, crossover2, crossover_point);
    var child2 = transcribe(parent2, crossover2, crossover1, crossover_point);

    return [child1, child2];
}

function random_start(array_size) {
    // Make sure that we don't overwrite the endpoints
    var wiggle_room = array_size - 1 - crossover_size;
    
    // Return an index that is offset from the start of the array
    var start_point = Math.floor(Math.random() * (wiggle_room)) + 1;
    return start_point;
}

module.exports = function (genes_to_cross)
{
    crossover_size = genes_to_cross;
    
    return crossover;
};
