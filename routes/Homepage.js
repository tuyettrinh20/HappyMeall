const express = require("express");
const router = express.Router();
const db = require('../dbsetup');


router.get("/", async (req,res) => {
    let isLogined = false;
    let sql5 = `SELECT recipes.id,recipes.name_food,recipes.img, recipes.cat_id,categories.name  
                FROM recipes
                RIGHT JOIN categories
                ON recipes.cat_id = categories.id
                ORDER BY id DESC LIMIT 6;`;       
    let rs5 = await db.query(sql5);             
    let recent = JSON.parse(JSON.stringify(rs5[0]));
    let sql6 = "SELECT * FROM recipes WHERE cat_id = 14  ORDER BY id DESC LIMIT 6;";       
    let rs6 = await db.query(sql6);             
    let vegan = JSON.parse(JSON.stringify(rs6[0]));

    if(req.cookies.account){
        isLogined = true;
        let email = req.cookies.account;
        let sql4 = "SELECT username FROM users where email = ?";       
        let rs = await db.query(sql4,email);             
        let name = JSON.parse(JSON.stringify(rs[0]));
        res.render('homepage',{
            name: name,
            recent: recent,
            vegan: vegan,
            isLogined: isLogined});
    }
    res.render("homepage", {
        recent: recent,
        name: '',
        vegan: vegan,
        isLogined: isLogined
    });
    
})



module.exports = router;