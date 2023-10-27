const express = require('express');
const app = express();
const cors= require('cors');
const router= require('./routes/router');

app.use(cors());
app.use('/user',router);

app.listen(4000);