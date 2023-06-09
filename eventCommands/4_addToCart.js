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

    if(customId.startsWith('AddToCart')){
        let dirString = customId.split('|')//.join('/')
        dirString.shift()

        let orderDir = fs.readdirSync(`./database/${dirString.join('/')}`)
        let settingsFile = JSON.parse(fs.readFileSync(`./database/${dirString.join('/')}/settings.json`))
        let settings = JSON.parse(fs.readFileSync(`./database/settings.json`))

        //Check if cart Folder exists or not
        if(!fs.existsSync(`./database/carts/${member.id}/`)){
            fs.mkdirSync(`./database/carts/${member.id}/`)
            
            let cart = {
                "details": {
                    "owner_discordID": member.id,
                    "owner_discordTag": member.user.tag,
                    "time_created":today.format("DD-MM-YYYY | HH:mm:ss") 
                },
                "cart": {}
            }
            cart.cart[settingsFile.details.name] = {
                "qty": 1,
                "price": settingsFile.details.price,
                "dir": dirString.join('/')
            }
            fs.writeFileSync(`./database/carts/${member.id}/cart.json`, JSON.stringify(cart, null, 4))
            fs.mkdirSync(`./database/carts/${member.id}/cart logs/`)
        }
        else{
            
            let cart_file = JSON.parse(fs.readFileSync(`./database/carts/${member.id}/cart.json`))
            if(cart_file.cart[settingsFile.details.name]) {
                return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                        .setColor('RED')
                        .setDescription(`${settings.emotes.wrong} You already have 1 of **${settingsFile.details.name}** in your cart`)
                    ],
                    ephemeral: true
                })
                cart_file.cart[settingsFile.details.name].qty += 1
            }
            else cart_file.cart[settingsFile.details.name] =  {
                "qty": 1,
                "price": settingsFile.details.price,
                "dir": dirString.join('/')
            }
            //Update cart file
            fs.writeFileSync(`./database/carts/${member.id}/cart.json`, JSON.stringify(cart_file, null, 4))
        }

        
        interaction.reply({
            embeds: [
                new MessageEmbed()
                .setColor('GREEN')
                .setDescription(`${settings.emotes.check} **1x ${cap(settingsFile.details.name)}** added to cart`)
            ],
            components: [
                new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                        .setCustomId(`undo|1|${dirString.join('/')}`)
                        .setLabel('Remove from Cart')
                        .setEmoji('🛒')
                        .setStyle('DANGER')
                )
            ],
            ephemeral: true
        })
    }
}