# slack-chat-bot🤖

- This is a simple Chat Bot built using the **Slack API** and can be accessed on Slack workspace.\
- The bot currently provides simple functionalities such as generating a joke, returning a random quote and providing the weather report in various cities.\
- The application uses the respective API based on the service the user wants using https requests and provides the data directly in the chat. 

---

### To start running the chat bot locally, follow the below steps: 
*Before starting the process make sure you have a account in Slack and add a bot to your primary workspace where this application will be operating*

1. Clone the below repo into your local machine
2. Now provide the .env variables for the app.js module, these include the bot token, secret signing token and all the required api keys for the various apis being used in the application.<br> 

  ```
  export SLACK_SIGNING_SECRET=********************** 
  export SLACK_TOKEN=**********************
  export WEATHER_KEY=*********************
  ```
  ><sub>*Provide your tokens from your own Slack app for autorizing your slack bot.<br> In our case we are including the api key to the weather application as we 
  have weather report functionaility but this can differ based on your application for the chat bot*<sub>
  
  3. In order to run this application locally you need to provide a proxy web address to the Slack application so that it can connect to our localhost machine. 
  We can achieve this by using ngrok.
  ```
  npm i -g ngrok
  ngrok http 12000 -region in
  ```
  > This will install ngork and provide a proxy web address for your localhost:12000 address. 
  
  4. Once the proxy is up, we start my navigating to the cloned repository and start the application using 
  ```
  node app.js
  ```
  
 5. Additionally we need to provide access and enable event subscriptions on the slack app, so head on to <a href="api.slack.com" target="_blank">Slack API</a>
 6. Head on to the bot you created in your workspace, and navigate to event subscriptions, enable it and provide the url that you get after running ngrock
 7. Append the url with slack/events
 8. Now navigate below to bot events and add two events namely **app_mention** and **message.im**
 9. Navigate to permissiong and OAuth Tokens and enable the following scopes 
    - app_mentions:read
    - chat :write
    - commands 
    - incoming-webhook
    - im:history
10. Now finally go on over to slash commands and set up the three commands in our case, /joke,/weather [city_name] and /quote.

11. After a successfull reinstall you shall be able to post messages in the channel you created and invited your chat bot and the chat bot shall respond aptly by providing the requested commands.
---
