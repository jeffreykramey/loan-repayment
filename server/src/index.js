const cors = require("cors");
const express = require('express');
const routes = require('./routes');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`server has started on port ${port}`);
});