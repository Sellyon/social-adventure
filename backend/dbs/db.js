var MongoClient = require('mongodb').MongoClient

var state = {
  db: null,
  connections:0
};

exports.connect = function(url, done) {
  if (state.db) {
    return done();
  }

  MongoClient.connect(url, function(err, db) {
    if (err) {
      return done(err);
    }
    state.db = db;
    done();
  });
};

exports.get = function() {
  return state.db;
};

exports.close = function(done) {
  if (state.db) {
    state.connections = 0;
    /*state.db.close(function(err, result) {
      state.db = null;
      state.mode = null;
      if (err) {
        done(err);
      }
    });*/
  };
};