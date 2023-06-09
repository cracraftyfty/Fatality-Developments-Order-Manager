const { MessageEmbed,InteractionType  } = require("discord.js");
const settings = require('../../database/settings.json');
module.exports = {
  	name: "unregister",
  	description: "Register a developer into the bot",
  	cooldown: 5,
  	memberpermissions: [],
  	requiredroles: [
        "868368037080887348", //Marcus Founder
        "952718212745797712", //Ocyis Founder
        "1063466746650038403" //Bot Dev Test
    ],
  	alloweduserids: [],
  	options: [ 
		{
            "User": {
                name: "choose_the_dev",
                description: "Select a dev to unregister",
                required: false 
            }
        },
        {
            "String": {
                name: "dev_id",
                description: "Mention the ID of the dev to unregister",
                required: false 
            }
        }
	],
  	run: async (client, interaction) => {
        const {
            guild,
            member,
            customId
        } = interaction;

        //Fetch variables
        let dev
        if(interaction.options.getUser("choose_the_dev")) dev = interaction.options.getUser("choose_the_dev").id
        if(interaction.options.getString("dev_id")) dev = interaction.options.getString("dev_id")

        //If no values entered
        if(!dev) return interaction.reply({
            embeds: [
                new MessageEmbed()
                .setColor('RED')
                .setDescription(`${settings.emotes.wrong} Please **Mention the Dev** or type in the **Dev ID** in the desired selection box`)
            ],
            ephemeral: true
        })

        //if both values entered
        if(interaction.options.getUser("choose_the_dev") && interaction.options.getString("dev_id"))  return interaction.reply({
            embeds: [
                new MessageEmbed()
                .setColor('RED')
                .setDescription(`${settings.emotes.wrong} Please either **Mention the Dev** OR type in **Dev ID**, Doing both will be a conflict.`)
            ],
            ephemeral: true
        })


        console.log(dev)
    }
}