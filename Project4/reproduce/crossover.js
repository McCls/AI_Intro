var crossover_size;

function transcribe(core_dna, cross_dna, check_dna, crossover_point)
{
    for(var strand = 0; strand< cross_dna.length; strand++)
    {
        var core_index = core_dna.findIndex( function FindMatching(element) { return element == cross_dna[strand]; } );
        // If the core section of data would have a duplicate value
        if(core_index > 0 )
        {
            var cross_index = cross_dna.findIndex(function FindMatching(element) { return element == check_dna[strand]; });
            // Replace the duplicate
            if(cross_index < 0)
            {
                // Replace the duplicate value with a node that was completely removed
                core_dna[core_index] = check_dna[strand];
            }
            else
            {
                // The check value that would normally be used results in another duplicate
                var non_duplicate = find_non_duplicate(cross_dna, check_dna, cross_index);
                core_dna[core_index] = non_duplicate;
            }
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
    // validate_path(path2,path1,child1);
    var child2 = transcribe(parent2, crossover2, crossover1, crossover_point);
    // validate_path(path1,path2,child2);


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

function find_non_duplicate(cross, check, strand)
{
    var cross_index = cross.findIndex(function(element){return element == check[strand]});
    if(cross_index < 0)
    {
        return check[strand];
    }
    else
    {
        return find_non_duplicate(cross, check, cross_index);
    }
}
