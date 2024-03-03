const express = require("express");
const router = express.Router();

const CartManager = require("../controllers/cart-manager.js");
const cartManager = new CartManager("./src/models/carts.json");


router.post("/", async (req, res) => {
    try {
        await cartManager.addCart()
        res.send({ status: "success", message: "Correctly aggregated cart" })
    } catch (error) {
        res.status(500).send({ status: "error", message: "Internal Server Error" })
    }
})

//obtener productos de un carrito por su id
router.get("/:cid", async (req, res) => {
    const cartId = parseInt(req.params.cid);
    try {
        const cart = await cartManager.getCartById(cartId);
        res.json(cart.products);
    } catch (error) {
        console.error("Error fetching cart", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
})
router.post("/:cid/product/:pid", async (req, res)=> {
    const cartId = parseInt(req.params.cid);
    const pId = parseInt(req.params.pid);
    const quantity = req.body.quantity || 1; 
    try {
        const updateCart = await cartManager.addProduct(cartId, pId, quantity); 
        res.json(updateCart.products);
    } catch (error) {
        console.error("Error fetching cart", error);
        res.status(500).json({ error: "Error interno del servidor" });
    } 
})

module.exports = router; 