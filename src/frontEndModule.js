export function frontEndModule() {
  console.log('Front End Module Loaded');
}

// import mongodb from 'mongodb';
//
// var mongodb = require('mongodb');
// var MongoClient = mongodb.MongoClient;
// 
// var url;
// if (!!process.env.MONGOLAB_URI) {
//   url = process.env.MONGOLAB_URI;
// } else {
//   url = 'mongodb://localhost:27017/urls';
// }
// 
// var _db;
// module.exports = {
//   connectDb: function() {
//     MongoClient.connect(url, function(err_connect, db) {
//       if (err_connect) {
//         console.error('Error connecting to the database');
//       } else {
//         _db = db;
//         console.log('Connected to database');
//       }
//     });
//   },
// 
//   countDb: function() {
//     return _db.collection('routes').count();
//   },
// 
//   insertDb: function(index, newUrl) {
//     _db.collection('routes').insert(
//       {
//         _id: index,
//         url: newUrl,
//       },
//       function(insert_err, data) {
//         if (insert_err) console.log('Error inserting url');
//       },
//     );
//   },
// 
//   getDb: function() {
//     return _db;
//   },
// };
