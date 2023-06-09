//Import Modules
const { MessageEmbed,InteractionType  } = require("discord.js");
const cap = require('../functions/cap.js');
const Discord = require('discord.js')
const fs = require('fs')
const moment = require('moment-timezone')
module.exports = async (client, interaction) => {
    const {guild, member, customId} = interaction;
    let today = moment.tz('Australia/Sydney');
    if(!interaction.isSelectMenu()) return

    interaction.values.forEach(v => {
        if(!v.startsWith('orderProcess')) return
        let dir = fs.readdirSync(`./database/${v.split("|")[1]}/${v.split("|")[2]}/${v.split("|")[3]}`)
        //console.log(customId, v)
        interaction.channel.send({
            embeds: [
                new MessageEmbed()
                .setColor('GREEN')
                .setTitle(`${cap(v.split("|")[3].split("/")[1])}`)
                .setDescription(`PLACEHOLDER_DETAILS`)
            ],
            components: [
                new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                        .setCustomId(`AddToCart|${customId.split('-')[1]}|${v.split('|')[2]}|${customId.split('-')[2]}|${v.split("|")[3].split("/")[1]}`)
                        .setLabel('Add to Cart')
                        .setEmoji('🛒')
                        .setStyle('PRIMARY'),
                    new Discord.MessageButton()
                        .setCustomId('deleteMessage')
                        .setLabel('Disregard Message')
                        .setEmoji('🔵')
                        .setStyle('SECONDARY')
                )
            ]
        })
    })
}