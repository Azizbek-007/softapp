const { Telegraf, Markup } = require('telegraf');
const axios = require('axios');

const bot = new Telegraf('5943068483:AAEzNtXNsLjCU5ef8vQwWLE5SyLZaTaL0JI');

bot.start(async (ctx) => {
    let text = ctx.message.text.split(' ')
    if(text.length == 2){
        let instrument = text[1];

        var data = JSON.stringify({
        "user_id": ctx.from.id.toString(),
        "FIO": ctx.from.first_name + " " + ctx.from.last_name,
        "instrument": Number(instrument),
        "phone": " ",
        "comment": "the telegram bot",
        "status": 0,
        });
        
        var config = {
        method: 'post',
        url: 'http://localhost:5000/api/v1/lead',
        headers: { 
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkF6aXpiZWsiLCJpYXQiOjE2NzM5NTQzNjd9.FAAvVvEhVGMjEh1QBLdISOpe_zcQ_MRqpg9mocwE4NI', 
            'Content-Type': 'application/json'
        },
        data : data
        };
        
        axios(config)
        .then(res => {
            axios({
                method: "patch",
                url: `http://localhost:5000/api/v1/instrument/${Number(instrument)}`,
                headers: { 
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkF6aXpiZWsiLCJpYXQiOjE2NzM5NTQzNjd9.FAAvVvEhVGMjEh1QBLdISOpe_zcQ_MRqpg9mocwE4NI', 
                    'Content-Type': 'application/json'
                }
            })
            .catch(error => {
                console.log(error.response.data.error)
            });
        })
        .catch(error => {
            console.log(error.response.data.error)
         });

        await ctx.reply("Asslawma Aleykum ulli ma'rtebelim")
    } else {
        await ctx.reply("ok")
    }
});
bot.command("course", async (ctx) => {
    
    let keyboard = [];
    let test = ['1', '2', '3', '4'];
    let a = []
  
    test.map(e => {
        keyboard.push({text: e.toString(), callback_data: "ok"})  
    })

    for (let index = 0; index < keyboard.length; index+=2) {
        a.push(keyboard.slice(index, index + 2))
    }
    
    await ctx.reply("Ok", { reply_markup: JSON.stringify({ inline_keyboard: a }) }, {
        
    })
})
bot.launch({ dropPendingUpdates: true});
