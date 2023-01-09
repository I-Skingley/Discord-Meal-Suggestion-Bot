const { SlashCommandBuilder } = require('discord.js');


module.exports = {
  data: new SlashCommandBuilder()
    .setName('new')
    .setDescription('Add a new meal')
    .addStringOption(option =>
      option.setName('meal')
        .setDescription('What is the name of the meal?')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('protein')
        .setDescription('Which type of protein is used?')
        .setRequired(true))
    .addBooleanOption(option =>
      option.setName('kid_friendly')
        .setDescription('Is the meal Kid friendly?')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('recipe')
        .setDescription('Do you have a link to the recipe?'))
  ,
  async execute(interaction) {

    // FIX FOR SPECIAL CHARACTER ENTRIES

    const meal = [
      String(interaction.options.getString("meal")),
      String(interaction.options.getString("protein")),
      interaction.options.getBoolean("kid_friendly"),
      String(interaction.options.getString('recipe') ?? 'False')
    ];

    return meal;

  }
};
