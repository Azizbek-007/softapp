const { Telegraf, Markup } = require('telegraf');
const axios = require('axios');

const bot = new Telegraf('5943068483:AAEzNtXNsLjCU5ef8vQwWLE5SyLZaTaL0JI');
const headers = { 
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IkF6aXpiZWsiLCJpYXQiOjE2NzM5NTQzNjd9.FAAvVvEhVGMjEh1QBLdISOpe_zcQ_MRqpg9mocwE4NI', 
    'Content-Type': 'application/json'
    }

bot.start(async (ctx) => {
    let text = ctx.message.text.split(' ');

    if(text.length == 2){
        let instrument = text[1];

        var data = JSON.stringify({
        "user_id": ctx.from.id.toString(),
        "FIO": ctx.from.first_name + " " + ctx.from.last_name,
        "instrument": instrument,
        "status": 0,
        });
    }else{
        var data = JSON.stringify({
            "user_id": ctx.from.id.toString(),
            "FIO": ctx.from.first_name + " " + ctx.from.last_name,
            "status": 0,
        });
    }
        
    var config = {
    method: 'post',
    url: 'http://localhost:5000/api/v1/lead',
    headers,
    data
    };
    
    axios(config)
    .then(res => {
        axios({
            method: "patch",
            url: `http://localhost:5000/api/v1/instrument/${res.data.instrument}`,
            headers
        })
        .catch(error => {
            console.log(error.response.data.error)
        });
    })
    .catch(error => {
        console.log(error.response.data.error)
    });

    await ctx.reply("Asslawma Aleykum ulli ma'rtebelim nomerin'izdi jazip qaldirin': ")
    
});


bot.action(/Course=([1-9]+)=([1-9]+)$/, (ctx) => {
    let _data = ctx.callbackQuery.data.split('=');
    if (_data.length == 3) {
      console.log(_data)
        axios({
            method: 'patch',
            url: `http://localhost:5000/api/v1/course/${_data[1]}`,
            headers
        })
        .then(function (response) {
           
              var config = {
                method: 'post',
                url: 'http://localhost:5000/api/v1/order',
                headers,
                data : JSON.stringify({
                    "lead": Number(_data[2]),
                    "course": Number(_data[1])
                  })
              };
              
              axios(config)
              .then(function (response) {
                console.log(JSON.stringify(response.data));
              })
              .catch(function (error) {
                console.log(error);
              })
              .then(function (response) {
                return ctx.reply('Siz benen tez arada baylanisamiz');
              })
              .catch((error) => {
                console.log(error.response.data.error);
                return ctx.reply("Qa'telik ju'z berdi")
              });    
        })
        .catch((error) => {
            console.log(error.response.data.error);
            return ctx.answerCbQuery("Kurs tabilmadi")
          }); 
    }else {
        ctx.reply("Kurslar tabilmadi")
    }
})

bot.on('text', (ctx) => {
    let text = ctx.message.text;
    if(text.search(/^[+]?998([- ])?(90|91|93|94|95|98|99|33|97|71)([- ])?(\d{3})([- ])?(\d{2})([- ])?(\d{2})$/) != -1) {
        axios({
            method: 'patch',
            url: 'http://localhost:5000/api/v1/lead/',
            headers,
            data: JSON.stringify({
                "user_id": `${ctx.from.id}`,
                "phone": text
            
            })
          })
          .then(function (resp) {
            axios({
                method: 'get',
                url: 'http://localhost:5000/api/v1/course',
                headers
              })
              .then(function (response) {
                let keyboard = [];
                let a = [];
                let data = response.data
                data.map(element => {
                    keyboard.push({text: element.name, callback_data: `Course=${element.id}=${resp.data}`})
                });
        
                for (let index = 0; index < keyboard.length; index+=2) {
                            a.push(keyboard.slice(index, index + 2))
                }
                console.log(a)
        
                ctx.reply("Courses", { reply_markup: JSON.stringify({ inline_keyboard: a }) });
              })
              .catch((error) => {
                console.log(error.response.data.error);
                ctx.reply("Kurslar tabilmadi")
              })    
          })
          .catch((error) => {
            console.log(error.response.data.error);
            return ctx.reply("Qa'telik ju'z berdi")
          });    
    }else{
        ctx.reply("Telefon nomerdi qa'te kiritin'iz!")
    }
})

bot.launch({ dropPendingUpdates: true});
