const { MessageEmbed } = require("discord.js");
const settings = require('../../database/settings.json');
const fs = require('fs')
module.exports = {
  	name: "details",
  	description: "Add/Update details to the bot",
  	cooldown: 5,
  	memberpermissions: [],
  	requiredroles: [
        "868368037080887348", //Founder
        "952718212745797712", //Founder 2
        "868368413716787291", //Lead Dev
        "868369842854563850", //Senior Dev
        "868368508390613063", //Dev
        "868368721272533003", //Trial Dev
        "1063466746650038403" //Bot Test role
    ],
  	alloweduserids: [],
  	options: [ 
		{
            "StringChoices": {
                name: "input",
                description: "What detail would you like to change",
                required: true,
                choices: [
                    ["bsb", "bsb"],
                    ["acc_number", "acc_number"],
                    ["paypal", "paypal"],
                    ["dev_category_id", "dev_category_id"]
                ] 
            }
        },
        {
            "String": {
                name: "value",
                description: "Enter the detail",
                required: true 
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
        let change_category = interaction.options.getString("input")
        let change_value = interaction.options.getString("value")

        //Read Files
        let devFolder = `./database/devs/${member.id}`

        //Check if dev folder exist
        if(!fs.existsSync(devFolder)) return interaction.reply({
            embeds: [
                new MessageEmbed()
                .setColor('RED')
                .setDescription(`${settings.emotes.wrong} You are not a registered developer in the bot's database, kindly ask Senior Management to register yourself into database`)
            ],
            ephemeral: true
        })

        //update value
        let dev_settings = JSON.parse(fs.readFileSync(`./database/devs/${member.id}/dev_details.json`))
        if(change_category === "dev_category_id") dev_settings.dev_category = change_value
        else dev_settings.payment[change_category] = change_value
        
        fs.writeFileSync(`./database/devs/${member.id}/dev_details.json`, JSON.stringify(dev_settings, null, 4))

        //reply to message
        return interaction.reply({
            embeds: [
                new MessageEmbed()
                .setColor('GREEN')
                .setDescription(`${settings.emotes.check} [**${change_category.toUpperCase()}**] Details changed to: **${change_value}**`)
            ],
            ephemeral: true
        })
    }
}