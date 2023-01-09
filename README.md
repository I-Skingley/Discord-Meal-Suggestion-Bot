# Discord Meal Suggestion Bot

## General info

A discord bot for getting meal suggestions from a given meal database.

Users can: 

* Add new meals to the database
* Request an amount of meal suggestions from the database

## Tech

Created with js

* Uses the discord.js library to interact with the Discord api.
* Currently uses sqlite3 to build the database

# TO DO

* Clean up index
* * Move events to event folder
* * Move functionality to commands/events
* Search by different fields
* Improve Embed

## Database layout

Table

Meals

| name | TYPE | Description
| ---- | ---- | ---- |
| `id` | `INTEGER` | numerical identifier
| `meal` | `TEXT` | Name of the meal
| `protein` | `TEXT` | Main protein used in the meal
| `kid_friendly` | `BOOLEAN` | Whether or not the meal is considered kid friendly ()
| `recipe` | `TEXT` | Intended to be a URL to a recipe

## Setup

To run this project, install it locally using npm:

```
$ npm install
$ node deploy-commands.js
$ npm run start
```

Will require the following in an .env file:
* BOT_TOKEN = Discord bot token
* CLIENTID = Discord bot client ID
* GUILDID = Discord server ID
* CHANNELID = Discord channel ID

A meal database is included at ./data/myData.sqlite. Delete that file if you'd like to start a new database.