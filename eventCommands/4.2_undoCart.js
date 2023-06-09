//Import Modules
const { MessageEmbed,InteractionType  } = require("discord.js");
const cap = require('../functions/cap.js');
const Discord = require('discord.js')
const fs = require('fs')
const moment = require('moment-timezone')
module.exports = async (client, interaction) => {
    const {guild, member, customId} = interaction;
    
    if(!interaction.isSelectMenu()) return
    if(!customId.startsWith('adjust')) return
    let settings = JSON.parse(fs.readFileSync(`./database/settings.json`))
    
    let cartFile = JSON.parse(fs.readFileSync(`./database/carts/${member.id}/cart.json`))
    let cart = cartFile.cart

    await interaction.values.forEach(async v => {
        let itemName = v.split('|')[1]
        if(cart[itemName]) delete cart[itemName]
        else return interaction.reply({
            embeds: [
                new MessageEmbed()
                .setColor('RED')
                .setDescription(`${settings.emotes.wrong} **${cap(itemName)}** does not exist in your cart`)
            ],
            ephemeral: true
        })
    })

    //Update Embed
    let cartMessage = ''
	let totalPrice = 0
	let selectOptions = []
	for(let keys in cart){
		cartMessage += `- ${cart[keys].qty}x ${keys}: $${cart[keys].qty*cart[keys].price} AUD\n`
		totalPrice += cart[keys].qty*cart[keys].price
		selectOptions.push({
			label: keys,
			value: `adjust|${keys}|${member.id}`
		})
	}

    fs.writeFileSync(`./database/carts/${member.id}/cart.json`, JSON.stringify(cartFile, null, 4))

    if(selectOptions.length <= 0) return interaction.update({
        embeds: [
            new MessageEmbed()
            .setColor('GREEN')
            .setDescription(`Your cart is now Empty`)
        ],
        components: [],
        ephemeral: true
    })
    
    else interaction.update({
        embeds: [
            new MessageEmbed()
            .setColor('GREEN')
            .setTitle(`${member.user.username}'s Cart`)
            .setDescription(`Items in your cart:\n${cartMessage}\n\n**Total Cost**: $${totalPrice} AUD`)
        ],
        components: [
            new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                .setCustomId(`checkout`)
                .setLabel('Checkout')
                .setEmoji(settings.emotes.loading)
                .setStyle('PRIMARY')
			),
            new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageSelectMenu()
                .setCustomId('adjust')
                .setPlaceholder('Select the items from the list to remove items from cart')
                .setMinValues(1)
                .setMaxValues(selectOptions.length)
                .addOptions(selectOptions)
            )
        ],
        ephemeral: true
    })

    

    return
    //Remove cart item
    let dirString = customId.split('|')[2]
    let qty = customId.split('|')[1]
    let settingsFile = JSON.parse(fs.readFileSync(`./database/${dirString}/settings.json`))
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