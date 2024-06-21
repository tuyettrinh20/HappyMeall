const express = require("express");
const router = express.Router();
const db = require('../dbsetup');
const multer = require("multer");
const path = require("path");
const { error } = require("console");

const storageEngine = multer.diskStorage({
  destination: "./views/images",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}--${file.originalname}`);
  },
});
const upload = multer({
  storage: storageEngine,
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});
const checkFileType = function (file, cb) {
  //Allowed file extensions
  const fileTypes = /jpeg|jpg|png|gif|svg/;

  //check extension names
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

  const mimeType = fileTypes.test(file.mimetype);

  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb("Error: You can Only Upload Images!! F5 to come back");
  }
};

router.get("/post", async(req, res) => {
    let sql = "SELECT name FROM categories";       
    let rs = await db.query(sql);             
    let category = JSON.parse(JSON.stringify(rs[0]));
    if(req.cookies.account){
        let email = req.cookies.account;
        let sql1 = `SELECT user_role FROM users where email = ?`;       
        let rs1 = await db.query(sql1,email);             
        let auth = JSON.parse(JSON.stringify(rs1[0]));
        if(auth[0].user_role == 'admin'){         
            return res.render('postNew',{
                category:category 
            });
            
        }else {
            return res.render('error');
        }
    }
    res.render('error');
});



router.post("/post",upload.single("filename"), async(req, res) => {
        const name_food = req.body.name_food;
        const calories = req.body.calories;
        const video = req.body.video;
        const property = req.body.property;
        const instruction = req.body.instruction;
        const category = req.body.category;
        const area = req.body.area;
        let sql1 = `SELECT id FROM categories where name = ?`;       
        let rs1 = await db.query(sql1,category);             
        let cat_id = JSON.parse(JSON.stringify(rs1[0]));
        let sql2 = `SELECT id FROM areas where name_area = ?`;       
        let rs2 = await db.query(sql2,area);             
        let area_id = JSON.parse(JSON.stringify(rs2[0]));
        let error = '';
        let sql3 = "SELECT name FROM categories";       
        let rs = await db.query(sql3);             
        let list_category = JSON.parse(JSON.stringify(rs[0]));
        if (!req.file){
            error = 'File not uploaded!';
            res.render('postNew', {
                name_food: name_food,
                category: list_category,
                area:area,
                calories:calories,
                video: video,
                property:property,
                instruction:instruction,
                error: error
            });
        }else {
            let img = req.file.filename; 
            let valid = true;
            let count = 0;
            if (name_food === undefined || name_food === ''){
                valid = false;
                error = 'Please fill in the title of food!';
                count++;
            }
            if (name_food.length > 50){
                valid = false;
                error = 'Your title is too long!';  
            }
            if (category === undefined || category === ''){
                valid = false;
                error = 'Please choose category for your food!';
                count++;
            }
            if (area === undefined || area === ''){
                valid = false;
                error = 'Please fill in the area of food!';
                count++;
            }
            if (instruction === undefined || instruction === ''){
                valid = false;
                error = 'Please fill in instruction part!';
                count++;
            }
            if(count>1){
                valid = false;
                error = 'Please fill in all required part!';
            }
            if(valid){
                let sql4 = "SELECT name_area FROM areas";       
                let rs4 = await db.query(sql4);             
                let list_area = JSON.parse(JSON.stringify(rs4[0]));
                
                    if(list_area.filter(e => e.name_food === area).length > 0){
                        var sql = "INSERT INTO recipes(cat_id,area_id,name_food,calories,video,property,instructions,img) VALUES (?,?,?,?,?,?,?,?)";
                        await db.query(sql,[cat_id[0].id,area_id[0].id,name_food,calories,video,property,instruction,"../images/"+img]);
                    } else {
                        let sql5 = "insert into areas (name_area) values (?)";
                        await db.query(sql5,[area]);
                        let sql7 = `SELECT id FROM areas where name_area = ?`;       
                        let rs7 = await db.query(sql7,area);             
                        let area_id1 = JSON.parse(JSON.stringify(rs7[0]));
                        var sql = "INSERT INTO recipes(cat_id,area_id,name_food,calories,video,property,instructions,img) VALUES (?,?,?,?,?,?,?,?)";
                        await db.query(sql,[cat_id[0].id,area_id1[0].id,name_food,calories,video,property,instruction,"../images/"+img]);
                    }
                
                return res.render('addIngredient');
            }
            return res.render('postNew',{
                name_food: name_food,
                category: list_category,
                area:area,
                calories:calories,
                video: video,
                property:property,
                instruction:instruction,
                error: error
            });
        }
    
})




module.exports = router;