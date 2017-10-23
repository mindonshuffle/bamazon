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
				addDeptPrompt();

		}
	
	})

};

// Prints all products in DB to screen
function displaySales(){

	connection.query("SELECT *, SUM(product_sales) AS dept_sales FROM departments LEFT JOIN products ON departments.department_name = products.department_name GROUP BY departments.department_name;", function(err, result) {
		if (err) throw err;

		var table = [["Department Name", "Overhead Costs", "Product Sales", "Total Profit"]];
		
		for (var i = 0; i < result.length; i++ ) {

			var current = [];

			current.push(result[i].department_name);
			current.push(result[i].overhead_costs);
			current.push(result[i].dept_sales);
			current.push(parseFloat(result[i].dept_sales) - parseFloat(result[i].overhead_costs));

			table.push(current);
		}

		console.log('\nSales by Department: \n')
		console.table(table[0], table.slice(1));

		connection.end();
		return;
	});

}

function addDeptPrompt(){

	console.log('');

	inquirer.prompt([
		{
			name: 'name',
			type: 'input',
			message: 'Enter the name of the department to add: ',
		},
		{
			name: 'overhead',
			type: 'input',
			message: 'Enter the overhead costs of this department: ', 
		}
	]).then( function(result){

		addDept(result.name, result.overhead);

	});
}

function addDept( name, overhead ){
 
	connection.query(
    	"INSERT INTO departments SET ?",
	    {
	    	department_name: name,
	        overhead_costs: overhead
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

console.log('\n*** bamazon Supervisor Console *** *** *** *** ***\n')

connection.connect(function(err) {
	if (err) throw err;
	
	supervisorMenu();
	// connection.end()
});