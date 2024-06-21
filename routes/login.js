'use strict'

const express = require('express');
require('mysql2/promise');
const db = require("../dbsetup");
const app1 = express.Router();
const cookie = require("cookie-parser");
app1.use(cookie());
app1.use(express.urlencoded({extended:"true"}));

app1.get("/login", (req,res) => {
    if(req.cookies.account){
        res.redirect('/');
    }else {
        res.render("login"); 
    } 
});

app1.post("/login", async (req,res) => {
    let mail = req.body.email;
    let password = req.body.pass;
    let data = {
        email: mail,
        pass : password,
        error: ''
    }
    let valid = true;
    if(mail === '' || password === ''){
        valid = false;
        data.error = 'Please fill in email and password';
    }
    if(valid){
        let [rows] = await db.query("SELECT * FROM users WHERE email = ?", mail);
        if (rows.length > 0){
            const user = rows[0];
            if(password === user.pass){
                res.cookie('account',mail);
                if(user.user_role == 'admin'){
                    return res.redirect('/post');
                }else{
                    return res.redirect('/');
                }
            }else{
                data.error = 'Email or password may be wrong';
                res.render('login',data);
            }
        }
    }else{
        res.render('login',data);
    }
 
});

app1.get("/logout",(req,res) => {
    res.clearCookie('account');
    res.redirect('/');
});



module.exports = app1;