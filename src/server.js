const express = require('express');
const bodyParser = require('body-parser');
const mongo = require('mongodb');
const app = express();

const port = process.env.PORT || 5000;
let dbUrl;
if (!!process.env.MONGOLAB_URI) {
  dbUrl = process.env.MONGOLAB_URI;
} else {
  dbUrl = 'mongodb://localhost:27017';
}
let databaseName = 'buidltoday';
let userCollectionName = 'useraccounts';

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app.use(bodyParser.json());

app.get('/api/hello', (req, res) => {
  res.send({express: 'Hello From Express'});
});

app.get('/api/getusers', (req, res) => {
  let resultArr = [];
  mongo.connect(dbUrl, function(errConnecting, client) {
    if (errConnecting) {
      console.error('Error connecting to the database');
    } else {
      var db = client.db(databaseName);
      let cursor = db.collection(userCollectionName).find();
      cursor.forEach(
        function(doc, err) {
          if (err) {
            console.error('error getting user list');
            console.error(err);
          } else {
            console.log(
              'Users list was successfully fetched from the database',
            );
            resultArr.push(doc);
          }
        },
        function() {
          client.close();
          res.send(resultArr);
          res.end();
        },
      );
    }
  });
});

app.get('/api/userexists/:address', function(req, res) {
  console.log('inside backend');
  if (req.params.address.length > 1) {
    mongo.connect(dbUrl, function(errConnecting, client) {
      if (errConnecting) {
        console.error('Error connecting to the database');
        console.error(errConnecting);
      } else {
        console.log('Connected to database');
        var db = client.db(databaseName);
        db
          .collection(userCollectionName)
          .find({address: req.params.address})
          .toArray(function(errFinding, documents) {
            if (errFinding) {
              console.error('Error finding the user');
              console.error(errFinding);
              res.send('error');
            } else {
              if (documents.length === 0) {
                res.send(JSON.stringify('User not found'));
              } else {
                res.send(JSON.stringify(documents[0]));
              }
              client.close();
            }
          });
      }
    });
  }
});

app.post('/api/insertuser', (req, res) => {
  var user = {
    address: req.body.address,
    email: req.body.emailAddress,
    nickname: req.body.nickname,
  };

  mongo.connect(dbUrl, function(errConnecting, client) {
    if (errConnecting) {
      console.error('Error connecting to the database');
      console.error(errConnecting);
    } else {
      console.log('Connected to database');
      var db = client.db(databaseName);
      db
        .collection(userCollectionName)
        .insertOne(user, function(errInserting, result) {
          if (errInserting) {
            console.error('Error inserting the user');
            console.error(errInserting);
          } else {
            console.log('User was successfully inserted');
            client.close();
          }
        });
    }
  });
  res.send(user);
  res.end();
});

app.listen(port, () => console.log(`Listening on port ${port}`));
