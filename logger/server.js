import http from 'http';
import fs from 'fs/promises';

const httpPort = 8080;

const httpServer = http.createServer(async (req, res) => {
  logRequestDetails(req, res);

  if ((req.url === '/logs')) {
    await handleViewLogs(req, res);
  }

});

httpServer.listen(httpPort, () => {
  console.log(`Server is running at ${httpPort}`);
});

async function logRequestDetails(req, res) {
  try {
    const remoteAddress = req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];
    const dateTime = new Date().toISOString();
    const method = req.method;
    const url = req.url;

    console.log(remoteAddress, userAgent, dateTime, method, url);
    const data = `${remoteAddress} ${userAgent} ${dateTime} ${method} ${url}\n`;

    await fs.appendFile("logs.txt", data);
    console.log(`Data has been appended to logs.txt successfully.`);
  } catch (error) {
    console.error(`Error writing to logs.txt: ${error}`);
  }
}

async function handleViewLogs(req, res) {
  res.setHeader('Content-Type', 'text/plain');
  try {
    let data = await fs.readFile('logs.txt', 'utf-8');
    console.log(data);
    res.end(data);
  } catch (error) {
    console.error(`Error reading logs.txt: ${error}`);
    res.statusCode = 500; // Internal Server Error
    res.end('Error reading logs.');
  }
}

/*
Middleware :
 Middleware functions have access to the HTTP request and response for each application route (or endpoint).
They can execute any code, make changes to the request and the response objects, end the request-response cycle,
 or call the next middleware function in the stack.
*/
