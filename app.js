require('dotenv').config();
const { App } = require('@slack/bolt');
const https = require("https");
const axios = require('axios');
const signingSecret = process.env['SLACK_SIGNING_SECRET']
const botToken = process.env['SLACK_TOKEN'];
const weatherApi = process.env['WEATHER_KEY'];
const app = new App({
    signingSecret: signingSecret,
    token: botToken,
});

(async () => {
    await app.start(process.env.PORT || 12000);

    app.event('app_mention', async ({ event, context, client, say }) => {
        try {
            await say(`Hey <@${event.user}>, Hope you are having a wonderful day!!\n To start using the bot start off by using commands such as '''/joke,/quote and /weather city_name'''`);

        }
        catch (error) {
            console.error(error);
        }
    });

    app.command("/weather", async ({ command, say, ack }) => {
        try {
            const apiKey = weatherApi;
            const query = command.text;
            if (query === "") {
                await say("_Please provide a city name after the command_");
            }
            else {
                const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=metric"
                https.get(url, function (response) {
                    if (response.statusCode != 200) {
                        say("*❗There was an error getting the weather❗*")
                    }
                    else {
                        response.on("data", async function (data) {
                            const weatherData = JSON.parse(data);
                            const temp = weatherData.main.temp;
                            const desc = weatherData.weather[0].description;
                            const icon = weatherData.weather[0].icon;
                            const iconUrl = "https://openweathermap.org/img/wn/" + icon + "@2x.png";

                            const message = {
                                "attachments": [
                                    {
                                        "pretext": `Hey <@${command.user_id}>, here is your weather report`,
                                        "text": `The weather in *${weatherData.name}* looks like *${desc}* with a temperature of *${temp}C*`,
                                        "image_url": iconUrl,
                                    },]
                            }
                            await say(message);
                        })
                    }
                })
            }
            ack();

        } catch (error) {
            console.log("err")
            console.error(error);
        }
    });
    app.command("/joke", async ({ command, ack, say }) => {
        try {
            https.get("https://v2.jokeapi.dev/joke/Any", async function (response) {
                if (response.statusCode != 200) {
                    await say("*Sorry, There was an error generating a joke :(❗*")
                }
                else {
                    response.on("data", async function (data) {
                        const jokeData = JSON.parse(data);
                        if (jokeData.type === "twopart") {
                            const setup = jokeData.setup;
                            const delivery = jokeData.delivery;

                            const message = {
                                "attachments": [
                                    {
                                        "pretext": `Generating a random joke for <@${command.user_id}>`,
                                        "text": "Here is a two part _" + jokeData.category + "_ joke for you.....\n" + "Setup: " + setup + "\n\n" + "Delivery: " + delivery,
                                    },]
                            }
                            await say(message);
                        }
                        else {
                            const joke = jokeData.joke;
                            const message = {
                                "attachments": [
                                    {
                                        "pretext": `Generating a random joke for <@${command.user_id}>`,
                                        "text": "Here is a _" + jokeData.category + "_ joke for you.....\n" + joke,
                                    },]
                            }
                            await say(message);
                        }
                    })
                }
            })
            await ack();

        } catch (error) {

            console.log("err")
            console.error(error);
        }
    });
    app.command("/quote", async ({ command, ack, say }) => {
        try {
            let resp = await axios.get(`https://api.quotable.io/random`);
            const quote = resp.data.content;

            const message = {
                "attachments": [
                    {
                        "pretext": `Generating the Quote of the day for <@${command.user_id}>`,
                        "text": `"${quote}"\n -*${resp.data.author}*`,
                    },]
            }
            await say(message);
            await ack();

        } catch (error) {
            console.log("err")
            console.error(error);
        }
    });


    console.log(`⚡️ Bolt app is running!`);
})();
