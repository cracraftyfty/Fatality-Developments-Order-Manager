const { MessageEmbed,InteractionType  } = require("discord.js");
const settings = require('../database/settings.json');
const Discord = require('discord.js')
const fs = require('fs')
module.exports = {
  	name: "cart",
  	description: "Shows the cart of the user",
  	cooldown: 5,
  	memberpermissions: [],
  	requiredroles: [],
  	alloweduserids: [],
  	options: [],
  	run: async (client, interaction) => {
		const {
            guild,
            member,
            customId
        } = interaction;

		//Check if cart exists
		if(!fs.existsSync(`./database/carts/${member.id}/`)) return interaction.reply({
			embeds: [
				new MessageEmbed()
				.setColor('RED')
				.setDescription(`${settings.emotes.wrong} Your cart is empty`)
			],
			ephemeral: true
		})

		//Read Files
		let cartFile = JSON.parse(fs.readFileSync(`./database/carts/${member.id}/cart.json`))

		//check if cart has anything
		let cart = cartFile.cart
	
		if(isEmpty(cart)){
			interaction.reply({
				embeds: [
					new MessageEmbed()
					.setColor('RED')
					.setDescription(`${settings.emotes.wrong} Your cart is empty`)
				],
				ephemeral: true
			})
		}else{
			//Make a list of items in cart
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

			interaction.reply({
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
		}





		//MISC FUNCTIONS
		function isEmpty(obj) {
			return Object.keys(obj).length === 0;
		}
    }
}