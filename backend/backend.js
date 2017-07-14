let express = require("express")
let bodyParser = require('body-parser')
let routes = require("./routes.js")

let app = express()


app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json())
routes(app)

let server = app.listen(8000, function() {
  console.log("listening on 8000")
})
