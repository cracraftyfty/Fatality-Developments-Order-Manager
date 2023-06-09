//Import Modules
const { MessageEmbed,InteractionType  } = require("discord.js");
const fs = require('fs')
const moment = require('moment-timezone')
module.exports = async (client, interaction) => {
    const {guild, member, customId} = interaction;
    let today = moment.tz('Australia/Sydney');
    if(!interaction.isButton()) return
    if(!customId.startsWith('undoTransaction')) return

    let expectedID = customId.split('|')[1]
    
    //Read Files
    let settings = JSON.parse(fs.readFileSync(`./database/settings.json`))
    let cartFile = JSON.parse(fs.readFileSync(`./database/carts/${expectedID}/cart.json`))
    let devs = fs.readdirSync(`./database/devs/`)

    //Check if button presser ID is same as author ID
    if(expectedID != member.id) return interaction.reply({
        embeds: [
            new MessageEmbed()
            .setColor('RED')
            .setDescription(`${settings.emotes.wrong} You cannot cancel someone elses order, request failed`)
        ], 
        ephemeral: true
    })

    //Delete Messages
    for(i=0; i<cartFile.invoiceMsg.length ; i++){
        //Fetch Message
        interaction.channel.messages.fetch(cartFile.invoiceMsg[i]).then(m => m.delete())
    }

    //Update Cart File
    cartFile.invoiceMsg = []
    fs.writeFileSync(`./database/carts/${expectedID}/cart.json`, JSON.stringify(cartFile, null, 4))

    interaction.reply({
        embeds: [
            new MessageEmbed()
            .setColor('GREEN')
            .setDescription(`${settings.emotes.check} Transaction successfully terminated, please proceed to remove any items from the cart if need be`)
        ],
        ephemeral: true
    })
}