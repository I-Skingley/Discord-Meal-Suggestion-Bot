const { SlashCommandBuilder } = require('discord.js');


module.exports = {
  data: new SlashCommandBuilder()
    .setName('suggest')
    .setDescription('Suggest meals')
    .addStringOption(option =>
      option.setName('days')
        .setDescription('For how many days would you like suggestions?')
        .setRequired(true))
    .addBooleanOption(option =>
      option.setName('kid_friendly')
        .setDescription('Should the meals be Kid friendly?')
        .setRequired(true))
  ,
  async execute(interaction) {

    const suggest = [
      interaction.options.getString("days"),
      interaction.options.getBoolean("kid_friendly"),
    ];

    return suggest;

  }
};
