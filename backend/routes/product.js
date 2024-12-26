const express = require('express');
const router = express.Router();
const z = require("zod");
const {adminMiddleware} = require("../middleware");

const productSchema = z.object({
name: z.string(),
    description: z.string(),
    price: z.number().positive(),
    category: z.string(),
    stock: z.number().nonnegative(),
    images: z.array(z.string()).optional()
})

router.post("/add-product", async (req, res) => {
    
})
module.exports = router;