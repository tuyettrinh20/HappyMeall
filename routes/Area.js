const express = require("express");
const router = express.Router();
const db = require('../dbsetup');

router.get("/api/area", async (req,res) => {
    let sql = "SELECT name_area FROM areas";       
    let rs = await db.query(sql);             
    const listOfArea = JSON.parse(JSON.stringify(rs[0]));
    res.send(listOfArea);
}); 
router.get("/area", async (req,res) => {
    let isLogined = false;
    if(req.cookies.account){
        let isLogined = true;
        let email = req.cookies.account;
        let sql4 = "SELECT username FROM users where email = ?";       
        let rs = await db.query(sql4,email);             
        let name = JSON.parse(JSON.stringify(rs[0]));
        res.render("areas", {
            isLogined : isLogined,
            name:name
        });
    } else {
        res.render("areas", {
            isLogined : isLogined,
            name: ''
        });
    }
});
router.get("/area/:name", async (req,res) => {
    let name = req.params.name;
    let sql = "SELECT * FROM areas WHERE name_area = ?";       
    let rs = await db.query(sql, name);             
    const areas = JSON.parse(JSON.stringify(rs[0]));
    let sql2 = "SELECT id FROM areas WHERE name_area = ?";       
    let rs2 = await db.query(sql2, name);             
    const id_food = JSON.parse(JSON.stringify(rs2[0]));
    let sql1 = "SELECT id,name_food,img FROM recipes WHERE area_id = ?";       
    let rs1 = await db.query(sql1, id_food[0].id);             
    const food = JSON.parse(JSON.stringify(rs1[0]));
    let isLogined = false;
    if(req.cookies.account){
        let isLogined = true;
        let email = req.cookies.account;
        let sql4 = "SELECT username FROM users where email = ?";       
        let rs = await db.query(sql4,email);             
        let name = JSON.parse(JSON.stringify(rs[0]));
        res.render("areaDetail", {
            isLogined : isLogined,
            name:name,
            areas: areas,
            food: food
        });
    } else {
        res.render('areaDetail',{
            areas: areas,
            food: food,
            isLogined : isLogined,
            name:''
        });
    }
    
});

router.post("/area", async (req, res) => {
    const types = req.body;
    await Category.create(types); 
    res.json(types);
})

module.exports = router;