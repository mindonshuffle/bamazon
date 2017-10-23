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

function displayProducts(){

	connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function(err, result) {
		if (err) throw err;

		console.log('\nProducts Available: ')

		for (var i = 0; i < result.length; i++ ) {
			if( result[i].stock_quantity > 0 ){
		    	
		    	var spacer = '';
				if (result[i].product_name.length < 5 ){
					spacer = '\t';
				}

		    	console.log( '#' + result[i].item_id + ':\t' + result[i].product_name +spacer +'  \t$' + result[i].price  );  

	    	}
		}

		console.log('');

		customerMenu();
	});

}

//prompts for what purchase customer chooses to make
function customerMenu(){
	inquirer.prompt([
		{
			name: 'item',
			type: 'input',
			message: 'Enter the Item # you would like to purchase: ',
		},
		{
			name: 'quantity',
			type: 'input',
			message: 'Enter the quantity you would like to purchase: ', 
		}
	]).then( function(result){

		purchaseItem(result.item, result.quantity);
		// console.log('You buy '+result.quantity + ' of ' +result.item );

	});

};

function purchaseItem( item , quantity ){

	// check if enought items are available to complete transation

	connection.query("SELECT * FROM products WHERE item_id = ?", item, function(err, result) {
		if (err) throw err;

		// if invalid input, print error and stop
		if ( result[0] === undefined ){
			console.log("Please enter the Product # of an Available Product!");
			connection.end();
			return;
		}

		//if not enough quantity remaining, inform customer
		else if ( result[0].stock_quantity < quantity ){
			console.log( 'Insufficient stock of "' +result[0].product_name +'" available.')
			connection.end();
			return;
		}

		//otherwise, decrease the inventory by quantity purchased
		else {
			var query = connection.query("UPDATE products SET ? WHERE ?",
			    [{
			        stock_quantity: eval(result[0].stock_quantity - quantity)
			      },
			      {
			        item_id: item
			      }
			    ], function( err, result ) {
			    	if (err) throw err;
			    })
			};

		//display the cost of the transaction.

		console.log('\nYou have purchased '+quantity +' of "' +result[0].product_name +'."');
		console.log('Total cost of this transation: $' +eval(result[0].price * quantity) );

		var query = connection.query("UPDATE products SET ? WHERE ?",
			    [{
			        product_sales: eval(result[0].product_sales+(result[0].price * quantity))
			      },
			      {
			        item_id: item
			      }
			    ], function( err, result ) {
			    	if (err) throw err;
			    });

		//prompt for next purchase !!! not yet implemented
		connection.end();
		return;

	});

}

// --- --- MAIN LOGIC --- ---

console.log('\n*** Welcome to bamazon *** *** *** *** ***')

connection.connect(function(err) {
	if (err) throw err;
	
	displayProducts();
	// connection.end()
});