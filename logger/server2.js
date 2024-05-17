import https from "http";
import http from "http";
import fs from "fs/promises";
import fsSync from "fs"

const httpsport = 443;
const httpport = 80;


const keys = {
  key: fsSync.readFileSync("./certs/privkey.pem"),
  cert: fsSync.readFileSync("./certs/fullchain.pem"),
};

const httpsServer = https.createServer(keys, async (req, res) => {
  try {
    logRequestDetails(req, res);
    if (req.method === "GET" && req.url === "/logs") {
      const data = await fs.readFile("logs.txt");
      return res.end(data.toString());
    }
    res.end("hi");
  } catch (error) {
    console.log(error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end({ error: "internal server error" });
  }
});

const httpServer = http.createServer(keys, async (req, res) => {
  try {
    logRequestDetails(req, res);
    if (req.method === "GET" && req.url === "/logs") {
      const data = await fs.readFile("logs.txt");
      return res.end(data.toString());
    }
    res.end("hi");
  } catch (error) {
    console.log(error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end({ error: "internal server error" });
  }
});


async function logRequestDetails(req, res) {
  try {
    const remoteAddress = req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];
    const dateTime = new Date().toISOString();
    const { method, url } = req;

    const log = `IP: ${remoteAddress}\nUser Agent: ${userAgent}\nDate/Time: ${dateTime}\nMethod: ${method}\nUrl: ${url}\n\n`;
    await fs.appendFile("logs.txt", log);
  } catch (error) {
    console.log(error);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end({ error: "internal server error" });
  }
}


httpServer.listen(httpport, async () => {
  console.log(`Server running at ${httpport}`);
});



httpsServer.listen(httpsport, async () => {
  console.log(`Server running at ${httpsport}`);
});
