require('dotenv').config();
let express = require('express');
let app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const PORT = process.env.PORT || 8080;
const swaggerUi = require('swagger-ui-express');
const api_docs = require('./api/swagger-v1.json');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.text());
app.use(bodyParser.json({
    type: 'application/json'
}));

app.use((error, req, res, next) => {
    //Catch bodyParser error 
    if (error) {
      res.status(400).json({
        status: "error",
        message: error.message
      })
    } else {
      next();
    }
});

app.use(cors());
app.use(helmet());

//routes

app.use('/', require('./routes'));

if (process.env.VCAP_APPLICATION) {
    let vcap_application = JSON.parse(process.env.VCAP_APPLICATION);
    api_docs.host = vcap_application["application_uris"][0];
}

//swagger API Documentation Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(api_docs));

app.use((req, res, next) => {
    const err = new Error('Route Not Found');
    res.status(err.status || 404);
    res.json({
        message: err.message,
        error: true,
    });
});

app.listen(PORT);
console.log(`API Server started. Listening on port:${PORT}`);