const { Telegraf } = require('telegraf');

const bot = new Telegraf('5943068483:AAEzNtXNsLjCU5ef8vQwWLE5SyLZaTaL0JI');

bot.start(async (ctx) => {
    await ctx.reply("Asslawma Aleykum ulli ma'rtebelim")
});

bot.launch();
