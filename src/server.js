const express = require('express');
const bodyParser = require('body-parser');
const mongo = require('mongodb');
const app = express();

const port = process.env.PORT || 5000;
let dbUrl = process.env.MONGOLAB_URI || 'mongodb://localhost:27017';
let databaseName = 'buidltoday';
let userCollectionName = 'useraccounts';
let pledgeCollectionName = 'pledges';
let ACCESS_CONTROL_ALLOW_ORIGIN;
if (port === 5000) {
  // dev
  ACCESS_CONTROL_ALLOW_ORIGIN = 'http://localhost:3000';
} else {
  // prod
  ACCESS_CONTROL_ALLOW_ORIGIN = 'http://buidl.today';
}

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app.use(bodyParser.json());

app.use(function(req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', ACCESS_CONTROL_ALLOW_ORIGIN);
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Origin, Content-Type',
  );
  // Pass to next layer of middleware
  next();
});

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
          .aggregate([
            {
              $match: {
                $or: [
                  {
                    address: req.params.address,
                    isStakePaid: false,
                  },
                  {
                    recipient: req.params.address,
                    isStakePaid: false,
                  },
                  {
                    referee: req.params.address,
                    isStakePaid: false,
                  },
                ],
              },
            },
            {$sort: {deadline: 1}},
          ])
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

app.post('/api/requestwithdrawpledge', (req, res) => {
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
            withdrawTxHash: req.body.withdrawTxHash,
            isWithdrawTxConfirmed: req.body.isWithdrawTxConfirmed,
          },
        },
        function(errRequestingWithdrawPledge, result) {
          if (errRequestingWithdrawPledge) {
            console.error('Error updating the pledge');
            console.error(errRequestingWithdrawPledge);
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

app.post('/api/confirmwithdrawpledge', (req, res) => {
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
            txWithdrawalTimestamp: req.body.txWithdrawalTimestamp,
            isWithdrawTxConfirmed: req.body.isWithdrawTxConfirmed,
            isStakePaid: req.body.isStakePaid,
          },
        },
        function(errRequestingWithdrawPledge, result) {
          if (errRequestingWithdrawPledge) {
            console.error('Error updating the pledge');
            console.error(errRequestingWithdrawPledge);
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

app.post('/api/confirmpledge', (req, res) => {
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
            isPledgeConfirmed: req.body.isPledgeConfirmed,
            isPledgeConfirming: req.body.isPledgeConfirming,
          },
        },
        function(errRequestingWithdrawPledge, result) {
          if (errRequestingWithdrawPledge) {
            console.error('Error updating the pledge');
            console.error(errRequestingWithdrawPledge);
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
