const http = require("http");
const fs = require("fs");
const express = require('express')
const app = express();

const PORT = process.env.PORT || '3000';
const HOSTNAME = process.env.HOSTNAME || 'localhost';

app.use(express.static("public"))



app.listen(PORT, () =>{
    console.log(`Server is running at http://${HOSTNAME}:${PORT}`);
})