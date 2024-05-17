import { readFile, writeFile } from 'fs/promises';
import fs from 'fs';
import http from 'http';
import https from 'https';
import url from 'url';

const httpPort = 80;
const httpsPort = 443;

const httpServer = http.createServer((req, res) => {
  const httpsUrl = `https://${req.headers.host}${req.url}`;
  res.writeHead(301, { Location: httpsUrl });
  res.end();
});

const httpsServer = https.createServer(
  {
    key: fs.readFileSync('certs/privkey.pem'),
    cert: fs.readFileSync('certs/fullchain.pem')
  }, async (req, res) => {
    await logRequestDetails(req, res);

    const parsedUrl = url.parse(req.url, true);

    if (req.method == 'GET' && parsedUrl.path == '/logs') {
      try {
        let logsData = await readFile('logs.txt');
        logsData = logsData.toString();

        res.statusCode = 200;
        res.setHeader('content-type', 'text')
        res.end(logsData);
      } catch (error) {
        console.log(error);
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    } else {
      res.statusCode = 404;
      res.end('Not found');
    }
  });

httpServer.listen(httpPort, () => {
  console.log(`Server is running at ${httpPort}`);
});

httpsServer.listen(httpsPort, () => {
  console.log(`Server is running at ${httpsPort}`);
})


async function logRequestDetails(req, res) {
  const remoteAddress = req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'];
  const method = req.method;
  const dateTime = new Date().toISOString();
  const url = req.url;

  let log = [remoteAddress, userAgent, method, dateTime, url].join(' ');

  try {
    let logsData = await readFile('logs.txt');
    logsData = logsData.toString();

    logsData += '\n' + log;
    await writeFile('logs.txt', logsData);
  } catch (error) {
    throw error;
  }
}
