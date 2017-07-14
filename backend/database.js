var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'keystroke_db'
});

module.exports = {
  connect: function() {
    console.log("connect")
    connection.connect();
  },
  query: function(q, callback) {
    connection.query(q, function(error, results, fields) {
      if(error) callback(null)
      callback(results)
    })
  },
  disconnect: function() {
    connection.end();
  },
  isConnected: function() {
    if(connection.threadId || connection) return true
    else return false
  }
}
