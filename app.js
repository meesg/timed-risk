let express = require("express");
let http = require("http");

let port = process.argv[2];
let app = express();

app.use(express.static(__dirname + "/public"));
http.createServer(app).listen(port);