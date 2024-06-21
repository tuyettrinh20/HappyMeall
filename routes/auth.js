const express = require('express');
const login = require('./login');
const signup = require('./signup');
const category = require('./Category');
const ingredient = require('./Ingredient');
const header = require('./HeaderAfter');
const area = require('./Area');
const search = require('./Search')
const homepage = require('./Homepage');
const recipe = require('./Recipe');
const save = require('./SaveRecipe');
const post = require('./PostNew');
const router = express.Router();

router.get("/login", login);
router.get('/logout',login);
router.post("/login", login);

router.get("/signup", signup);
router.post("/signup", signup);

router.get("/header", header);

router.get("/category", category);
router.get("/api/category", category);
router.get("/category/:name", category);
router.post("/category", category);

router.get("/area", area);
router.get("/api/area", area);
router.get("/area/:name", area);
router.post("/area", area);

router.get("/", homepage);

router.get("/recipe/:id", recipe)
router.post("/recipe/:id", recipe);
router.get("/insert_food", recipe);

router.get("/api/ingredient", ingredient);
router.get("/ingredient", ingredient);
router.get("/ingredient/:name", ingredient);

router.post("/save/:id", save);
router.post("/deleteSave/:id", save);
router.get("/save", save);

router.get("/search", search);

router.get("/post", post);
router.post("/post", post);

module.exports = router;