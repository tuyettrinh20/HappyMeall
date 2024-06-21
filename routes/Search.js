const express = require("express");
const router = express.Router();
const db = require('../dbsetup');



router.get('/search', async(req,res) => {
    let input = req.query.search;
    const query = ` SELECT recipes.name_food,categories.name,recipes.img,recipes.id
                    FROM categories,recipes 
                    WHERE recipes.cat_id = categories.id and recipes.name_food LIKE ?`;
    // Use '%' to perform a partial match
    const searchValue = `%${input}%`;
    const rs = await db.query(query, [searchValue]);
    const food = JSON.parse(JSON.stringify(rs[0]));
    let inputNull = false;
    if (input ==='' || input === undefined){
        inputNull = true;
        return res.render('searchError', {
            inputNull: inputNull,
            input: input
        });
    } 
    if(food.length == 0 && input !==''){
        return res.render('searchError',{
            inputNull: inputNull,
            input: input
        });
    }
    res.render('search', {
        food: food,
        inputNull: inputNull,
        input: input
    });
});

module.exports = router;