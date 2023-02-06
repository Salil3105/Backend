require("dotenv").config();
const express = require('express');
const morgan = require("morgan")
const app = express();

const auth = require('./routes/auth.routes');

const port = process.env.PORT || 4000;
app.use("/auth", auth);
app.use(morgan("tiny"));

app.listen(port, () => console.log(`Server is listening on port ${port}`));