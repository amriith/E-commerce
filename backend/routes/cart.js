const express = require("express");
const router = express.Router();
const {authMiddleWare} = require("../middleware");
const {Product ,User} = require("../db");   

router.post("/add-to-cart", authMiddleWare, async (req, res) =>{

})

module.exports = router;