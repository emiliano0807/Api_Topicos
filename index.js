const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
require('dotenv').config();

const app = express();//Creamos la instancia del servidor express

//middlewares
app.use(express.json());
app.use(cors())

//Iniciamos el servidor
const PORT =  3000;
app.listen(PORT,()=>{
    console.log("Corriendo servidor en http://localhost:" + PORT);
})
/*Conexion con mysql*/
const servidores=[
    {
        host: process.env.host,
        user: process.env.user,
        password: process.env.password,
        port: process.env.port,
        database: process.env.database
    },
    {
        host: process.env.host2,
        user: process.env.user2,
        password: process.env.password2,
        port: process.env.port2,
        database: process.env.database2
    }
]
const connection = mysql.createConnection(servidores[1]);
connection.connect((err)=>{
    if(err){
        //throw err
        console.error(err.message || "No se pudo conectar a la base de datos");
    }else{
        console.log("Conectado a la base de datos")
    }
})

//Seleccionar datos de la BD
app.get("/", (req,res)=>{
    connection.query('SELECT * FROM  usuarios',(error,resul)=>{
        if(error) res.status(500).json({message:error.message || "No se puede obtener datos en este momento"});
        else res.status(200).json(resul);
    });
});


//insertar datos a la BD
app.post("/", (req,res)=>{
    const {Nombre} = req.body;
    const a= `INSERT INTO usuarios(Nombre) VALUES (?)`
    connection.query(a,[Nombre],(error,resul)=>{
        if(error) res.status(500).json({message:error.message || "No se puede insertar el dato en este momento"});
            else res.json(resul);
    });
});
//actualizar datos de la BD
app.patch("/",(req,res)=>{
    const {ID,Nombre} = req.body;

    connection.query(`UPDATE usuarios SET nombre="${Nombre}" WHERE id=${ID}`,(error, results)=>{
        if (error) res.status(500).json({message:error.message || "No se pudo actualizar en este momento"});
        else res.json(results);
    });
});
//Eliminar datos de la BD
app.delete("/",(req,res)=>{
    const {ID} = req.body;
    connection.query(`DELETE FROM usuarios WHERE id=${ID}`,(error,results)=>{
            if (error) res.status(500).json({message:error.message || "No se puede eliminar en este momento"});
            else res.json(results);
    });
});