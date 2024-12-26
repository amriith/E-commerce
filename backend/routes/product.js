const express = require('express');
const router = express.Router();
const z = require("zod");
const {adminMiddleware} = require("../middleware");
const {Product} = require("../db")
const productSchema = z.object({
name: z.string(),
variations: z.array(z.object({
    size: z.string(),
    color: z.string(),
    stock: z.number().min(0)
})),
    description: z.string(),
    price: z.number().positive(),
    category: z.string(),
    subCategory: z.string(),
    imageUrl: z.string()
})

router.post("/add-product", adminMiddleware, async (req, res) => {
    const {success , data} = productSchema.safeParse(req.body);
    if(!success){
        return res.status(400).json({
            message: "Invalid Inputs, verify the inputs"
        })

    }
    const {name, description, price, category, subCategory, variations,  imageUrl} = data;
       
   try { const productAlreadyExists = await Product.findOne({name,category})
    if(productAlreadyExists){
       variations.forEach(async (variation =>{
              const existingVariation = productAlreadyExists.variations.find( (v)=> v.size === variation.size && v.color === variation.color);
              if(existingVariation){
                   existingVariation.stock += variation.stock;
              } else {
                productAlreadyExists.variations.push(variation);
              }
       }) )
    } else {
       const createdProduct = await Product.create({
            name,
            description,
            price,
            category,
            subCategory,
            variations,
            imageUrl
        })
         const productId = createdProduct._id;
    }
    res.status(201).json({
        message: "Product Added Successfully"
    });
}
    catch(err){
        console.log(err)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    };
})
module.exports = router; 