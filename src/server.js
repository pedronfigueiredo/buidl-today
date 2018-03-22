const express = require('express');

const app = express();
const port = process.env.PORT || 5000;

const mongo = require('mongodb');

let dbUrl;
if (!!process.env.MONGOLAB_URI) {
  dbUrl = process.env.MONGOLAB_URI;
} else {
  dbUrl = 'mongodb://localhost:27017/test';
}

app.get('/api/hello', (req, res) => {
  res.send({express: 'Hello From Express'});
});

app.get('/api/get-data', (req, res) => {
  let resultArr = [];
  mongo.connect(dbUrl, function(errConnecting, db) {
    if (errConnecting) {
      console.error('Error connecting to the database');
    } else {
      // res.send('Connected to database');
      console.log('Connected to database');
      let cursor = db.collection('user-data').find();
      res.send('Cursor' + cursor);
      cursor.forEach(
        function(doc, err) {
          if (err) {
            console.error(err);
            //res.send('Error' + err);
          } else {
            //res.send('Pushing Element!');
            resultArr.push(doc);
          }
        },
        function() {
          db.close();
          console.log("Here's the content of the database", resultsArray);
        },
      );
    }
  });
});

// app.post('/api/insert', (req, res) => {
//   var item = {
//     title: req.body.title,
//     content: req.body.content,
//     author: req.body.author,
//   };
//
//   mongo.connect(dbUrl, function(errConnecting, db) {
//     if (errConnecting) {
//       console.error('Error connecting to the database');
//     } else {
//       console.log('Connected to database');
//       db
//         .collection('user-data')
//         .insertOne(item, function(errInserting, result) {
//           if (errInserting) {
//             console.error('Error inserting the element', item);
//           } else {
//             console.log('Item inserted', item);
//             db.close();
//           }
//         });
//     }
//   });
//   res.redirect('/');
// });

// app.post('/api/update', (req, res) => {});

// app.post('/api/delete', (req, res) => {});

app.listen(port, () => console.log(`Listening on port ${port}`));
