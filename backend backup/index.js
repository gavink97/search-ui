const express =  require("express");
const mysql = require("mysql2");
const { MYSQL_USER, MYSQL_PASSWORD, MYSQL_IP, MYSQL_PORT} = require("./config/config");

const app = express()

const db = mysql.connect({
  host: `${MYSQL_IP}`,
  user: `${MYSQL_USER}`,
  password: `${MYSQL_PASSWORD}`,
  port: `${MYSQL_PORT}`,
  database: "test"
});

function connectWithRetry() {
  db.connect(function(err) {
    if (err) {
      console.error('Error connecting to MySQL: ' + err.stack);
      // Retry connection after 5 seconds
      setTimeout(connectWithRetry, 5000);
      return;
    }

    console.log('Connected to MySQL as id ' + db.threadId);
  });

  db.on('error', function(err) {
    console.error('MySQL connection error: ' + err.stack);
    // Retry connection after 5 seconds
    setTimeout(connectWithRetry, 5000);
  });
}

// Start the initial connection attempt
connectWithRetry();

db.end();


app.get("/", (req,res) => {
    res.send("<h2>Check</h2>");
});

const port = process.env.PORT || 8800;

app.listen(port, () => console.log(`listening on port ${port}`))