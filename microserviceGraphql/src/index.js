const express = require('express')
const morgan = require('morgan');
const http = require ('http');
const logger = require("./logger");

const { mongoose } = require('./database');
const app = express();
const server = http.createServer(app);

// ---------------------------------------------------------
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema');
const bodyParser = require('body-parser');


app.use("/", bodyParser.json({ limit: '50mb' }), (request, response)=>{
    return graphqlHTTP({
        schema: schema,
        graphiql : true,
        rootValue : request,
        context : {
            request: {request, response}
        }
    })(request, response);
});

// Settings
app.set('port', process.env.SERVER_PORT);

// Middlewares
app.use(morgan('dev'));
app.use(express.json());

// Starting the server
server.listen(app.get('port'), ()=>{
    logger.log("info", `Server on port ${app.get('port')}`);  
});
