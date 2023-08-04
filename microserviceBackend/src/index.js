const express = require('express')
const morgan = require('morgan');
const { dirname } = require('path');
const path = require('path');
const http = require ('http');
const { mongoose } = require('./database');
const app = express();
const server = http.createServer(app);
const logger = require('./logger');

app.set('port', process.env.SERVER_PORT);

app.use(morgan('dev'));
app.use(express.json());

app.use('/api/users', require('./routes/user.routes'));

server.listen(app.get('port'), ()=>{  
    logger.log("info", `Server on port ${app.get('port')}`) 
});
