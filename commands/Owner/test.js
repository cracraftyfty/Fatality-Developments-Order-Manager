var Discord = require(`discord.js`);
const {
    MessageEmbed,
    CommandInteraction,
    MessageActionRow,
    MessageButton
} = require('discord.js')
var config = require(`../../botconfig/config.json`);
var settings = require(`../../botconfig/settings.json`);
var ee = require(`../../botconfig/embed.json`);
const fs = require('fs');
const fetch = require('node-fetch');
module.exports = {
    name: "test",
    category: "Owner",
    aliases: ["changebotavatar", "botavatar", "botprofilepicture", "botpfp"],
    cooldown: 5,
    usage: "changeavatar <Imagelink/Image>",
    description: "Changes the Avatar of the BOT: I SUGGEST YOU TO DO IT LIKE THAT: Type the command in the Chat, attach an Image to the Command (not via link, just add it) press enter",
    memberpermissions: [],
    requiredroles: [], 
    alloweduserids: settings.ownerIDS,
    minargs: 0,
    maxargs: 0,
    minplusargs: 0,
    maxplusargs: 0,
    argsmissing_message: "",
    argstoomany_message: "",
    run: async (client, message, args, plusArgs, cmdUser, text, prefix) => {
        
        message.delete()
        let embeds = JSON.parse(fs.readFileSync(`./database/embeds.json`))
               
        //APPLY HERE
        await message.channel.send({
            embeds: [
                new Discord.MessageEmbed()
                .setTitle('Fatality Developments - Premade Orders')
                .setDescription('Select the desired option below to make an Order or if you have an enquiry!')
                .setURL('https://discord.com/channels/868366789476745257/1058335634902765639/1066577192659722310')
                .setThumbnail(message.guild.iconURL())
                .setColor('#03FF03')
                .setFooter({text: ee.footertext, iconURL: ee.footericon})
            ], 
            components: [
                new Discord.MessageActionRow()
                .addComponents(
                    /* new Discord.MessageSelectMenu()
                    .setCustomId('order')
                    .setPlaceholder('Select an option from dropdown')
					.setMinValues(1)
					.setMaxValues(5)
                    .addOptions([
                        {
                            label: '👕 Clothing Ticket',
                            description: 'Open an enquiry about clothing, kuttes and more!',
                            value: 'order_clothing',
                        },
                        {
                            label: '🚗 Vehicle Ticket',
                            description: 'Open an enquiry about our range of custom motorcycles!',
                            value: 'order_vehicle',
                        },
                        {
                            label: '🏠 Interior Ticket',
                            description: 'Open an enquiry about a custom MLO!',
                            value: 'order_interior',
                        },
                        {
                            label: '🖌️ GFX Ticket',
                            description: 'Open an enquiry about logo work, streamer packs and more!',
                            value: 'order_gfx',
                        },
                        {
                            label: '📜 Script Ticket',
                            description: 'Open an enquiry about custom scripts or training servers!',
                            value: 'order_script',
                        },
                        {
                            label: '⛓️ Accessories Ticket',
                            description: 'Open an enquiry about custom chains, rings and more!',
                            value: 'order_accessory',
                        },
                        {
                            label: '🗒️ General Enquiry',
                            description: 'Open a general enquiry!',
                            value: 'ticket_general',
                        }
                    ]) */
                    new Discord.MessageSelectMenu()
                    .setCustomId('order-premade')
                    .setPlaceholder('Select the desired option to purchase')
					.setMinValues(1)
					.setMaxValues(2)
                    .addOptions([
                        {
                            label: '📦 Premade Packages',
                            description: 'Order premade clothing packages and bikes here!',
                            value: 'pre-order_packages',
                        },
                        {
                            label: '🛠️ Premade Accessories',
                            description: 'Order premade rings, chains and belt buckles here!',
                            value: 'pre-order_accessories',
                        }
                    ])
                )
            ]},
        ).then(m => {
            if(!embeds[m.id]){
                embeds[m.id] = m.embeds[0]
                fs.writeFileSync(`./database/embeds.json`, JSON.stringify(embeds, null, 4))
            }
        })

        client.on('interactionCreate', interaction => {
            interaction.reply({content: 'Command in development', ephemeral: true})
        })
    }
}

/* 
new Discord.MessageButton()
    .setCustomId('on')
    .setLabel('Clock on')
    .setEmoji('🟢')
    .setStyle('PRIMARY'),
*/


/* 
.then(m => {
    if(!embeds[m.id]){
        embeds[m.id] = m.embeds[0]
        fs.writeFileSync(`./database/embeds.json`, JSON.stringify(embeds, null, 4))
    }
})
*/