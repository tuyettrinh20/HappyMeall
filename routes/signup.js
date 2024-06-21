'use strict'

const express = require('express');
const router = express.Router();
require('mysql2/promise');
const db = require("../dbsetup");

router.get("/signup", (req,res) => {
    res.render("signup");
});

router.post('/signup', async (req,res) => {
    let fname = req.body.name;
    let mail = req.body.email;
    let pass = req.body.password;
    let pass2 = req.body.password2;
    let data = {
        fullname: fname,
        email : mail, 
        password : pass, 
        password2 : pass2,
        nameError : '',
        mailError : '',
        passError : '',
        pass2Error : '',  
    };
    let valid = true;
    if (fname === undefined || fname === '') {
        valid = false;
        data.nameError = 'Name cannot be empty!';
    } 
    if (mail === undefined || mail === '') {
        valid = false;
        data.mailError = 'Email cannot be empty!';
    } else {
        let [rows] = await db.query("SELECT * FROM users WHERE email = ?", mail);
        if (rows.length > 0) {
            valid = false;
            data.mailError = 'This email has been used!';
        }
    }
    if (pass === undefined || pass === '') {
        valid = false;
        data.passError = 'Password cannot be empty!';
    }
    if(pass.length < 8){
        valid = false;
        data.passError = 'Password is too short! Please at least 6 characters';
    }
    if (pass !== pass2) {
        valid = false;
        data.pass2Error = 'You must re-enter the same password!';
    }
    if (valid) {
        let id = Date.now().toString();
        let sql = "INSERT INTO users (id,username, email, pass) VALUES (?,?, ?, ?)";
        let row = await db.query(sql,[id,data.fullname,data.email,data.password]);
        res.redirect("/");
    }else{
        res.render('signup',data);
    }
});


module.exports = router;