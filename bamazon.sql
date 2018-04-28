-- DROP DATABASE IF EXISTS bamazon;

-- CREATE DATABASE bamazon;

USE bamazon; 

CREATE TABLE products (
	item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
    PRIMARY KEY(item_id),
	product_name VARCHAR(40) NOT NULL,
	department_name VARCHAR(40) NOT NULL,
	price INTEGER(15),
	stock_quantity INTEGER(15)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Keurig", "kitchen", 99, 100),
		("Coffee Beans", "kitchen", 12, 40),
		("Keurig Pods", "kitchen", 15, 300),
		("Coffee Grinder", "kitchen", 49, 20),
		("Jacket", "Mens Clothes", 149, 15),
		("Jeans", "Mens Clothes", 78, 200),
		("Leggings", "Womens Clothes", 38, 500),
		("Watch", "Womens Clothes", 189, 10),
		("Throw Pillow", "Housewares", 35, 25),
		("Candles", "Housewares", 19, 60);

SELECT * FROM products;