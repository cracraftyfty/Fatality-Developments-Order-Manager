//Import Modules
const { MessageEmbed,InteractionType  } = require("discord.js");
const nwc = require('../functions/nwc.js');
const Discord = require('discord.js')
const fs = require('fs')
const moment = require('moment-timezone')
module.exports = async (client, interaction) => {
    const {guild, member, customId} = interaction;
    let today = moment.tz('Australia/Sydney');
    if(!interaction.isButton()) return
    if(!customId.startsWith('checkout')) return

    //Read Files
    let settings = JSON.parse(fs.readFileSync(`./database/settings.json`))
    let cartFile = JSON.parse(fs.readFileSync(`./database/carts/${member.id}/cart.json`))
    let devs = fs.readdirSync(`./database/devs/`)

    //Read Variables
    let checkoutCounter = settings.checkoutCounter
    let cart = cartFile.cart

    //loop thru cart
    let devID = {

    }
    for(let items in cart){
        for(let files in devs){
            //console.log(devs[files]) 
            let devFile = JSON.parse(fs.readFileSync(`./database/devs/${devs[files]}/dev_details.json`))
            if(devFile.ownedItems.includes(items)){
                if(devID.hasOwnProperty(devs[files])) devID[devs[files]].push(items)
                else{
                    devID[devs[files]] = [items]
                }
                
            }
        }
    }

    if(cartFile.hasOwnProperty("devID")) cartFile.devID = devID
    else cartFile["devID"] = devID

    //Disable Checkout Button and remove components
    interaction.update({
        components: [
            new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId(`usfsndsdfdo|1|}`)
                    .setLabel('Checking out...')
                    .setEmoji(settings.emotes.loading)
                    .setStyle('SECONDARY')
                    .setDisabled(true)
            )
        ]
    })


    interaction.channel.send({
        embeds: [
            new MessageEmbed()
            .setColor('RED')
            .setAuthor({
                name: 'Fatality Developments',
                iconURL: guild.iconURL()
            })
            .setFooter({
                text: 'Please read this important message while we process your checkout',
                iconURL: guild.iconURL()
            })
            .setTitle('Please note that all purchases made via PayPal MUST be sent using the "Friends and Family" payment option.')
            .setDescription('Sending payment via Friends and Family is a requirement to avoid delays and prevent customers from attempting to chargeback our developers after receiving their products. Chargebacks will result in a permanent ban if attempted.\n\nPlease provide confirmation of payment as it is required prior to the receipt of our products.')
            .setThumbnail(guild.iconURL())
            .setImage('https://cdn.discordapp.com/attachments/1075001898341519360/1083418482659573770/Untitled-1.png')
        ],
        components: [
            new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                .setCustomId('deleteMessage')
                .setLabel('Disregard Message')
                .setEmoji('🔵')
                .setStyle('SECONDARY')
            )
        ]
    })

    setTimeout(() => {
        //Prepare Invoices
        for(let devs in devID){
            let devFile = JSON.parse(fs.readFileSync(`./database/devs/${devs}/dev_details.json`))

            //Prep bank details
            let bankMsg = ``
            if(devFile.payment.paypal) bankMsg += `**Paypal**: [Link](${devFile.payment.paypal})\n`
            if(devFile.payment.bsb) bankMsg += `**BSB**: ${devFile.payment.bsb}\n`
            if(devFile.payment.acc_number) bankMsg += `**Account Number**: ${devFile.payment.acc_number}`

            if(!bankMsg) bankMsg = `Payment details unavailable for <@${devs}>`

            //Prepare Items and prices
            let totalCostPerDev = 0
            let cartMsg = ''
            for(i=0;i<devID[devs].length; i++){
                cartMsg += `${devID[devs][i]}: $${cart[devID[devs][i]].price}\n`
                totalCostPerDev += cart[devID[devs][i]].price
            }

            interaction.channel.send({
                embeds: [
                    new MessageEmbed()
                    .setColor('GREEN')
                    .setTitle(`Invoice from ${devFile.details.tag.split('#')[0]}`)
                    .setDescription(`Please complete the payment of **$${nwc(totalCostPerDev)} AUD** on the Below mentioned payment details`)
                    .addField('Cart Items', cartMsg, true)
                    .addField('Payment Details', bankMsg, true)
                    .setTimestamp()
                    .setThumbnail(guild.iconURL())
                    .setFooter({
                        text: `Once payment is done please press the button below`,
                        iconURL: guild.iconURL()
                    })
                ],
                components: [
                    new Discord.MessageActionRow()
                    .addComponents(
                        new Discord.MessageButton()
                            .setCustomId(`paymentsent|${member.id}|${devs}`)
                            .setLabel('Confirm Payment Done')
                            .setEmoji(settings.emotes.loading)
                            .setStyle('PRIMARY'),
                        new Discord.MessageButton()
                            .setCustomId(`undoTransaction|${member.id}`)
                            .setLabel('Cancel Transaction')
                            .setEmoji(settings.emotes.loading)
                            .setStyle('DANGER')
                    )
                ]
            }).then(m => {
                if(cartFile['invoiceMsg']) cartFile['invoiceMsg'].push(m.id)
                else cartFile['invoiceMsg'] = [m.id]

                fs.writeFileSync(`./database/carts/${member.id}/cart.json`, JSON.stringify(cartFile, null, 4))
            })
        }

    }, 6000)   
}