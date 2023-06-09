//Import Modules
const { MessageEmbed,InteractionType  } = require("discord.js");
const settings = require('../database/settings.json');
const Discord = require('discord.js')
const fs = require('fs')
const unix = require('unix-timestamp')
module.exports = async (client, interaction) => {
    const {guild, member, customId} = interaction;
    if(!interaction.isButton()) return
    if(!customId.startsWith('confirmPayment')) return;

    //return console.log(customId)

    //Extract Values
    let devID = customId.split('|')[1]
    let checkout_channel_id = customId.split('|')[2]
    let customerID = customId.split('|')[4]
    let customer = await guild.members.fetch(customerID)

    let log_channel = await client.channels.cache.get('1106165697576452137')

    //Read files
    let cartFile = JSON.parse(fs.readFileSync(`./database/carts/${customerID}/cart.json`))

    /* if(member.roles.cache.some(role => role.id === '868368413716787291')){

    } */
    if(devID != member.id && !['120307491413295106', "228691082878255104", "344915148487786498"].includes(member.id)) return interaction.reply({
        embeds: [
            new MessageEmbed()
            .setColor('RED')
            .setDescription(`${settings.emotes.wrong} You cannot cancel someone elses order, request failed`)
        ], 
        ephemeral: true
    })

    //Fetch items in cart
    let cartItemsFromMsg = interaction.message.embeds[0].fields[0].value.split("\n")
    
    //Filter to remove last total line
    cartItemsFromMsg.pop()

    //Fetch names form above array
    let cartItems = []
    cartItemsFromMsg.forEach(i => {
        cartItems.push(i.split(":")[0].trim())
    })
    
    let acccessChannels = ''
    //Fetch Files
    let Files = []
    //return console.log(cartItems)
    cartItems.forEach(async item => {    
        /* console.log(`\n------------------------------------`, item)
        console.log(cartFile.cart[item].dir, `\n------------------------------------`) */

        let itemFile = JSON.parse(fs.readFileSync(`./database/${cartFile.cart[item].dir}/settings.json`))
        let tempAccessFile = JSON.parse(fs.readFileSync(`./database/tempAccess.json`))

        if(!tempAccessFile.hasOwnProperty(itemFile.details.channelID)) tempAccessFile[itemFile.details.channelID] = {}
        
        let accessChannel = await client.channels.cache.get(itemFile.details.channelID)
        acccessChannels += `${accessChannel}, `
        console.log(accessChannel.name, itemFile.details.name, itemFile.details.channelID)
        if(!accessChannel.permissionsFor(customer.id).has(['VIEW_CHANNEL'])){
            accessChannel.permissionOverwrites.edit(customer.id, { VIEW_CHANNEL: true })

            log_channel.send({
                embeds: [
                    new MessageEmbed()
                    .setColor(`GREEN`)
                    .setDescription(`[+] Access granted: ${customer} in ${accessChannel}`)
                    .setFooter({
                        text: `Tag: ${customer.user.tag} | ID: ${customer.id}`,
                        iconURL: customer.user.avatarURL()
                    })
                ]
            })

            setTimeout(async () => {
                let tempAccessFile2 = JSON.parse(fs.readFileSync(`./database/tempAccess.json`))

                accessChannel.permissionOverwrites.edit(customer.id, { VIEW_CHANNEL: false })
                
                log_channel.send({
                    embeds: [
                        new MessageEmbed()
                        .setColor(`RED`)
                        .setDescription(`[-] Access revoked: <@${customer.id}> from ${accessChannel}`)
                        .setFooter({
                            text: `Tag: ${customer.user.tag} | ID: ${customer.id}`,
                            iconURL: customer.user.avatarURL()
                        })
                    ]
                })
                
                delete accessFile[itemFile.details.channelID][customer.id]
                fs.writeFileSync(`./database/tempAccess.json`, JSON.stringify(tempAccessFile2, null, 4))

                /* client.channels.cache.get('1106165697576452137').then(c => {
                    c.send({
                        embeds: [
                            new MessageEmbed()
                            .setColor(`RED`)
                            .setDescription(`[-] Access for ${member} removed ${accessChannel}`)
                            .setFooter({
                                text: `Tag: ${member.user.tag} | ID: ${member.id}`,
                                iconURL: member.author.avatarURL()
                            })
                        ]
                    })
                }) */
            }, 86400000)
        }

        tempAccessFile[itemFile.details.channelID][customer.id] = unix.now() + 86400
        fs.writeFileSync(`./database/tempAccess.json`, JSON.stringify(tempAccessFile, null, 4))
    })

    //fetch order channel
    let checkoutChannel = await client.channels.cache.get(checkout_channel_id)
    
    checkoutChannel.send({
        content: `<@${customerID}>`,
        embeds: [
            new MessageEmbed()
            .setColor('GREEN')
            .setDescription(`${settings.emotes.check} Your order has been completed, you have been given access for 24 hours to the files, After 24 hours the access will be revoked. Head on to ${acccessChannels}`)
        ]
    })    
    //Update Interaction

    interaction.update({
        components: [
            new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                .setCustomId('dfsffelfsfseteMessage')
                .setLabel('Order Completed')
                .setEmoji(settings.emotes.check)
                .setStyle('SECONDARY')
                .setDisabled(true)
            )
        ]
    })

}