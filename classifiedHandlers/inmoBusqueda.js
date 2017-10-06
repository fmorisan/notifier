var request = require('request')
var cheerio = require('cheerio')

const INMOBUSQUEDA = 'http://www.inmobusqueda.com.ar/resultados.php'
'pagina=1&moneda=0&orden=1&torden=0&provincia=1&ciudad=432&operacion=0&dorm=2&dorm2=1&desde=4000&hasta=5500&tipo=2&actualizado=1&publicado=0&calidad='

const getInmoBusquedaPage = (pageNumber, options) => {
    return new Promise((resolve, reject) => {
        options['pagina'] = pageNumber
        request.get({
            uri: INMOBUSQUEDA,
            qs: options
        }, (err, rsp, body) => {
            if (err) reject(err)
            resolve(body)
        })
}