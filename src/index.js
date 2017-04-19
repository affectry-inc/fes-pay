var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var MongoUrl = process.env.MONGODB_URI || 'mongodb://db:27017/fes-pay';
var db = require('./lib/mongo')(
      {
        collections: ['events', 'tenants', 'users'],
        mongoUri: MongoUrl
      }
    );

app.set('port', process.env.PORT);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
});

var photoList = [
    {
        id: "001",
        name: "photo001.jpg",
        type: "jpg",
        dataUrl: "http://localhost:3000/data/photo001.jpg"
    },{
        id: "002",
        name: "photo002.jpg",
        type: "jpg",
        dataUrl: "http://localhost:3000/data/photo002.jpg"
    }
]

app.get('/', function(req, res) {
  res.render("index", {photo: photoList[0]});
});

app.get('/abc', function(req, res) {
  res.send('you said abc');
});

app.get('/photo/:id', function(req, res) {
  var photo;
  for (i = 0; i < photoList.length; i++){
    if (photoList[i].id == req.params.id){
      var photo = photoList[i];
    }
  }
  res.render('index', {photo: photo})
});

app.post('/create', function(req, res) {
  console.log(req.body);
  user = {};
  user.id = 'U001';
  user.name = req.body.name;
  db.users.save(user);

  res.send('USER saved - name:' + req.body.name);
});

app.get('/user/:id', function(req, res) {
  db.users.get(req.params.id, function(err, user){
    res.render('user', {user: user})
  });
});
