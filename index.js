var Telegraf = require('telegraf')
const reply = { Telegraf }
const crypto = require('crypto')
var { getClassifieds } = require('./lookup.js')
var msgStore = require('./messageStore.js')

const bot = new Telegraf('319038460:AAHzJZfPM_vNOMBjuTHAVpQ1ndf2y4GWcDc')
const UPDATE_INTERVAL = 30*1000

const handleMessage = ctx => {
    getClassifieds().then((classifieds) => {
        let user = ctx.from.username
        
        var filtered = classifieds.filter((c) => {
            return (c.indexOf('patio') > 0 && !msgStore.userGotMessage(user, c))
        })
        
        if (filtered.length === 0){
            ctx.reply("I haven't anything for you. Check later!")
        }
        else {
            ctx.reply("Here's what I found!")
            setTimeout(() => {
                filtered.map(el => {
                    msgStore.registerMessageSent(el, user)
                    ctx.reply(el)
                })
            }, 100)
        }
    }, rejected => {
        ctx.reply("Sorry, an error ocurred. Try again later!")
        console.error(rejected)
    })
}

const askForUserTags = ctx => {    
}

bot.hears(/ok/i, handleMessage)
bot.hears(/debug/i, ctx => ctx.reply(JSON.stringify(msgStore.getMessageHashes())))
bot.command('start', ctx => {
    msgStore.registerContext(ctx);
    askForUserTags(ctx)
    ctx.reply("Hola! Estas suscrito a los clasificados! Para parar, envia /stop")
})
bot.command('stop', ctx => {
    msgStore.unregisterContext(ctx);
    ctx.reply("Desuscrito correctamente.")
})

setInterval(() => {
    getClassifieds().then((classifieds) => {
        console.log('Got classifieds.')
        
        var filtered = classifieds.filter((c) => {
            return (c.indexOf('patio') > 0 || /[(dic)(nov)]\.?/i.test(c))
        })
        
        filtered.forEach(msg => {
            msgStore.registerMessage(msg)
        });
        console.log(`Got classifieds! ${filtered.length} total messages after filtering!`)
    }, rejected => {
        console.error(`Promise rejected in getClassifieds. "${rejected}"`)
    }).then(() => {
        for (var username in msgStore.getContexts()) {
            if (msgStore.getContexts().hasOwnProperty(username)) {
                var ctx = msgStore.getContexts()[username];
                msgStore.getMessages().filter(
                    el => !msgStore.userGotMessage(username, el)
                ).forEach(
                    msg => {
                        ctx.reply(msg)
                    }
                );
            }
        }
    }, rejected => {})
}, UPDATE_INTERVAL)

bot.startPolling()