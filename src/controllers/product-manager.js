//import { promises as fs } from "fs";
const fs = require("fs").promises;

class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
    }

    static id = 0

    //title, description, code, price, stock, category, thumbnails
    addProduct = async (product) => {
        try {
            //verificar que se encuentren todos los campos
            if (!product.title || !product.description || !product.code || !product.price || !product.category) {
                console.log("Todos los campos son obligatorios. Volver a intentar")
                return;
            }

            const aProducts = await this.readProducts();
            //verificar que el code sea unico
            const uniqueCode = aProducts.find((c) => c.code === product.code)
            if (uniqueCode) { console.log("El Codigo debe ser unico"); return; }

            //establecer el ultimo id de la lista de productos
            let id = aProducts.reduce((prev, current) => (prev.id > current.id) ? prev : current, { id: 0 });
            const nextId = id.id + 1;

            let newProduct = {
                id: nextId,
                title: product.title,
                description: product.description,
                code: product.code,
                price: product.price,
                status: true,
                stock: product.stock,
                category: product.category,
                thumbnails: product.thumbnails || []
            }
            aProducts.push(newProduct)
            //this.products.push(newProduct);
            await fs.writeFile(this.path, JSON.stringify(aProducts, null, 2));
        } catch (error) {
            console.log("Error creating new product", error)
        }
    }

    //OBTENER PRODUCTOS
    getProducts = async () => {
        try {
            let result = await fs.readFile(this.path, "utf-8");
            return result;
        } catch (error) {
            console.log("Error fetching products", error)
        }
    }
    //OBTENER PRODUCTO POR ID
    getProductsById = async (id) => {
        try {
            let result = await this.readProducts();
            const product = result.find((p) => p.id === id);
            if (!product) {
                console.log("Product not found");
            } else {
                console.log(product);
                return product;
            }
        } catch (error) {
            console.log("Error fetching product by id", error)
        }
    }
    //LEER PRODUCTOS
    readProducts = async () => {
        try {
            let result = await fs.readFile(this.path, "utf-8");
            return JSON.parse(result);
        } catch (error) {
            console.log("Error reading products", error)
        }
    }
    //ELIMINAR PRODUCTO POR ID
    deleteProductById = async (id) => {
        try {
            let result = await this.readProducts();
            let filter = result.filter((product) => product.id !== id);
            await fs.writeFile(this.path, JSON.stringify(filter, null, 2));
        } catch (error) {
            console.log("Error deleting product", error)
        }
    }
    //ACTUALIZAR UN PRODUCTO
    updateProducts = async (id, producto) => {
        console.log(id, producto)
        try {
            const products = await this.readProducts();

            const index = products.findIndex(item => item.id === id);
            console.log(index)
            if (index !== -1) {
                products[index] = { ...products[index], ...producto };
                await fs.writeFile(this.path, JSON.stringify(products, null, 2));
                console.log("Product updated successfully");
            } else {
                console.log("Product not found");
            }
        } catch (error) {
            console.log("Error updating product", error);
            throw error;
        }
    }
}

module.exports = ProductManager;