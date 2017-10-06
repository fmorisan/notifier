const http = require('http')
const fs = require('fs')
const url = require('url')
const path = require('path')

const contentTypesByExtension = {
   '.html': "text/html",
   '.css':  "text/css",
   '.js':   "text/javascript"
};

const handle500 = response => {
    response.writeHead(500, {"Content-Type": 'text/plain'})
    response.write('500 - Server error.')
    response.end()
}

const handle404 = response => {
    response.writeHead(404, {"Content-Type": 'text/plain'})
    response.write('404 - File not found.')
    response.end()
}

const handle200 = (response, data, filename) => {
    response.writeHead(200, {"Content-Type": contentTypesByExtension[path.extname(filename)]})
    response.write(data)
    response.end()
}

module.exports = {
    startServer: () => {
        return http.createServer((req, res) => {
            let uri = url.parse(req.url).pathname
            let filename = path.join(process.cwd()+'/serve/', uri)

            fs.exists(filename, exists => {
                if (!exists) {
                    handle404(res)
                    return
                }

                if (fs.statSync(filename).isDirectory())
                    filename += 'index.html'
                fs.readFile(filename, (err, data) => {
                    if (err) {
                        handle500(res)
                        return
                    }
                    handle200(res, data, filename)
                })
            })
        }).listen(80)
    }
}
