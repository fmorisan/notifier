const getElDiaClassifieds = require('./classifiedHandlers/elDia.js')

const getClassifieds = () => {
    let promises = [
        getElDiaClassifieds(),
    ]
    return new Promise((resolve, reject) => {
        let messages = []
        Promise.all(promises).then(values => {
            values.forEach(
                list => list.forEach(value =>
                    messages.push(value)
                )
            )
            resolve(messages)
        }, rejected => {
            reject(rejected)
        })
    })
}

module.exports = {
    getClassifieds
}