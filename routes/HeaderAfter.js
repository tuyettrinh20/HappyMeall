const express = require("express");
const router = express.Router();
const db = require('../dbsetup');


router.get("/header", async (req,res) => {
    
        let email = req.cookies.account;
        let sql4 = "SELECT username FROM users where email = ?";       
        let rs = await db.query(sql4,email);             
        let name = JSON.parse(JSON.stringify(rs[0]));
        res.render("headerAfter", {
            name: name
        });
    
    
})



module.exports = router;