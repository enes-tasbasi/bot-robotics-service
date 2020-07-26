require('dotenv').config();

const cors = require('cors');
const express = require('express');
const app = express();

const s3Controller = require('./s3Controller');

const port = process.env.PORT || 3000;

app.use(cors());

app.get('/', async (req, res) => {
  let results = await s3Controller.getAllDisplayUrl();
  res.json(results);
})

app.listen(port, () => console.log(`App listening at port ${port}`));