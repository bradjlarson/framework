connect = require('connect');
connect.createServer(
    connect.static('compiled')
).listen(8080);
