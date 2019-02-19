// required dependencies
var inquirer = require("inquirer");
var mysql = require("mysql");

// Mysql connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // username
    user: "root",

    //pasword and database
    password: "",
    database: "bamazon"
});

//check connection
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
   
  });
