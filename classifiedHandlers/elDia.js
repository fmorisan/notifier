var request = require('request')
var cheerio = require('cheerio')

const EL_DIA = 'http://clasificados.eldia.com/clasificados-alquiler-departamentos-1-dormitorio-la-plata'


const retrieveElDiaClassifieds = () => {
    return new Promise((resolve, reject) => {
        request({
            uri: EL_DIA,
            method: 'GET'
        }, (err, rsp, body) => {
            if (err) reject(err)
            resolve(body)
        })
    })
}

const getElDiaClassifieds = () => {
    return retrieveElDiaClassifieds().then((html) =>{
        var $ = cheerio.load(html)
        var announcements = $('.avisos p').map((i, el) => el.children[0].data).get()
        return announcements
    })
}

module.exports = getElDiaClassifieds