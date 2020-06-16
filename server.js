require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');

const { connectToDb } = require('./db.js');
const apoloApiHandler = require('./api_handler.js');
const auth = require('./auth.js');

const app = express();

app.use(cookieParser());
app.use('/auth', auth.routes);
// enbale cross reference, default true
apoloApiHandler.installHandler(app);

const port = process.env.PORT || 3000;
(async function start() {
  try {
    await connectToDb();
    app.listen(port, () => {
      console.log(`API server listening on port: ${port}`);
    });
  } catch (error) {
    console.log('Error:!!!!!!!!!!\n', error);
  }
}());
