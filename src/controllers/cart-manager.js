const fs = require("fs").promises;

class CartManager {
    constructor(path) {
        this.path = path;
        this.carts = [];
        this.ultId = 0;
        this.loadCarts(); 
    }
    //static lastId = 0;

    loadCarts = async () => {
        try {
            const carts = await fs.readFile(this.path, "UTF-8");
            this.carts = JSON.parse(carts);

            if (this.carts.length > 0) {
                this.lastId = this.carts.reduce((prev, current) => (prev.id > current.id) ? prev : current, { id: 0 }).id;
            }
        } catch (error) {
            console.log("Error fetching carts", error);
            await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
        }
    }
    addCart = async () => {
        const newCart = {
            id: this.lastId + 1,
            products : []
        };
        this.carts.push(newCart);
        await this.writeCarts(this.carts); 
        return newCart; 
    }

    getCartById = async (id) => {
        try {
            const cart = this.carts.find(c => c.id === id);
            console.log(id)
            if (!cart) {
                console.log("Cart not found")
            }
            return cart;
        } catch (error) {
            console.log("Error searching cart by id", error)
        }
    }

    addProduct = async (cid, pid, quantity = 1) => {
        try {
            const cart = await this.getCartById(cid);
            const existingProduct = cart.products.find(p => p.product === pid)
            if (existingProduct) {
                existingProduct.quantity += quantity;
            }
            else {
                cart.products.push({ product: pid, quantity })
            }
            await this.writeCarts(this.carts);
            console.log("Product added successfully");
            return cart;
            
        } catch (error) {
            console.log("Error adding new product", error)
        }
    }

    //lectura y escritura de carts
    readCarts = async () => {
        try {
            let result = await fs.readFile(this.path, "utf-8");
            return JSON.parse(result);
        } catch (error) {
            console.log("Error reading carts", error)
        }
    }
    writeCarts = async (content) => {
        try {
            await fs.writeFile(this.path, JSON.stringify(content, null, 2));
        } catch (error) {
            console.log("Error writting file", error)
        }
    }
}

module.exports = CartManager; 