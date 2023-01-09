/// npm run devStart

require('dotenv').config()

const fs = require('node:fs');
const path = require('node:path');
const { Client, Events, Collection, EmbedBuilder, AttachmentBuilder, GatewayIntentBits, AutoModerationRuleKeywordPresetType, ApplicationCommandOptionWithChoicesAndAutocompleteMixin } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});
client.login(process.env.BOT_TOKEN);
client.commands = new Collection();

const sqlite = require("sqlite");
const sqlite3 = require("sqlite3");
const { formatWithOptions } = require('node:util');

let db = new sqlite3.Database('./data/myData.sqlite', sqlite3.OPEN_READWRITE);


const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}


client.on('ready', () => {
    console.log('Bot is online');
    /* Create a table named 'meals' with two columns:
    |meal|meat|
    You should only need this once
    You can alternatively use DB Browser to set up the table
*/
    db.run('CREATE TABLE IF NOT EXISTS Meals (meal TEXT, protein TEXT, kid_friendly BOOLEAN, recipe TEXT)');
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);
    const channel = client.channels.cache.get(process.env.CHANNELID);
    console.log(command.data.name)

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        /* For the /new slashcommand */
        if (command.data.name === 'new') {
            // Execute the new commmand
            // Returns an Array 
            // new_meal = [meal String, protein String, kid_friendly BOOL, recipe String]
            new_meal = await command.execute(interaction);

            // Selects the row in the database where the meal name and the protein are the same as those given in new_meal
            db.get(
                `SELECT * 
                FROM Meals 
                WHERE meal = '${new_meal[0]}'
                AND protein = '${new_meal[1]}'`, async function (err, row) {
                // If no meal with the given meal name and protein exist:
                if (!row) {
                    // Insert the new_meal into the database
                    db.run(
                        `INSERT INTO Meals (meal, protein, kid_friendly, recipe) VALUES ('${new_meal[0]}', '${new_meal[1]}', '${new_meal[2]}', '${new_meal[3]}');`
                    );

                    // Reply to the command with confirmation of the newly added meal
                    // Comment out if you want the message to always go to a specific channel
                    await interaction.reply(`${new_meal[0]} with ${new_meal[1]} has been added!`);
                    
                    // Send a message to a given channel confirming the meal has been added
                    // Uncomment the following line if you want to use a specific channel instead of replying in the current channel
                    //client.channels.cache.get(channel).send(`${new_meal[0]} with ${new_meal[1]} has been added!`);

                    console.log("ADDED");
                    return;
                }
                else {
                    // If the meal already exists in the database with that combination of protein then let the user know.
                    await interaction.reply("That meal has already been added.")
                    console.log(`${row.meal} already exists`);
                    return;
                }
            });
        }

        else if (command.data.name === 'suggest') {
            suggest = await command.execute(interaction);

            db.all(`SELECT * 
            FROM Meals 
            WHERE kid_friendly = '${suggest[1]}'
            ORDER BY RANDOM() LIMIT '${suggest[0]}'`, async function (err, results, fields) {
                if (err) throw err;
                // *** FIX FOR EMPTY RETURN - Current implementation works but could be prettier
                if (!results) return;
                const exampleEmbed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle(`${results.length} meal suggestions:`);
                for (let i in results) {
                    const valField = results[i].recipe === 'False' ? `with ${results[i].protein}` : `with ${results[i].protein}\n[Link to recipe](${results[i].recipe})`;

                    exampleEmbed.addFields({ name: `${parseInt(i) + 1}: ${results[i].meal}`, value: valField })

                }
                await interaction.reply({ embeds: [exampleEmbed] });
                console.log(results);
            });
        }
        else await command.execute(interaction);

    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.on('message', message => {
    
});    
