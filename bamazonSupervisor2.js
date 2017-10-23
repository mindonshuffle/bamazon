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
			choices: ['View Product Sales by Department', 'Create New Department']
		}

	]).then( function(result){
	
		switch(result.menu){
			
			case 'View Products Sales by Department':
				displaySales();
				break;

			case 'Create New Department':
				createDepartment();

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



// --- --- MAIN LOGIC --- ---

console.log('\n*** bamazon Management Console *** *** *** *** ***\n')

connection.connect(function(err) {
	if (err) throw err;
	
	managerMenu();
	// connection.end()
});