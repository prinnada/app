const express = require('express');
const app = express();
const con = mysql.createConnection(config);
const mysql = require('mysql');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('dotenv').config();

//------ Inventory --------
app.get('/inventory/:iv', function (req, res) {
    const inv = req.params.iv;
    const sql = 'SELECT Inventory_Number, Asset_Description,Location,Room,Status FROM item WHERE Inventory_Number = ? AND Year = year(curdate())';
    con.query(sql, [inv], function (err, result) {
        if (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
            return;
        }
        const numrows = result.length;
        if (numrows == 0) {
            res.status(500).send("No Data");
        } else {
            res.json(result);
        }

    });
});

//------- Update status, location, room --------
app.post('/update', function (req, res) {
    const status = req.body.status;
    const location = req.body.location;
    const room = req.body.room;
    const sql = "UPDATE item SET Status = ?, Location = ?, Room = ? WHERE Inventory_Number = ? AND Year = year(curdate())";
    con.query(sql, [status, location, room], function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("Database error");
        } else {
            res.send(result);
        }

    });
});


//------ Server --------
app.listen(3000, function () {
    console.log('Server starts at port 3000');
});