const { MessageEmbed } = require("discord.js");
const settings = require('../../database/settings.json');
const fs = require('fs')
module.exports = {
  	name: "register",
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
		{"User": { name: "choose_the_dev", description: "Select a dev to register", required: true }},
	],
  	run: async (client, interaction) => {
		const {
            guild,
            member,
            customId
        } = interaction;

        //Fetch variables
        let dev = interaction.options.getUser("choose_the_dev")

        //Declare Files
        let dev_dir = fs.readdirSync(`./database/devs`)
        
        //Check if dev directory already exists
        if(fs.existsSync(`./database/devs/${dev.id}/`)){
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setColor('RED')
                    .setDescription(`${settings.emotes.wrong} Developer Database for ${dev} already exists. Unable to create another`)
                ],
                ephemeral: true
            })
        }else{
            let path = `./database/devs/${dev.id}`
            
            //Create dev directory
            fs.mkdir(path, (error) => {
                if(error) console.log(error)
                else{
                    //Create files inside the dev directory
                    let dev_template = JSON.parse(fs.readFileSync(`./database/dev_template.json`))
                    dev_template.details.id = dev.id
                    dev_template.details.tag = dev.tag
                    dev_template.add_logs.added_by.id = member.user.id
                    dev_template.add_logs.added_by.tag = member.user.tag
                    fs.writeFileSync(`./database/devs/${dev.id}/dev_details.json`, JSON.stringify(dev_template, null, 4))

                    console.log(`[FD-DEV_DIR] Directory created for ${dev.id} [${dev.tag}]`)

                    interaction.reply({
                        embeds: [
                            new MessageEmbed()
                            .setColor('GREEN')
                            .setDescription(`${settings.emotes.check} Database successfully setup for ${dev}`)
                        ],
                        ephemeral: true
                    })
                }
            })
        }
  	}
}