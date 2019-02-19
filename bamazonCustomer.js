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
   displayInventory();
  });

  function displayInventory() {
	// console.log('___ENTER displayInventory___');

	// Construct the db query string
	queryStr = 'SELECT * FROM products';

	// Make the db query
	connection.query(queryStr, function(err, data) {
		if (err) throw err;

		console.log('Existing Inventory: ');
		console.log('...................\n');

		var strOut = '';
		for (var i = 0; i < data.length; i++) {
			strOut = '';
			strOut += 'Item ID: ' + data[i].item_id + '  //  ';
			strOut += 'Product Name: ' + data[i].product_name + '  //  ';
			strOut += 'Department: ' + data[i].department_name + '  //  ';
			strOut += 'Price: $' + data[i].price + '\n';

			console.log(strOut);
		}

	  	console.log("---------------------------------------------------------------------\n");

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
             console.log('product = ' + JSON.stringify(product));
				 console.log('product.stock_quantity = ' + product.stock_quantity);
            //If theres enough quantity of item
            if (quantity <= product.stock_quntity) {
                console.log("yes");
            }
        }
    });
});
};