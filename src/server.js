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
let pledgeCollectionName = 'pledges';

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

app.get('/api/getpledges', (req, res) => {
  let resultArr = [];
  mongo.connect(dbUrl, function(errConnecting, client) {
    if (errConnecting) {
      console.error('Error connecting to the database');
    } else {
      var db = client.db(databaseName);
      let cursor = db.collection(pledgeCollectionName).find();
      cursor.forEach(
        function(doc, err) {
          if (err) {
            console.error('error getting pledge list');
            console.error(err);
          } else {
            console.log(
              'Pledges list was successfully fetched from the database',
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

app.get('/api/pledgesfromuser/:address', function(req, res) {
  if (req.params.address.length > 0) {
    mongo.connect(dbUrl, function(errConnecting, client) {
      if (errConnecting) {
        console.error('Error connecting to the database');
        console.error(errConnecting);
      } else {
        console.log('Connected to database');
        var db = client.db(databaseName);
        db
          .collection(pledgeCollectionName)
          .find({
            address: req.params.address,
            isStakePaid: false,
          })
          .toArray(function(errFinding, documents) {
            if (errFinding) {
              console.error('Error finding the pledge');
              console.error(errFinding);
              res.send(JSON.stringify('error'));
            } else {
              if (documents.length === 0) {
                res.send(JSON.stringify('No pledges found'));
              } else {
                res.send(JSON.stringify(documents));
              }
            }
            client.close();
          });
      }
    });
  } else {
    res.send(JSON.stringify('Please provide an address'));
  }
});

app.get('/api/userexists/:address', function(req, res) {
  if (req.params.address.length > 0) {
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
              res.send(JSON.stringify('error'));
            } else {
              if (documents.length === 0) {
                res.send(JSON.stringify('User not found'));
              } else {
                res.send(JSON.stringify(documents[0]));
              }
            }
            client.close();
          });
      }
    });
  } else {
    res.send(JSON.stringify('Please provide an address'));
  }
});

app.post('/api/insertuser', (req, res) => {
  var user = {
    address: req.body.address,
    email: req.body.emailAddress,
    nickname: req.body.nickname,
  };
  console.log('user', user);

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

app.post('/api/insertpledge', (req, res) => {
  var pledge = {
    address: req.body.address,
    deadline: req.body.deadline,
    description: req.body.description,
    email: req.body.email,
    nickname: req.body.nickname,
    recipient: req.body.recipient,
    referee: req.body.referee,
    stake: req.body.stake,
    agreementId: req.body.agreementId,
    txHash: req.body.txHash,
    txConfirmed: req.body.txConfirmed,
    isStakePaid: req.body.isStakePaid,
    isPledgeConfirmed: req.body.isPledgeConfirmed,
  };

  mongo.connect(dbUrl, function(errConnecting, client) {
    if (errConnecting) {
      console.error('Error connecting to the database');
      console.error(errConnecting);
    } else {
      console.log('Connected to database');
      var db = client.db(databaseName);
      db
        .collection(pledgeCollectionName)
        .insertOne(pledge, function(errInserting, result) {
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
  res.send(pledge);
  res.end();
});

app.post('/api/updatepledge', (req, res) => {
  mongo.connect(dbUrl, function(errConnecting, client) {
    if (errConnecting) {
      console.error('Error connecting to the database');
      console.error(errConnecting);
    } else {
      console.log('Connected to database');
      var db = client.db(databaseName);
      db.collection(pledgeCollectionName).update(
        {agreementId: req.body.agreementId},
        {
          $set: {
            timestamp: req.body.timestamp,
            txConfirmed: req.body.txConfirmed,
          },
        },
        function(errInserting, result) {
          if (errInserting) {
            console.error('Error updating the pledge');
            console.error(errInserting);
          } else {
            console.log('Pledge was successfully updated');
            client.close();
          }
        },
      );
    }
  });
  res.send({'Updated success': 'Success'});
  res.end();
});

app.listen(port, () => console.log(`Listening on port ${port}`));
