const express = require("express");
const router = express.Router();
require('mysql2/promise');
const db = require('../dbsetup');
router.use(express.urlencoded({extended:"true"}));

router.get('/save', async (req,res) => {  
    if(req.cookies.account){
        let email = req.cookies.account;
        let sql1 =`select id,username from users where email = ?`;       
        let rs1 = await db.query(sql1, email);              
        const user = JSON.parse(JSON.stringify(rs1[0]));
        let sql4 = "SELECT username FROM users where email = ?";       
        let rs = await db.query(sql4,email);             
        let name = JSON.parse(JSON.stringify(rs[0]));
        let sql3 =`select recipes.id,recipes.name_food, recipes.img from recipes
                    INNER JOIN SaveList
                    ON recipes.id =  SaveList.id_food
                    INNER JOIN users
                    ON SaveList.id_user = users.id 
                    WHERE users.id = ?`;       
        let rs3 = await db.query(sql3, user[0].id);  
        const saveFood = JSON.parse(JSON.stringify(rs3[0])); 
        res.render('saveRecipe', {
            food: saveFood,
            name: name
        });
    } else {
        res.redirect('/login');
    }
    
});

router.post('/save/:id', async (req,res) => {
    if(req.cookies.account){
        let id_food = req.params.id;
        let email = req.cookies.account;
        let sql1 =`select id from users where email = ?`;       
        let rs1 = await db.query(sql1, email); 
        const id_user = JSON.parse(JSON.stringify(rs1[0]));
        var sql = "INSERT INTO SaveList (id_user, id_food) VALUES (?,?)";
        let row = await db.query(sql,[id_user[0].id,id_food]);
        req.flash('success','Recipe saved!');
        return res.redirect('/recipe/'+ id_food);
    } else {
        res.redirect('/login');
    }
});

router.post('/deleteSave/:id', async (req,res) => {
    if(req.cookies.account){
        let id_food = req.params.id;
        var sql = "DELETE FROM SaveList WHERE id_food = ?";
        let row = await db.query(sql,[id_food]);
        return res.redirect('/save');
    } else {
        res.redirect('/login');
    }
})

module.exports = router;