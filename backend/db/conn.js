const mysql = require('mysql2');

// Create a pool of connections with direct configuration
const pool = mysql.createPool({
  host: 'mysql-container', // Change this to 'localhost' if not using Docker
  user: 'root',
  password: 'Pranjal2607!@',
  port: 3306,
  database: 'employees_db',
  connectionLimit: 10 // Number of connections to create in the pool
});
// Open the MySQL connection
connection.connect(error => {
  if (error) {
    console.error("Error connecting to the MySQL database:", error.stack);
    return;
  }
  console.log("Successfully connected to the MySQL database.");
});

// Export the pool
module.exports = pool.promise(); // Use promise-based API

