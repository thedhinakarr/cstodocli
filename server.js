import http from 'http';
import url from 'url';
import fs from 'fs/promises';
const port = 80;

const server = http.createServer(async (req, res) => {
  try {
    console.log(`Request received for ${req.url} from ${req.socket.remoteAddress}`);
    res.setHeader('Content-Type', 'application/json');
    if (req.method === 'GET') {

      const data = await fs.readFile("data.json");
      res.statusCode = 200;
      res.end(data);
    } else if (req.method === 'POST') {
      if (req.url === '/data') {
        let body = '';
        req.on("data", (chunk) => {
          body += chunk;
        });
        req.on("end", async () => {
          body = JSON.parse(body);
          res.statusCode = 200;
          res.end(JSON.stringify({ message: `Received data for ${body.name} who is ${body.age} years old.` }));
        });

      }
    }

    else {
      res.statusCode = 405;
      res.end(JSON.stringify({ message: "Method is not allowed" }));
    }

  } catch (error) {
    res.statusCode = 500;
    res.end(JSON.stringify({ message: "Something Went Wrong. Try Again." }));
  }
});

server.listen(port, () => {
  console.log(`Server running at ${port}`);
});

/*
Client - Server Architecture

HTTP : Hypertext Transfer Protocol

Request - Response Cycle
    - Client sends a request to the server
    - Server processes the request and sends a response back to the client
    - Server cannot send a response without a request from the client
    - Server cannot send multiple responses for a single request
    - Every request must have a response (sent by the server)
    - Browser is a client and it always send GET request to the server
*/
