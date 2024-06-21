const express = require("express");
const router = express.Router();
const db = require('../dbsetup');

router.get("/category", async (req,res) => {
    let isLogined = false;
    if(req.cookies.account){
        let isLogined = true;
        let email = req.cookies.account;
        let sql4 = "SELECT username FROM users where email = ?";       
        let rs = await db.query(sql4,email);             
        let name = JSON.parse(JSON.stringify(rs[0]));
        res.render("categories", {
            isLogined : isLogined,
            name:name
        });
    } else {
        res.render("categories", {
            isLogined : isLogined,
            name: ''
        });
    }
});

router.get("/api/category", async (req,res) => {
    let sql = "SELECT name FROM categories";       
    let rs = await db.query(sql);             
    const listOfCat = JSON.parse(JSON.stringify(rs[0]));
    res.send(listOfCat);
});

router.get("/category/:name", async (req,res) => {
    let name = req.params.name;
    let sql = "SELECT * FROM categories WHERE name = ?";       
    let rs = await db.query(sql, name);             
    const category = JSON.parse(JSON.stringify(rs[0]));
    let sql2 = "SELECT id FROM categories WHERE name = ?";       
    let rs2 = await db.query(sql2, name);             
    const id_food = JSON.parse(JSON.stringify(rs2[0]));
    let sql1 = "SELECT id,name_food,img FROM recipes WHERE cat_id = ?";       
    let rs1 = await db.query(sql1, id_food[0].id);             
    const food = JSON.parse(JSON.stringify(rs1[0]));
    let isLogined = false;
    if(req.cookies.account){
        let isLogined = true;
        let email = req.cookies.account;
        let sql4 = "SELECT username FROM users where email = ?";       
        let rs = await db.query(sql4,email);             
        let name = JSON.parse(JSON.stringify(rs[0]));
        res.render("categoryDetail", {
            isLogined : isLogined,
            name:name,
            categories: category,
            food: food
        });
    } else {
        res.render('categoryDetail',{
            categories: category,
            food: food,
            isLogined : isLogined,
            name:''
        });
    }
});

router.post("/category", async (req, res) => {
    
})

module.exports = router;