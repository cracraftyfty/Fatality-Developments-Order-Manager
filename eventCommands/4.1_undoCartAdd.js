//Import Modules
const { MessageEmbed,InteractionType  } = require("discord.js");
const cap = require('../functions/cap.js');
const Discord = require('discord.js')
const fs = require('fs')
const moment = require('moment-timezone')
module.exports = async (client, interaction) => {
    const {guild, member, customId} = interaction;
    let today = moment.tz('Australia/Sydney');
    if(!interaction.isButton()) return
    if(!customId.startsWith('undo|')) return
    let settings = JSON.parse(fs.readFileSync(`./database/settings.json`))

    //Remove cart item
    let dirString = customId.split('|')[2]
    let qty = customId.split('|')[1]
    let settingsFile = JSON.parse(fs.readFileSync(`./database/${dirString}/settings.json`))
    let cart = JSON.parse(fs.readFileSync(`./database/carts/${member.id}/cart.json`))
    let itemName = settingsFile.details.name

    //Check if item exist
    if(cart.cart[itemName]){
        //Check if item qty is more than or equal to 1
        delete cart.cart[itemName]
        fs.writeFileSync(`./database/carts/${member.id}/cart.json`, JSON.stringify(cart, null, 4))
    }else{
        return interaction.reply({
            embeds: [
                new MessageEmbed()
                .setColor('RED')
                .setDescription(`${settings.emotes.wrong} **${cap(itemName)}** does not exist in your cart`)
            ],
            ephemeral: true
        })
    }

    //Disable Button
    interaction.update({
        components: [
            new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId(`usfsndo|1|}`)
                    .setLabel('Item removed from cart')
                    .setEmoji(settings.emotes.check)
                    .setStyle('SECONDARY')
                    .setDisabled(true)
            )
        ]
    })
}