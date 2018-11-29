const express = require('express')
const router = express.Router()
const connection = require('../config/db_connection').usersConnection;
var logger = require('morgan')
var bodyParser = require('body-parser');
var crypto = require('crypto');
let mail = require('../config/mail');

console.log("Inside controllers/manage.js")
router.get('/', (req, res, next) => {
    var username = req.session.user.email;
    var firstName = req.session.user.firstName;
    var sql = "SELECT `ROLES` FROM tbl_user_roles"
    
    connection.query(sql, function (err, roles) {
        if (err) {
            throw err;
            res.redirect('404')
        }
        console.log(sql + "---" + JSON.stringify(roles))
        if (roles.length >= 0) {
            res.render('manage', {
                title: 'Manage Users',
                message: '',
                username: username,
                firstName: firstName,
                roles: roles
            })
        } else {
            res.render('500', {
                title: 'Internal error',
                username: req.session.user.email,
                firstName: req.session.user.firstName,
            })
        }
    })

})
router.post('/checkUser', function (req, res) {
    // console.log(req.session.user.email + req.session.user.firstName);
    if (req.session.user.email != null && req.session.user.firstName != null) {
        var username = req.session.user.email;
        var firstName = req.session.user.firstName;
        var sql = "SELECT email FROM tbl_users WHERE email='" + req.body.email.toLowerCase() + "'"
        connection.query(sql, function (err, rows) {
            if (err) {
                throw err;
                res.redirect('404')
            }
            // connection.release()
            // console.log(sql + "---" + rows.length + "req:" + req.body.email)
            if (rows.length > 0) {
                res.status(200).json({ 'doesUserExist': true })
            } else {
                res.status(200).json({ 'doesUserExist': false })
            }
        })
    } else {
        res.status(false);
    }
})
function camelize(str) {
    var names = str.split(" ");
    var finalName = "";
    names.forEach(name => {
        finalName+=name.charAt(0).toUpperCase()+name.substr(1).toLowerCase()+" ";
    });
    return finalName.substr(0,finalName.length-1);
  }
router.post('/add_users', function (req, res) {
    if (req.session.user.email != null && req.session.user.firstName != null) {
        var username = req.session.user.email;
        var firstName = req.session.user.firstName;
        var salt = 'newAdd' + Date.now()
        var encPassword = crypto.createHash('sha1').update(salt).digest('hex');
        var sql = "INSERT INTO `tbl_users`(`email`, `password`, `firstName`, `lastName`,`role`) VALUES ('" + req.body.email.toLowerCase() + "','" + encPassword + "','";
        sql += camelize(req.body.firstname) + "','" + camelize(req.body.lastname) + "','" + req.body.role + "')";
        var fullName = req.body.firstname+" "+req.body.lastname;
        console.log(camelize(fullName))
        // console.log(sql)
        connection.query(sql, function (err, result) {
            if (err) {
                message = false
                console.log(err);
                throw err;
            }
            crypto.randomBytes(20, function (err, buf) {
                var token = buf.toString('hex');
                connection.query("update tbl_users SET resettoken = ? where email = ?", [token, req.body.email.toLowerCase()], function (err, rows) {
                    console.log(err, rows);
                    if (!err) {
                        console.log("1 user account created in database");
                        const email = require('../config/mail');
                        var subject = 'Pending account!'
                        var html = '<html><head> <meta charset="utf-8"> <meta name="viewport" content="width=device-width"> <title>Password reset!</title> </head><body style="font-family:\'Open Sans\', sans-serif;"> <div class="container"> <div class="row"> <center> <img src="data:image/jpeg;base64,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" height="120px" width="95px"/> </center> </div><div class="row"> <div class="col-xs-offset-1 col-md-offset-1" style="padding-top:30px;"><br/> <p>Hello '+camelize(fullName)+',<br/> <br/> Welcome to Student Success Center reporting application. A new account has been created for you by SSCRA Admin. To complete your profile please click the button below and create a new password. <br/> <br/> This is an automated mail and replies to this mail will not be monitored. In case of any issues or queries please contact us using the Contact Us page from the application. <br/> <center> <h3> <a href="http://'+process.env.IP+":"+process.env.PORT+"/resetpswd/" + token + '" style=" color:white;text-decoration:none; height:50px; background-color:#eb0028; line-height:50px; border-radius:2px; font-size:18px; text-align:center; color:#ffffff !important;display: block;width: 100%;border: none;margin: 0;" target="_blank">Click here!</a></h3></center> <br/> Thanks and Regards,<br/> SSCRA Northwest </p></div></div></div></body></html>' 
                        email.sendEmail("addUsers",req.body.email, subject, html)
                        var sql = "SELECT `ROLES` FROM tbl_user_roles"
                        connection.query(sql, function (err, roles) {
                            if (err) {
                                if (error.errno == 1146) {
                                    res.render('view_database.ejs', {
                                        status:500,
                                        title: 'Table not found',
                                        message: "Table not found",
                                        username: username,
                                        firstName: firstName
                                    });
                                }else{
                                    res.render('500.ejs', {
                                        status:500,
                                        title: 'Table not found',
                                        message: "Table not found",
                                        username: username,
                                        firstName: firstName
                                    });   
                                }
                            }
                            if (roles.length >= 0) {
                                res.send({
                                    status: true,
                                    message: 'User account created and password link mailed to new user!'
                                })
                            } else {
                                res.render('500.ejs', {
                                    title: 'Internal error',
                                    status: 500,
                                    message: 'Error occured while adding user!',
                                    username: req.session.user.email,
                                    firstName: req.session.user.firstName,
                                })   
                            }
                        })
                        // }
                    }
                });
            });
        });
    } else {
        res.render("/");
    }
});

router.post('/get_users', function(req,res){
    if (req.session.user.email != null && req.session.user.firstName != null) {
        var username = req.session.user.email;
        var firstName = req.session.user.firstName;
        var sql = "SELECT `firstName`, `lastName`, `email`, `role` FROM `tbl_users` ORDER BY `ID` DESC "
        connection.query(sql, function (err, rows) {
            if (err) {
                throw err;
                res.redirect('500')
            }
            if (rows.length > 0) {
                res.status(200).send(rows)
            } 
        })
    } else {
        res.status(false);
    }
})

router.post('/delete_user', function(req,res){
    if (req.session.user.email != null && req.session.user.firstName != null) {
        var username = req.session.user.email;
        var firstName = req.session.user.firstName;
        var sql = "DELETE FROM `tbl_users` WHERE `email`='"+req.body.email.toLowerCase()+"'"
        console.log(sql);
        connection.query(sql, function (err, rows) {
            if (err) {
                console.log(err);
                res.status(200).send({'deleteStatus':false})
            }
                res.status(200).send({'deleteStatus':true})
           
        })
    } else {
        res.render("/");
    }
})

router.post('/edit_user', function(req,res){
    if (req.session.user.email != null && req.session.user.firstName != null) {
        var username = req.session.user.email;
        var firstName = req.session.user.firstName;
        var sql = "UPDATE `tbl_users` SET `firstName`='"+req.body.firstname+"',`lastName`='"+req.body.lastname+"',`role`='"+req.body.role+"' WHERE `email`='"+req.body.email.toLowerCase()+"'"
        console.log(sql);
        connection.query(sql, function (err, rows) {
            if (err) {
                console.log(err);
                res.status(200).send({'updateStatus':false})
            }
                res.status(200).send({'updateStatus':true})
           
        })
    } else {
        res.status(404);
    }
})
module.exports = router