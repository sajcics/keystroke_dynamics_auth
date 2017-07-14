let calculations = require("./calculations.js")
let db = require("./database.js")

module.exports = function(app) {

  app.get('/',(req, res) => {
    res.send("Server is working")
  })

  app.post('/login', (req, res) => {
    let _query = "select * from users where username='"+req.body.username+"' and password='"+req.body.password + "'";
    if(db.isConnected() === false) db.connect()

    let results = db.query(_query, function(results){

      if(results && results.length > 0) {
        res.end('{"validUser" : true, "status" : 200, "id":'+results[0].id+'}');
      }
      res.end('{"validUser" : false, "status" : 200}');
    })
  })

  app.post("/calculation", (req, res) => {
    let userId=req.body.id
    let _query = "select count(*) as sum from samples where user_id="+userId;
    if(db.isConnected() === false) db.connect()

    let results = db.query(_query, function(results) {
      if(!results) {
        res.end('{"success" : false, "status" : 200, "error": "Could not get sum"}')
        return
      }
      let lastSample = req.body.data
      let newId = insertNewKeystroke(lastSample, results[0].sum+1, (newId) => {
        if(!newId) {
          res.end('{"success" : false, "status" : 200, "error": "Could not get new inserted id"}');
          return
        }
        if(results && parseInt(results[0].sum) >= 7 ) {
          getAllSamples(userId, lastSample, (passed) => {
            console.log("passed", passed)
            if(passed === "passed") res.end('{"success" : "valid", "status" : 200}')
            else res.end('{"success" : "not valid", "validUser": false, "status" : 200}')
          })
        } else if(results){
          insertNewSample(userId, newId, (affectedRows) => {
            if(affectedRows > 0) res.end('{"success" : true, "status" : 200}')
            else res.end('{"success" : false, "status" : 200, "error": "Could not save sample"}')
          })
        }
      })

    })
  })

}

function insertNewKeystroke(data, count, callback) {
  let sample = calculations.calculateTimings(data)

  let _queryInsert = "insert into keystrokes values (default,"+sample.uu+","+sample.ud+","+sample.dd+","+sample.du+")"
  if(db.isConnected() === false) db.connect()

  let results = db.query(_queryInsert, function(results){
      callback(results.insertId)
  })
}

function insertNewSample(userId, rowId, callback) {
  let _queryInsert = "insert into samples values ("+userId+","+rowId+")"
  if(db.isConnected() === false) db.connect()

  let results = db.query(_queryInsert, function(results){
      callback(results.affectedRows)
  })
}

function getAllSamples(userId, lastSample, callback) {

  let newLastSample = calculations.calculateTimings(lastSample)
  let _query="select sum(uu)/7 as uu, sum(dd)/7 as dd, sum(ud)/7 as ud, sum(du)/7 as du \
  from (select keystrokes.* from keystrokes, samples where id = keystroke_id and user_id="+userId+") sub1"

  if(db.isConnected() === false) db.connect()

  let results = db.query(_query, function(results) {
    let validUser = calculations.calculateManhattanDistance(results, newLastSample)
    if(validUser) callback("passed")
    else callback("not passed")
  })
}
