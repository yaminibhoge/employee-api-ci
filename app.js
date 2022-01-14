const express = require('express');
const cors = require('cors');
var swaggerUi = require("swagger-ui-express");
const swaggerDocument = require('./swagger.json');
//const {router} = require('./routes/employee-routes')

var app = express();

app.use(express.json()); //parse application/json
app.use(express.urlencoded({extended:true})); //parse application/x-www-form-urlencoded 
app.use(cors())

//Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));

//configure routes
app.use("/employees",require('./routes/employee-routes'))

//COnfigure error handlers
app.use(function(err, req, res, next){
    if( process.env.NODE_ENV == "development" )
    {
        console.error(err.stack);
    }
    res.status(500).send({"error":"Something broke!!!"});
})

module.exports = app;