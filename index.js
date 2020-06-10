require("dotenv").config();
const Discord = require("discord.js");
const bot = new Discord.Client();
const fetch = require("node-fetch");
const stripHtml = require("string-strip-html");

bot.login(process.env.TOKEN);

bot.on("ready", () => {
  console.info(`Logged in as ${bot.user.tag}!`);
});

const exampleEmbed = (title, result) =>
  new Discord.MessageEmbed()
    .setColor("#0099ff")
    .setTitle(title)
    .setURL(`https://developer.mozilla.org/en-US/docs/${result.slug}`)
    .setDescription(stripHtml(result.excerpt))
    .setImage(
      "https://developer.mozilla.org/static/img/opengraph-logo.72382e605ce3.png"
    )
    .setTimestamp();

bot.on("message", async (msg) => {
  if (msg.content.startsWith("get-mdn")) {
    const arguments = msg.content.split(" ").slice(1);
    const [topic, focus] = arguments;

    if (topic) {
      let link = `https://developer.mozilla.org/api/v1/search/en-US?q=${topic}`;
      if (focus) {
        link += `+${focus}`;
      }
      const data = await fetch(link);
      const result = await data.json();
      const firstResult = result.documents.find((doc) => {
        return doc.slug.split("/").includes("JavaScript");
      });
      try {
        msg.channel.send(
          exampleEmbed(
            `You wanted access ${focus ? topic : ""} docs on ${
              focus ? focus : topic
            }`,
            firstResult
          )
        );
      } catch (err) {
        console.log(err);
      }
    } else {
      msg.reply(`
        You need to specify at least the topic you need such as;
        ${`>>> 
        Arrays
        Objects
        Strings
        Number
        Conditionals`}
        `);
    }
  }
});
