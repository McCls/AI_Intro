var photons;

function cosmic_radiation(path) {
    
    for(var rep = 0; rep < photons; rep++)
    {
        var index_to_be_obliterated = random_index(path);
        
        var particle = path.splice(index_to_be_obliterated, 1);
        
        path.splice.apply(path, [path.length - 2, 0].concat(particle));
    }
}

function random_index(array) {
    var index = Math.floor(Math.random() * (array.length - 2)) + 1;
    return index;
}

module.exports = function(cosmic_rays)
{
    photons = cosmic_rays;
    
    return cosmic_radiation;
}
