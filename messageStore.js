const crypto = require('crypto')

let messageList = []
let users = {}
let userMessageObject = {}


const getMessageHash = (message) => {
    var sha = crypto.createHash('sha1')
    sha.update(message)
    return sha.digest('hex')
}


const userGotMessage = (user, message) => {
     var sent = userMessageObject[user]
     if (!sent){
         userMessageObject[user] = []
         return false
     }
     else {
        return sent.indexOf(getMessageHash(message)) > 0
     }
}


module.exports = {
    registerMessage: messageList.push,
    registerContext: ctx => {
        users[ctx.from.username] = ctx
    },
    unregisterContext: ctx => {
        delete users[ctx.from.username]
        userMessageObject[ctx.from.username] = void 0
    },
    getContexts: () => {
        return users
    },
    registerMessageSent: (msg, user) => {
        if (!userMessageObject[user])
            userMessageObject[user] = []
        userMessageObject[user].push(getMessageHash(msg))
    },
    userGotMessage,
    getMessageHashes: () => userMessageObject,
    getMessages: () => messageList
}

