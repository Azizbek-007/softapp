const { Telegraf, Markup } = require('telegraf');
const axios = require('axios');

const bot = new Telegraf('5943068483:AAEzNtXNsLjCU5ef8vQwWLE5SyLZaTaL0JI');
const headers = { 
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkF6aXpiZWsiLCJpYXQiOjE2NzM5NTQzNjd9.FAAvVvEhVGMjEh1QBLdISOpe_zcQ_MRqpg9mocwE4NI', 
    'Content-Type': 'application/json'
    }
bot.start(async (ctx) => {
    let text = ctx.message.text.split(' ')
    if(text.length == 2){
        let instrument = text[1];

        var data = JSON.stringify({
        "user_id": ctx.from.id.toString(),
        "FIO": ctx.from.first_name + " " + ctx.from.last_name,
        "instrument": Number(instrument),
        "phone": " ",
        "comment": "telegram bot /start",
        "status": 0,
        });
        
        var config = {
        method: 'post',
        url: 'http://localhost:5000/api/v1/lead',
        headers,
        data : data
        };
        
        axios(config)
        .then(res => {
            axios({
                method: "patch",
                url: `http://localhost:5000/api/v1/instrument/${Number(instrument)}`,
                headers
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
bot.command("course", (ctx) => {
    

    var config = {
        method: 'get',
        url: 'http://localhost:5000/api/v1/course',
        headers
      };
      
    axios(config)
      .then(function (response) {
        let keyboard = [];
        let a = [];
        let data = response.data
        data.map(element => {
            keyboard.push({text: element.name, callback_data: 'Course=1'})
        });

        for (let index = 0; index < keyboard.length; index+=2) {
                    a.push(keyboard.slice(index, index + 2))
        }

        ctx.reply("Courses", { reply_markup: JSON.stringify({ inline_keyboard: a }) });
      })
      .catch((error) => {
        console.log(error.response.data.error);
        ctx.reply("Kurslar tabilmadi")
      })    
})

bot.action(/^Course=(\d+)$/, (ctx) => {
    let _data = ctx.callbackQuery.data.split('=');
    if (_data.length() == 2) {
        var data = JSON.stringify({
            "user_id": `${ctx.from.id}`,
            "comment": `course ${_data[2]}`,
        
        });
          
          var config = {
            method: 'patch',
            url: 'http://localhost:5000/api/v1/lead/2',
            headers: { 
              'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkF6aXpiZWsiLCJpYXQiOjE2NzM5NTQzNjd9.FAAvVvEhVGMjEh1QBLdISOpe_zcQ_MRqpg9mocwE4NI', 
              'Content-Type': 'application/json'
            },
            data : data
          };
          
          axios(config)
          .then(function (response) {
            console.log(JSON.stringify(response.data));
          })
          .catch(function (error) {
            console.log(error);
          });
        ctx.reply('Siz benen tez arada baylanisamiz');

    }
})
bot.launch({ dropPendingUpdates: true});
