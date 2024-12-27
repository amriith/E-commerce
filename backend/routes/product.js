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
            message: "Invalid Inputs, verify the inputs",
            errors: error.errors
        })

    }
    const {name, description, price, category, subCategory, variations,  imageUrl} = data;
       
   try { const productAlreadyExists = await Product.findOne({name,category})
    if(productAlreadyExists){
       variations.forEach(variation => {
              const existingVariation = productAlreadyExists.variations.find( (v)=> v.size === variation.size && v.color === variation.color);
              if(existingVariation){
                   existingVariation.stock += variation.stock;
              } else {
                productAlreadyExists.variations.push(variation);
              }
       }) 
       await productAlreadyExists.save();
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
            message: "Error adding/updating product: " + err
        })
    };
})


router.get("/get-products", async (req, res) => {
    const { filter, category, price } = req.query;
    const query = {}; // Initialize query object

    try {
        // Keyword search in name or category
        if (filter) {
            query.$or = [
                { name: { "$regex": filter, "$options": 'i' } },
                { category: { "$regex": filter, "$options": 'i' } },
            ];
        }

        // Category filtering
        if (category) {
            query.category = { "$regex": category, "$options": 'i' };
        }

        // Price range filtering
        if (price) {
            const [minPrice, maxPrice] = price.split(',').map(Number);
            if (!isNaN(minPrice) && !isNaN(maxPrice)) {
                query.price = { $gte: minPrice, $lte: maxPrice };
            }
        }

        // Fetch products from the database
        const products = await Product.find(query);

        // Respond with filtered products
        res.json({
            searchedProducts: products.map(product => ({
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                subCategory: product.subCategory,
                variations: product.variations.map(variation => ({
                    size: variation.size,
                    color: variation.color
                   
                }))
            }))
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Error fetching products: " + err.message,
        });
    }
});
module.exports = router; 