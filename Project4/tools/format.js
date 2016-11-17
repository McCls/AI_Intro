function pathToCyto(path)
{
    var formattedEdges = [];
    for (var node = 0; node < path.length - 1; node++)
    {
        formattedEdges[node] = 
        {
            data:  { source: path[node], target: path[node + 1] }
        };
    }
    return formattedEdges;
}
module.exports = pathToCyto;

function citiesToCyto(data)
{
    var formattedCities = [];
    for(var city in data)
    {
        if(!isNaN(parseFloat(data[city][0])))
        {
            formattedCities[city] = 
            {
                data:  { id: parseFloat(data[city][0]) },
                position: { x: parseFloat(data[city][1]), y: parseFloat(data[city][2]) },
                locked: true
            };
        }
    }
    return formattedCities;
}
module.exports = citiesToCyto;


                        //     var fs = require(['fs']);
                        //     var files = fs.readdirSync('/assets/photos/');
                            
                        //     var select = $("#mySelect");
                        //     for (var file in files) {
                        //         var option = document.createElement('option');
                        //         option.innerHTML = files[file].ProduktName;
                        //         option.value = files[file].ProduktName;
                        //         select.append(option);
                        //     }
                        