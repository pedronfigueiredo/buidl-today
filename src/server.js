const express = require('express');

const app = express();
const port = process.env.PORT || 5000;

const mongo = require('mongodb');

let dbUrl;
if (!!process.env.MONGOLAB_URI) {
  dbUrl = process.env.MONGOLAB_URI;
} else {
  dbUrl = 'mongodb://localhost:27017';
}

app.get('/api/hello', (req, res) => {
  res.send({express: 'Hello From Express'});
});

app.get('/api/getusers', (req, res) => {
  let resultArr = [];
  mongo.connect(dbUrl, function(errConnecting, client) {
    if (errConnecting) {
      console.error('Error connecting to the database');
    } else {
      var db = client.db('buidltoday');
      let cursor = db.collection('useraccounts').find();
      cursor.forEach(
        function(doc, err) {
          if (err) {
            console.error(err);
          } else {
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

app.post('/api/insertuser', (req, res) => {
  //var item = {
  //  address: req.body.address,
  //  email: req.body.email,
  //  nickname: req.body.nickname,
  //};

  // bunch of tests
  // bunch of tests

  console.log('lets do it');
  console.log('req.body', req.body);
  // "proxy": "http://localhost:5000/",
  // "proxy": "https://localhost:5000",
  // "proxy": {
  //   "/api": {
  //     "target": "http://localhost:5000",
  //     "secure": false
  //   }
  // },

  // res.send(req);
  // var item = {
  //   address: 'address',
  //   email: 'email',
  //   nickname: 'nickname',
  // };
  // mongo.connect(dbUrl, function(errConnecting, client) {
  //   if (errConnecting) {
  //     console.error('Error connecting to the database');
  //   } else {
  //     console.log('Connected to database');
  //     // var db = client.db('buidltoday');
  //     // db.collection('useraccounts').insertOne(item, function(errInserting, result) {
  //     //     if (errInserting) {
  //     //       console.error('Error inserting the element');
  //     //     } else {
  //     //       db.close();
  //     //     }
  //     //   });
  //   }
  // });
});

// app.post('/api/update', (req, res) => {});

// app.post('/api/delete', (req, res) => {});

app.listen(port, () => console.log(`Listening on port ${port}`));
