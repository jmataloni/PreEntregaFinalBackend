const express = require("express"); 
const router = express.Router();

const ProductManager = require("../controllers/product-manager.js");
const productManager = new ProductManager("./src/models/products.json")

//GET /// obtener productos - todos o por limites
router.get("/", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit); 
        const products = await productManager.getProducts();
        const parsedProducts = JSON.parse(products);
        limit ? res.json(parsedProducts.slice(0, limit)) : res.json(parsedProducts)

    } catch (error) {
        console.log("Error del servidor", error)
        res.status(500).json({error : "Error del servidor"})
    }
})

// GET /// traer un producto por id
router.get("/:pid", async (req, res) => {
    try {
        let id = req.params.pid;
        const product = await productManager.getProductsById(parseInt(id));

        if(!product) {
            return res.json({error: "product not found"});
        }
        res.json(product);
    } catch (error) {
        console.log("Error del servidor", error)
        res.status(500).json({error: "Error interno del servidor"})
    }
})

// POST /// crear un nuevo producto
router.post("/", async(req, res)=> {
    const newProduct = req.body; 
    try {
        await productManager.addProduct(newProduct);
        res.status(201).json({message: "Product added successfully"});
    } catch (error) {
        console.log("Error adding new product", error);
        res.status(500).json({error: "Error interno del servidor"});
    }
});

// POST /// actualizar un producto
router.put("/:pid", async (req, res) => {
    const id = req.params.pid; 
    const updateProduct = req.body;
    try {
        await productManager.updateProducts(parseInt(id), updateProduct);
        res.json({message: "Product updated successfully"});
    } catch (error) {
        console.log("Error updating product", error); 
        res.status(500).json({error: "Error interno del servidor"});
    }
});

// POST /// eliminar un producto
router.delete("/:pid", async(req, res) => {
    const id = req.params.pid;

    try {
        await productManager.deleteProductById(parseInt(id));
        res.json({message: "Product deleted successfully"});
    } catch (error) {
        console.log("Error deleting product", error); 
        res.status(500).json({error: "Error interno del servidor"});
    }
})


module.exports = router; 