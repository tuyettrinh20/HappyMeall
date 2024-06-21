const express = require("express");
const router = express.Router();
const db = require('../dbsetup');

router.get("/api/ingredient", async (req,res) => {
    let sql = "SELECT name_in FROM ingredients";       
    let rs = await db.query(sql);            
    const ingredient = JSON.parse(JSON.stringify(rs[0]));
    res.send(ingredient);
}); 
router.get("/ingredient", async (req,res) => {
    let isLogined = false;
    if(req.cookies.account){
        let isLogined = true;
        let email = req.cookies.account;
        let sql4 = "SELECT username FROM users where email = ?";       
        let rs = await db.query(sql4,email);             
        let name = JSON.parse(JSON.stringify(rs[0]));
        res.render("ingredient", {
            isLogined : isLogined,
            name:name
        });
    } else {
        res.render("ingredient", {
            isLogined : isLogined,
            name: ''
        });
    }
});

router.get("/ingredient/:name", async (req,res) => {
    let name_in = req.params.name;
    let sql = "SELECT id FROM ingredients WHERE name_in = ?";       
    let rs = await db.query(sql,name_in);            
    const id_in = JSON.parse(JSON.stringify(rs[0]));
    let sql1 = `SELECT recipes.name_food,recipes.img FROM recipes
                INNER JOIN IngredientRecipe 
                ON recipes.id =  IngredientRecipe.id_food
                INNER JOIN ingredients 
                ON IngredientRecipe.id_in = ingredients.id 
                WHERE ingredients.id = ?`;       
    let rs1 = await db.query(sql1,id_in[0].id);            
    const food = JSON.parse(JSON.stringify(rs1[0]));
    let isLogined = false;
    if(req.cookies.account){
        let isLogined = true;
        let email = req.cookies.account;
        let sql4 = "SELECT username FROM users where email = ?";       
        let rs = await db.query(sql4,email);             
        let name = JSON.parse(JSON.stringify(rs[0]));
        res.render("ingredientDetail", {
            isLogined : isLogined,
            name:name,
            name_in: name_in,
            food: food
        });
    } else {
        res.render('ingredientDetail',{
            name_in: name_in,
            food: food,
            isLogined : isLogined,
            name:''
        });
    }
    
});

module.exports = router;