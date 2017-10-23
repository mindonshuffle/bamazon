// --- --- GLOBAL VARIABLES / REQUIRES --- ---

var inquirer = require( 'inquirer' );
var mysql = require( 'mysql' );
require('console.table');

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
function supervisorMenu(){
	inquirer.prompt([
		{
			name: 'menu',
			type: 'list',
			message: 'Please select an option: ',
			choices: ['View Product Sales by Department', 'Create New Department']
		}

	]).then( function(result){
	
		switch(result.menu){
			
			case 'View Product Sales by Department':
				displaySales();
				break;

			case 'Create New Department':
				createDepartment();

		}
	
	})

};

// Prints all products in DB to screen
function displaySales(){

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




// --- --- MAIN LOGIC --- ---

console.log('\n*** bamazon Supervisor Console *** *** *** *** ***\n')

connection.connect(function(err) {
	if (err) throw err;
	
	supervisorMenu();
	// connection.end()
});