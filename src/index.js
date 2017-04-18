var monk = require('monk');
var express = require('express');
var app = express();

app.set('port', process.env.PORT);
app.use(express.static(__dirname + '/public'));

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
});

app.get('/', function(request, response) {
  response.send('Hello World!')
});

app.get('/abc', function(request, response) {
  response.send('You said abc')
});

