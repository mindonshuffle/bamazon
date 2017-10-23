DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) NULL,
  price DECIMAL(10,2) NULL,
  product_sales DECIMAL(10,2) NULL,
  stock_quantity INT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products ( product_name, department_name, price, stock_quantity )
VALUES ( "VCR", "Electronics", 50, 40 );

INSERT INTO products ( product_name, department_name, price, stock_quantity )
VALUES ( "DVD Player", "Electronics", 100, 30 );

INSERT INTO products ( product_name, department_name, price, stock_quantity )
VALUES ( "BRD Player", "Electronics", 150, 20 );

INSERT INTO products ( product_name, department_name, price, stock_quantity )
VALUES ( "Laptop", "Electronics", 600, 20 );

INSERT INTO products ( product_name, department_name, price, stock_quantity )
VALUES ( "Throw Pillow", "Home Decor", 20, 50 );

INSERT INTO products ( product_name, department_name, price, stock_quantity )
VALUES ( "Cuckoo Clock", "Home Decor", 100, 15 );

INSERT INTO products ( product_name, department_name, price, stock_quantity )
VALUES ( "Loveseat", "Home Decor", 350, 5 );

INSERT INTO products ( product_name, department_name, price, stock_quantity )
VALUES ( "Recliner", "Home Decor", 275, 10 );

INSERT INTO products ( product_name, department_name, price, stock_quantity )
VALUES ( "Blender", "Kitchen", 100, 30 );

INSERT INTO products ( product_name, department_name, price, stock_quantity )
VALUES ( "Toaster Oven", "Kitchen", 150, 30 );

INSERT INTO products ( product_name, department_name, price, stock_quantity )
VALUES ( "Hand Mixer", "Kitchen", 35, 70 );

INSERT INTO products ( product_name, department_name, price, stock_quantity )
VALUES ( "Apple Peeler", "Kitchen", 5, 100 );

CREATE TABLE departments (
  department_id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(100) NULL,
  overhead_costs DECIMAL(10,2) NULL,
  
  PRIMARY KEY (item_id)
);