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
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
   displayInventory();
  });

  function displayInventory() {
    var table = new Table({
        head: ['ID', 'Item', 'Department', 'Price', 'Stock'],
        colWidths: [10, 30, 30, 30, 30]
    });

	// Construct the db query string
	//queryStr = 'SELECT * FROM products';

	// Make the db query
	connection.query("SELECT * FROM products", function(err, res) {
		if (err) throw err;

		for (var i = 0; i < res.length; i++) {
            var itemId = res[i].item_id,
            productName = res[i].product_name,
            departmentName = res[i].department_name,
            price = res[i].price,
            stockQuantity = res[i].stock_quantity;

            table.push(
                [itemId, productName, departmentName, price, stockQuantity]
            );
		}

        console.log("");
        console.log("====================================================== Current Bamazon Inventory ======================================================");
        console.log("");
        console.log(table.toString());
        console.log("");


	  	promptUser();
	})
};

//prompt the user to choose an item
function promptUser() {
//use inquirer to prompt the user
inquirer.prompt([
    {
        type: "input",
        name: "item_id",
        message: "Please enter the item id you would like to purchase.",
        filter: Number 
    },
    {
        type: "input",
        name: "quantity",
        message: "How many would you like to buy?",
        filter: Number
    }
]).then(function(input){
    //console.log("customer has selcted: \n item_id " + input.item_id + " \n quantity of " + input.quantity);
    var item = input.item_id;
    var quantity = input.quantity;

    //check database to confirm item exists
    var queryString = "SELECT * FROM products WHERE ?";
    
    connection.query(queryString, {item_id: item}, function(err, data){
        if (err) throw err;

        //if user has selected invalid item
        if(data.length === 0) {
            console.log("Invalid ID Please select another");
            displayInventory();
        } else {
            var product = data[0];
             //console.log('product = ' + JSON.stringify(product));
				// console.log('product.stock_quantity = ' + product.stock_quantity);
            //If theres enough quantity of item
            if (quantity <= product.stock_quantity) {
               // console.log("yes");

               
                var newQuantity = product.stock_quantity - quantity;
            //console.log(newQuantity);
                //update the inventory
               var query = connection.query("UPDATE products SET ? WHERE ? ",
               [
                   {
                       stock_quantity: newQuantity
                   },
                   {
                    item_id: item
                   }

               ], 
               function(err, res) {
                    if (err) throw err;

                    console.log("Your order has been placed! Your total is $" + product.price * quantity);
                    console.log("Thank You come again!")
                    connection.end();
                })
            } else {
                console.log("Sorry there is not enough of that product. Please change your order.");
                displayInventory();
            }
        }
    });
});
};