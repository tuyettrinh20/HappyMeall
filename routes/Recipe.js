const express = require("express");
const router = express.Router();
require('mysql2/promise');
const db = require('../dbsetup');
router.use(express.urlencoded({extended:"true"}));

router.get("/recipe/:id", async (req,res) => {
    let id = req.params.id;
    let sql =`SELECT * FROM recipes WHERE id = ?`;       
    let rs = await db.query(sql, id);       
    let sql1 =`select categories.name from categories,recipes where recipes.cat_id = categories.id and recipes.id = ?`;       
    let rs1 = await db.query(sql1, id);    
    let sql2 =`select areas.name_area from areas,recipes where recipes.area_id = areas.id and recipes.id = ?`;       
    let rs2 = await db.query(sql2, id);    
    const area = JSON.parse(JSON.stringify(rs2[0])); 
    const cat = JSON.parse(JSON.stringify(rs1[0]));  
    const recipe = JSON.parse(JSON.stringify(rs[0]));
    let sql3 =`SELECT ingredients.name_in FROM ingredients
	            INNER JOIN IngredientRecipe 
	            ON ingredients.id =  IngredientRecipe.id_in
	            INNER JOIN recipes 
	            ON IngredientRecipe.id_food = recipes.id 
	            WHERE recipes.id = ?;`;       
    let rs3 = await db.query(sql3, id);  
    const ingredient = JSON.parse(JSON.stringify(rs3[0])); 
    let isLogined = false;  
    if(req.cookies.account){
        let email = req.cookies.account;
        let sql4 =`select id,username from users where email = ?`;       
        let rs4 = await db.query(sql4, email); 
        const id_user = JSON.parse(JSON.stringify(rs4[0])); 
        let sql3=`select content from note where id_user =? and id_food =?`;       
        let rs3 = await db.query(sql3, [id_user[0].id,id]);    
        const note = JSON.parse(JSON.stringify(rs3[0])); 
        let sql5 = "SELECT username FROM users where email = ?";       
        let rs = await db.query(sql5,email);             
        let name = JSON.parse(JSON.stringify(rs[0]));
        let isLogined = true;    
        res.render("recipe", {
            recipe: recipe,
            ingredient : ingredient,
            category: cat,
            area: area,
            note: note,
            message: req.flash(),
            name: name,
            isLogined : isLogined
        });
    } else {
        res.render("recipe", {
            recipe: recipe,
            category: cat,
            ingredient : ingredient,
            area: area,
            note:'',
            message:'',
            name: '',
            isLogined : isLogined
        });
    }
});


router.post("/recipe/:id", async (req, res) => {
    if(req.cookies.account){
        let id_food = req.params.id;
        let note = req.body.note;
        let email = req.cookies.account;
        let sql1 =`select id from users where email = ?`;       
        let rs1 = await db.query(sql1, email); 
        const id_user = JSON.parse(JSON.stringify(rs1[0]));
        if(!note){
            req.flash('error','You need to fill in the content before save!');
            return res.redirect('/recipe/'+ id_food);
        } else if(note.length > 500) {
            req.flash('error','Note cannot exceed 500 characters');
            return res.redirect('/recipe/'+ id_food);
        } else {
            var sql = "INSERT INTO note (content,id_user, id_food) VALUES (?,?,?)";
            let row = await db.query(sql,[note,id_user[0].id,id_food], (err, result) => {
                if(err){
                    req.flash('error','There was an error saving your note. Please try again.');
                    return res.redirect('/recipe/'+ id_food);
                }
            });
            req.flash('success','Your note has been saved!');
            return res.redirect('/recipe/'+ id_food);
        }
    } else {
        return res.redirect('/login');
    }        
});

router.get('/insert_food', async (req,res) => {
    let sql4 = "SELECT name_area FROM areas";       
    let rs4 = await db.query(sql4);             
    let list_area = JSON.parse(JSON.stringify(rs4[0]));
    res.send(list_area)
});



module.exports = router;