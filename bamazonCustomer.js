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
                console.log("inside choices");
            } else {
                leaveStore();
                console.log("inside else");
            }
        });
}

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
    // query the database for all items being auctioned
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // once you have the items, prompt the user for which they'd like to bid on
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
                // get the information of the chosen item
                var chosenItem;
                for (var i = 0; i < res.length; i++) {
                    if (res[i].product_name === answer.choice) {
                        chosenItem = res[i];
                    }
                }

                // determine if bid was high enough
                if (chosenItem.stock_quantity < parseInt(answer.stock_quantity)) {
                    // bid was high enough, so update db, let the user know, and start over
                    connection.query(
                        "UPDATE auctions SET ? WHERE ?",
                        [
                            {
                                stock_quantity: answer.buy
                            }
                        ],
                        function (error) {
                            if (error) throw err;
                            console.log("Congratulations! Your item is on the way! Your total cost is " + Math.floor(chosenItem.price*answer.buy));
                            start();
                        }
                    );
                }
                else {
                    // bid wasn't high enough, so apologize and start over
                    console.log("Sorry! There are not enough in stock to fulfill your order.");
                    console.log(answer.stock_quantity);
                    start();
                }
            });
    });
};
