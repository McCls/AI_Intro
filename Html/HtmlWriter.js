// Export the standard path searching functions
module.exports = {
    graph: fileWrite
}

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
            }
        }
    }
    return formattedCities;
}

function pathToCyto(path)
{
    var formattedEdges = [];
    for (var node = 0; node < path.length - 1; node++)
    {
        formattedEdges[node] = 
        {
            data:  { source: path[node], target: path[node + 1] }
        }
    }
    return formattedEdges;
}

function buildHtml(agent, file, cities, path, config)
{
    var title = '<title >Path generated using' + agent + '</title>';
    var source = '<script src="../cytoscape.js"></script>';
    var message = '<h1>Solved ' + file + ' using' + agent + '</h1> \
                   <h1>Ordered travel list: ' + config.path + '</h1> \
                   <h1>Distance to traverse: ' + config.distance + '</h1> \
                   <h1>Execution time: ' + config.time + ' milliseconds' + '</h1>';
    var page_style = '#cy {width: 100%;height: 100%;position: absolute;top: 0px;left: 0px;}'
    
    var elements = { nodes: cities, edges: path };
    var style = [{ 
        selector: 'node', 
        style: { 
            label: 'data(id)',
            'font-size': 3,
            height: 3, 
            width: 3, 
            'background-color': '#0033A0' } 
    },
    { 
        selector: 'edge', 
        style: { 
            'width': .75, 
            'line-color': '#E31B23', // Cardinal Red!
            'target-arrow-shape': 'none', 
            'target-arrow-fill': 'filled', 
            'target-arrow-color': '#E31B23', // Cardinal Red!
            'curve-style': 'bezier'
        } 
        
    }];

    var body = '<div id="cy"></div>                                             \
                <script>                                                        \
                    var cy = cytoscape({                                        \
                        container: document.getElementById(\'cy\'),             \
                        layout: { name: \'preset\'},                            \
                        style:' + JSON.stringify(style) + ',                    \
                        elements:' + JSON.stringify(elements) + '});            \
                </script>'
    
    return '                                                                    \
        <!DOCTYPE html>                                                         \
        <html><head>' + title + source + message + '</head>                     \
        <style>' + page_style +'</style>                                        \
        <body>' + body + '</body></html>';
};


function fileWrite(config)
{
    +new Date;
    var fs = require('fs');
    
    var fileName = __dirname+ '/Output/' + config.agent + '_' + Date.now() + '.html';
    var stream = fs.createWriteStream(fileName);
    
    stream.once('open', function(fd) {
      var html = buildHtml(config.agent, config.file, citiesToCyto(config.data), pathToCyto(config.path), config);
    
      stream.end(html);
    });
}
