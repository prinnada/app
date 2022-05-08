const express = require('express');
const app = express();

const mysql = require('mysql');
const config = require('./db')
const con = mysql.createConnection(config);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//require('dotenv').config();

//------ Inventory --------
app.get('/inventory/:inven_num', function (req, res) {
    const inven_num = req.params.inven_num;
    const sql = 'SELECT Inventory_Number,Asset_Description,Location,Room,Status FROM item WHERE Inventory_Number = ? AND Year = year(curdate())';
    con.query(sql, [inven_num], function (err, result) {
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
app.post('/update/:inven_num', function (req, res) {
    const inven_num = req.params.inven_num;
    const status = req.body.status;
    const location = req.body.location;
    const room = req.body.room;
    const sql = "UPDATE item SET Status = ?, Location = ?, Room = ? WHERE Inventory_Number = ? AND Year = year(curdate())";
    con.query(sql, [status, location, room, inven_num], function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).send("Database error");
        } else {
            console.log(inven_num);
            res.send(result);
        }

    });
});

//-----------------Check Count---------------
// Lost 
app.get('/lost', function (req, res) {
    const sql = 'SELECT COUNT(Status) FROM item WHERE Status = 0 AND Year = year(curdate())';
    con.query(sql, function (err, result) {
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

// Normal
app.get('/normal', function (req, res) {
    const sql = 'SELECT COUNT(Status) FROM item WHERE Status = 1 AND Year = year(curdate())';
    con.query(sql, function (err, result) {
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

// Degraded
app.get('/degraded', function (req, res) {
    const sql = 'SELECT COUNT(Status) FROM item WHERE Status = 2 AND Year = year(curdate())';
    con.query(sql, function (err, result) {
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



//------ Server --------
app.listen(3000, function () {
    console.log('Server starts at port 3000');
});