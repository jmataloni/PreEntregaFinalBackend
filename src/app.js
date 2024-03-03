//configuracion del servidor
const PUERTO = 8080;
const express = require("express");
const app = express();

app.use(express.json()); //indicar a express que recibe datos en formato JSON
app.use(express.urlencoded({extended : true}))

const productsRouter = require("./routes/products.routes.js");
const cartsRouter = require("./routes/carts.routes.js"); 

//RUTAS
app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)

//metodo de respuesta al iniciar el metodo o ingresar a la pagina
app.get("/", (req, res) => {
    res.send("Bienvenidos a mi e-commerce")
})

//listen
app.listen(PUERTO, () => {
    console.log(`Escuchando en el puerto: ${PUERTO}`);
})

