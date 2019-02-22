// required dependencies
var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require('cli-table');
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
connection.connect(function (err) {
    if (err) throw err;
    //console.log("connected as id " + connection.threadId);
    promptManager();
});

function promptManager() {
    inquirer.prompt({
      name: "action",
      type: "list",
      message: "What would you like to review?",
      choices: ["View Products For Sale", "View Low Inventory", "Add To Inventory", "Add New Product"]
    }).then(function(answer) {
  
      switch (answer.action) {
        case "View Products For Sale":
          displayInventory();
          break;
  
        case "View Low Inventory":
          lowInventory();
          break;
  
        case "Add to Inventory":
          addInventory();
          break;
  
        case "Add New Product":
          addProduct();
          break;
      }
    });
  };

  function displayInventory() {
    var table = new Table({
        head: ['ID', 'Item', 'Department', 'Price', 'Stock'],
        colWidths: [10, 30, 30, 30, 30]
    });




    // Make the db query
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        //set table
        for (var i = 0; i < res.length; i++) {
            var itemId = res[i].item_id,
                productName = res[i].product_name,
                departmentName = res[i].department_name,
                price = res[i].price,
                stockQuantity = res[i].stock_quantity;
            //push table
            table.push(
                [itemId, productName, departmentName, price, stockQuantity]
            );
        }
        //console log inventory
        console.log("");
        console.log("====================================================== Current Bamazon Inventory ======================================================");
        console.log("");
        console.log(table.toString());
        console.log("");

        //call promptUser function
        promptManager();
    })
};