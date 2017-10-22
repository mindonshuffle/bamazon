// --- --- GLOBAL VARIABLES / REQUIRES --- ---

var inquirer = require( 'inquirer' );
var mysql = require( 'mysql' );

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,

	// Your username
	user: "root",

	// Your password
	password: "testpassword",
	database: "bamazon"
});


// --- --- GLOBAL FUNCTIONS --- ---

//Shows menu w/ manager options:
function managerMenu(){
	inquirer.prompt([
		{
			name: 'menu',
			type: 'list',
			message: 'Please select an option: ',
			choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
		}

	]).then( function(result){
	
		switch(result.menu){
			
			case 'View Products for Sale':
				displayProducts();
				connection.end();
				break;

			case 'View Low Inventory':
				lowInventory();
				break;

			case 'Add to Inventory':
				addInventoryDisplay();
				break;

			case 'Add New Product':
				addProductPrompt();
				
		}
	
	})

};

// Prints all products in DB to screen
function displayProducts(){

	connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function(err, result) {
		if (err) throw err;

		console.log('\nProducts Available: ')

		for (var i = 0; i < result.length; i++ ) {

			var spacer = '';
			if (result[i].product_name.length < 5 ){
				spacer = '\t';
			}

	    	console.log( '#' + result[i].item_id + ':\t' + result[i].product_name +spacer +'  \t$' + result[i].price + '\t  In stock: ' + result[i].stock_quantity );  

		}

		return;

	});

}

// prints all products with inventory < 5 to screen
function lowInventory(){

	connection.query("SELECT item_id, product_name, price, stock_quantity FROM products WHERE stock_quantity < 5", function(err, result) {
		if (err) throw err;

		console.log('\nProducts with Low Inventory: ')

		for (var i = 0; i < result.length; i++ ) {

			var spacer = '';
			if (result[i].product_name.length < 5 ){
				spacer = '\t';
			}

	    	console.log( '#' + result[i].item_id + ':\t' + result[i].product_name +spacer +'  \t$' + result[i].price + '\t  In stock: ' + result[i].stock_quantity );  

		}

		console.log('');
		connection.end();
		return;

	});

}

// Prints all products in DB to screen then prompts for add
function addInventoryDisplay(){

	connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function(err, result) {
		if (err) throw err;

		console.log('\nProducts Available: ')

		for (var i = 0; i < result.length; i++ ) {

			var spacer = '';
			if (result[i].product_name.length < 5 ){
				spacer = '\t';
			}

	    	console.log( '#' + result[i].item_id + ':\t' + result[i].product_name +spacer +'  \t$' + result[i].price + '\t  In stock: ' + result[i].stock_quantity );  

		}

		addInventoryPrompt();

	});

}


function addInventoryPrompt(){

	console.log('');

	inquirer.prompt([
		{
			name: 'item',
			type: 'input',
			message: 'Enter the Item # to add inventory for: ',
		},
		{
			name: 'quantity',
			type: 'input',
			message: 'Enter the quantity of products to add: ', 
		}
	]).then( function(result){

		addInventory(result.item, result.quantity);
		// console.log('You buy '+result.quantity + ' of ' +result.item );

	});
}

// add quantity of item to inventory
function addInventory( item , quantity ){

	connection.query("SELECT * FROM products WHERE item_id = ?", item, function(err, result) {
		if (err) throw err;

		// if invalid input, print error and stop
		if ( result[0] === undefined ){
			console.log("Please enter the Product # of an Available Product!");
			connection.end();
			return;
		}

		//otherwise, increase the inventory by quantity purchased
		else {
			var query = connection.query("UPDATE products SET ? WHERE ?",
			    [{
			        stock_quantity: eval(parseFloat(result[0].stock_quantity) + parseFloat(quantity))
			      },
			      {
			        item_id: item
			      }
			    ], function( err, result ) {
			    	if (err) throw err;
			    }
		)};

		//display the cost of the transaction.

		console.log('\nYou have added '+quantity +' to the inventory of "' +result[0].product_name +'."');

		connection.end();
		return;

	});

}

function addProductPrompt(){

	console.log('');

	inquirer.prompt([
		{
			name: 'name',
			type: 'input',
			message: 'Enter the name of the product to add: ',
		},
		{
			name: 'department',
			type: 'input',
			message: 'Enter the department for this product: ',
		},
		{
			name: 'price',
			type: 'input',
			message: 'Enter the price of the product: ', 
		},
		{
			name: 'quantity',
			type: 'input',
			message: 'Enter the number of items in inventory: ', 
		}
	]).then( function(result){

		addProduct(result.name, result.department, result.price, result.quantity);

	});
}

function addProduct( name, department, price, quantity ){

	connection.query(
    "INSERT INTO products SET ?",
    {
      product_name: name,
      department_name: department,
      price: price,
      stock_quantity: quantity
    },
    function(err, res) {
    	if (err) throw err;
    	console.log('\nNew product added succesfully.');
    	connection.end();
    	return;
    }
  );




};


// --- --- MAIN LOGIC --- ---

console.log('\n*** bamazon Management Console *** *** *** *** ***\n')

connection.connect(function(err) {
	if (err) throw err;
	
	managerMenu();
	// connection.end()
});