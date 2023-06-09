//Import Modules
const { MessageEmbed,InteractionType  } = require("discord.js");
const moment = require('moment-timezone')
const { Modal, TextInputComponent, showModal } = require("discord-modals");
const discordModals = require('discord-modals');
module.exports = async (client, interaction) => {
    const {guild, member, customId} = interaction;
    let today = moment.tz('Australia/Sydney');
    if(!interaction.isButton()) return
    if(!customId.startsWith('paymentsent')) return

    let expectedID = customId.split('|')[1]
    //Check if button presser ID is same as author ID
    if(expectedID != member.id) return interaction.reply({
        embeds: [
            new MessageEmbed()
            .setColor('RED')
            .setDescription(`${settings.emotes.wrong} You cannot confirm someone elses order, request failed`)
        ], 
        ephemeral: true
    })

    let comp = []
    comp.push(
        new TextInputComponent()
        .setCustomId(`transactionid+${member.id}`)
        .setLabel("Transaction ID")
        .setStyle("LONG")
        .setMinLength(1)
        .setMaxLength(150)
        .setPlaceholder("Please enter the transaction ID for the completed payment")
        .setRequired(true)
    )

    discordModals(client);
    const modal = new Modal() // We create a Modal .... CUSTOM ID FORMAT: paymentsent+${CUSTOMER ID}+${DEV ID}+${CHECKOUT MESSAGE ID}+${INTERACTION CHANNEL ID}
    .setCustomId(`paymentsent+${member.id}+${customId.split('|')[2]}+${interaction.message.id}+${interaction.channel.id}`)
    .setTitle("Fatality Developments")
    .addComponents(comp);
    await showModal(modal, {
        client: client,
        interaction: interaction
    }).catch(e => {
        interaction.reply(e.message ? e.message : e);
    })
}