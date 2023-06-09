//Import Modules
const { MessageEmbed,InteractionType  } = require("discord.js");
const nwc = require('../functions/nwc.js');
const Discord = require('discord.js')
const fs = require('fs')
const moment = require('moment-timezone')
module.exports = async (client, interaction) => {
    const {guild, member, customId} = interaction;
    let today = moment.tz('Australia/Sydney');
    if (interaction.type !== 'MODAL_SUBMIT') return;
    if(!customId.startsWith('paymentsent')) return;

    let expectedID = customId.split('+')[1]
    let devID = customId.split('+')[2]
    let checkout_msg_id = customId.split('+')[3]
    let checkout_channel_id = customId.split('+')[4]
    
    //Read Files
    let settings = JSON.parse(fs.readFileSync(`./database/settings.json`))
    let cartFile = JSON.parse(fs.readFileSync(`./database/carts/${expectedID}/cart.json`))
    let devs = fs.readdirSync(`./database/devs/`)

    //Fetch input from Modal
    let transactionID = interaction.fields.getTextInputValue(`transactionid+${member.id}`)

    //Fetch Channel
    let payment_confirmation_channel = await client.channels.cache.get(settings.payment_confirmation_channels[devID])

    //Prepare Cart:Price Message
    let cartMsg = ''
    let totalCost = 0
    cartFile.devID[devID].forEach(item => {
        cartMsg += `${item}: **$${cartFile.cart[item].price} AUD**\n`
        totalCost += cartFile.cart[item].price
    })
    cartMsg += `Total Expected Payment: **$${nwc(totalCost)} AUD**`

    //return console.log(totalCost, cartMsg)

    //Post confirmation message in feched chnanel
    payment_confirmation_channel.send({
        embeds: [
            new MessageEmbed()
            .setColor('GREEN')
            .setTitle(`Payment Confirmation | ${member.user.tag}`)
            .setAuthor({
                name: `Transaction ID: ${transactionID}`,
                iconURL: member.user.avatarURL()
            })
            .setThumbnail(guild.iconURL())
            .setDescription(`Payment confirmation for <@${devID}> from <#${checkout_channel_id}>`)
            .addField('Cart Items', cartMsg)
            .setTimestamp()
            .setFooter({
                text: `Press the "Payment Approved" button to confirm the order`
            })
        ],
        components: [
            new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                .setCustomId(`confirmPayment|${devID}|${checkout_channel_id}|${expectedID}|${member.id}`)
                .setLabel('Confirm Payment')
                .setEmoji(settings.emotes.loading)
                .setStyle('PRIMARY')
            )
        ]
    })

    //Update the original interaction
    let orderChannel = await client.channels.cache.get(checkout_channel_id)
    await orderChannel.messages.fetch(checkout_msg_id).then(m => {
        m.edit({
            components: [
                new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                    .setCustomId('delfsfseteMessage')
                    .setLabel('Payment confirmation request sent!')
                    .setEmoji(settings.emotes.check)
                    .setStyle('SECONDARY')
                    .setDisabled(true)
                )
            ]
        })
    })

    //Reply to interaction
    interaction.reply({
        embeds: [
            new MessageEmbed()
            .setColor('GREEN')
            .setDescription(`${settings.emotes.check} Payment confirmation request submitted, once payment is approved, you will recieve your files`)
        ],
        ephemeral: true
    })

}