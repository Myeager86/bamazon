const inquirer = require('inquirer');
const mysql = require("mysql");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "M3y8668=",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    start();
});
// runs on initial load, either runs buy and item or leave store. 
function start() {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to buy?",
            choices: ["Buy an Item", "Leave store"]
        })
        .then(function (buyOrLeave) {
            if (buyOrLeave.action === "Buy an Item") {
                buyItem();
            } else {
                leaveStore();
                console.log("Goodbye! Thank you for visiting our store!");
            }
        });
}
// the only function I built that exits the CLI
function leaveStore() {
    connection.end();
}

// function readProducts() {
//     console.log("Selecting all products...\n");
//     connection.query("SELECT * FROM products", function(err, res) {
//       if (err) throw err;
//       // Log all results of the SELECT statement
//       console.log(res);
//       connection.end();
//     });
//   }

function buyItem() {
    // query the database for all prodcuts in the database
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // display a list of available items and query what they would like to buy
        inquirer
            .prompt([
                {
                    name: "choice",
                    type: "rawlist",
                    choices: function () {
                        const productArray = [];
                        for (var i = 0; i < res.length; i++) {
                            productArray.push(res[i].product_name);
                        }
                        return productArray;
                    },
                    message: "What item would you like to buy?"
                },
                {
                    name: "buy",
                    type: "input",
                    message: "How many would you like to buy?"
                }
            ])
            .then(function (answer) {
                // runs and creates a var for the chosen item
                var chosenItem;
                for (var i = 0; i < res.length; i++) {
                    if (res[i].product_name === answer.choice) {
                        chosenItem = res[i];
                    }
                }

                // determine if there was enough stock, this is not working as the answer.stock_quantity is returning undefined 
                if (parseInt(answer.buy) > parseInt(chosenItem.stock_quantity)) {
                    // if there is enough stock this updates the stock quant to the new amount
                    connection.query(
                        "UPDATE auctions SET ? WHERE ?",
                        [
                            {
                                stock_quantity: Math.floor(chosenItem.stock_quanity - answer.buy)
                            }
                        ],
                        // runs if there was enough stock and displays the total price
                        function (error) {
                            if (error) throw err;
                            console.log("Congratulations! Your item is on the way! Your total cost is " + Math.floor(chosenItem.price*answer.buy));
                            start();
                        }
                    );
                }
                else {
                    // If there is not enough stock, let the customer know and restart
                    console.log("Sorry! There are not enough in stock to fulfill your order.");
                    // I logged these out to see what they are returning, and I cannot fifgure out why I cant get this app to do a simple greater than/less than calculation
                    // I have tried using parseInt and I have fliipped the greater than/less than and I just can't get it. But the rest of the code is working. 
                    console.log(answer.buy);
                    console.log(chosenItem.stock_quantity);
                    // console.log(answer);
                    start();
                }
            });
    });
};
