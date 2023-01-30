const http = require("http");

const PORT = process.env.PORT || '3000';
const HOSTNAME = process.env.HOSTNAME || 'localhost';

const server = http.createServer((request, response ) => {
    response.statusCode = 200;
    response.setHeader("Content-Type", "Text/plain");
    response.end("Battleship");
});

server.listen(PORT, HOSTNAME, () =>{
    console.log(`Server is running at http://${HOSTNAME}:${PORT}`);
})