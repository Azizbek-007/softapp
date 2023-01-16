var mysql = require('mysql');

var con = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "sx48Bq3A68NvPun"
});

con.connect(function(err) {
  if (err) console.log(err)
  console.log("Connected!");
});

