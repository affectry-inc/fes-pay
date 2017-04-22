var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var MongoUrl = process.env.MONGODB_URI || 'mongodb://db:27017/fes-pay';
var db = require('./lib/mongo')(
      {
        collections: ['events', 'tenants', 'cards'],
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

app.get('/', function(req, res) {
  res.render('index', {});
});

app.post('/yeah', function(req, res) {
  res.redirect('/yeah/' + req.body.card_id);
});

app.get('/yeah/:card_id', function(req, res) {
  db.cards.get(req.params.card_id, function(err, card){
    if (card) {
      res.render('edit_card', {action: 'update_card', card_id: req.params.card_id});
    } else {
      res.render('edit_card', {action: 'create_card', card_id: req.params.card_id})
    }
  });
});

app.post('/create_card/:card_id', function(req, res) {
  card = {};
  card.id = req.params.card_id;
  card.cardno = req.body.cardno;
  card.month = req.body.month;
  card.year = req.body.year;
  db.cards.save(card);

  res.render('edit_password', {card_id: req.params.card_id});
});

app.post('/update_card/:card_id', function(req, res) {
  db.cards.get(req.params.card_id, function(err, card){
    card.cardno = req.body.cardno;
    card.month = req.body.month;
    card.year = req.body.year;
    db.cards.save(card);

    res.render('edit_password', {card_id: req.params.card_id});
  });
});

app.post('/update_password/:card_id', function(req, res) {
  db.cards.get(req.params.card_id, function(err, card){
    card.password = req.body.password;
    db.cards.save(card);

    res.send('Card saved');
  });
});

app.get('/cards', function(req, res) {
  db.cards.all(function(err, cards){
    res.send(cards);
  });
});

