const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs");
const port = process.argv[2] || 8888;


http.createServer((request, response) => {
  const Response = {
    "200"(file, filename) {
      const extname = path.extname(filename);
      const header = {
        "Access-Control-Allow-Origin": "*",
        "Pragma": "no-cache",
        "Cache-Control": "no-cache"
      }
      if (extname == '.jpg') {
        header["Content-Type"] = 'image/jpeg';
      } else if (extname == '.png') {
        header["Content-Type"] = 'image/png';
      } else if (extname == '.css') {
        header["Content-Type"] = 'text/css';
      } else if (extname == '.js') {
        header["Content-Type"] = 'text/javascript';
      } else if (extname == '.json') {
        header["Content-Type"] = 'application/json';
      } else {
        header["Content-Type"] = 'text/html';
      }

      response.writeHead(200, header);
      response.write(file, "binary");
      response.end();
    },
    "404"() {
      response.writeHead(404, { "Content-Type": "text/plain" });
      response.write("404 Not Found\n");
      response.end();
    },
    "500"(err) {
      response.writeHead(500, { "Content-Type": "text/plain" });
      response.write(`${err}\n`);
      response.end();

    }
  }


  const uri = url.parse(request.url).pathname
  let filename = path.join(process.cwd(), uri);

  fs.exists(filename, exists => {
    console.log(`${filename} ${exists}`);
    if (!exists) { Response["404"](); return; }
    if (fs.statSync(filename).isDirectory()) { filename += '/index.html'; }

    fs.readFile(filename, "binary", (err, file) => {
      if (err) { Response["500"](err); return; }
      Response["200"](file, filename);
    });
  });
}).listen(parseInt(port, 10));
console.log(`Server running at http://localhost:${port}`);
