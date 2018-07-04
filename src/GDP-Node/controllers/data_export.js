var mysql = require("mysql");
const express = require('express')
const api = express.Router()
// set up connection with database.
console.log("inside controller")
var connection = mysql.createPool({
    connectionLimit: 50,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test'
});
api.get('/:table_name',function (req,res) {
    const table_name = req.params.table_name;
    if (typeof table_name !='undefined'&&table_name != 'favicon.ico'&& table_name != ''){
     connection.getConnection(function (error, instconn) {
         if (!!error) {
             instconn.release();
             console.log("Problem in connecting database");
         } else {
             console.log("database connection successful");
             // instconn.query("SELECT * FROM imported_files", function (error, rows, fields) {
             instconn.query("SELECT table_name FROM information_schema.tables where table_schema='test'",function (error,tables,fields) {
                instconn.query("SELECT * FROM `" + table_name+"`", function (error, rows, fields) {
                instconn.release();
                    if (!!error) {
                        console.log('Error connecting to' + table_name);
                        console.error(error);
                    } else {
                        res.render('index.ejs', {
                            title: 'View data from '+table_name,
                            tables: tables,
                            rows : rows
                        });
                        // res.send(rows);
                    }
                    console.log("Inside /:table renderer")
                })
             })

         }
     })
    }
})
api.get('/',function (req,res) {
    connection.getConnection(function (error, instconn) {
        if (!!error) {
            // instconn.release();
            console.log("Problem in connecting database");
        } else {
            console.log("database connection successful");
            // instconn.query("SELECT * FROM imported_files", function (error, rows, fields) {
            instconn.query("SELECT table_name FROM information_schema.tables where table_schema='test'", function (error, tables, fields) {
                instconn.query("SELECT FLAG FROM `upload_status` ORDER BY ID DESC", function (error, status, fields) {
                instconn.release();
                if (!!error) {
                    console.log('Error in the query');
                } else {
                    
                    res.render('index.ejs', {
                        title: 'View data from database',
                        tables: tables,
                        status: status
                    });
                }
                    console.log("Inside data renderer")
            })
        })
        }
    })

})
module.exports = api