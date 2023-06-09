//Import Modules
const { MessageEmbed,InteractionType  } = require("discord.js");
const ee = require(`../botconfig/embed.json`);
const cap = require('../functions/cap.js');
const Discord = require('discord.js')
const fs = require('fs')
const moment = require('moment-timezone')
module.exports = async (client, interaction) => {
    const {guild, member, customId} = interaction;
    let today = moment.tz('Australia/Sydney');
    if(!interaction.isSelectMenu()) return
    
    let settings = JSON.parse(fs.readFileSync(`./database/settings.json`))

    let comps = []
    interaction.values.forEach(async v => {
        console.log(v)
        if(!v.startsWith('pre-order_accessories-view_premade_') &&  !v.startsWith(('pre-order_packages-view_premade')) && !v.startsWith('order_accessories-view_custom_')) return 
        //return console.log(v, `${v.split('-')[2].split('_')[1]}_${v.split('_')[3]}`)
        let dir = fs.readdirSync(`./database/${v.split('-')[2].split('_')[1]}/${v.split('-')[0]}-${v.split('-')[1]}/${v.split('-')[2].split('_')[1]}_${v.split('_')[3]}`)
        
        
        let options = []
        dir.forEach(d => {
            let productSettings = JSON.parse(fs.readFileSync(`./database/${v.split('-')[2].split('_')[1]}/${v.split('-')[0]}-${v.split('-')[1]}/${v.split('-')[2].split('_')[1]}_${v.split('_')[3]}/${d}/settings.json`))
            options.push({
                "label": productSettings.details.name,
                "description": productSettings.details.description,
                "value": `orderProcess|${v.split('-')[2].split('_')[1]}|${v.split('-')[0]}-${v.split('-')[1]}|${v.split('-')[2].split('_')[1]}_${v.split('_')[3]}/${d}`
            })
            
            //console.log(`orderProcess|${v.split('-')[2].split('_')[1]}|${v.split('-')[0]}-${v.split('-')[1]}|${v.split('-')[2].split('_')[1]}_${v.split('_')[3]}/${d}`)
        })

        if (options.length <= 0) return interaction.reply({
            embeds: [
                new MessageEmbed()
                .setColor('RED')
                .setDescription(`${settings.emotes.wrong} Nothing to show in this category for the time being`)
            ],
            ephemeral: true
        })

        //return console.l
        comps.push(
            new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageSelectMenu()
                .setCustomId(`viewProduct-${v.split('-')[2].split('_')[1]}-${v.split('-')[2].split('_')[1]}_${v.split('_')[3]}`)
                .setPlaceholder(`${cap(v.split('_')[3])}`)
                .setMinValues(1)
                .setMaxValues(options.length)
                .addOptions(options)
            )
        )
        
    })
    

    //return  console.log(comps)
    if(comps.length > 0){
        interaction.reply({
            embeds: [
                new MessageEmbed()
                .setColor('GREEN')
                .setDescription(`PLACEHOLDER_DETAILS`)
                .setTitle(`Fatality Developments | Order`)
                .setTimestamp()
                .setThumbnail(guild.iconURL())
                .setFooter({
                    text: ee.footertext,
                    iconURL: ee.footericon
                })
            ],
            components: comps,
            ephemeral: true
        })
    }else{
        
        console.log(`[2_viewProduct.js] Comps is Empty: L59`)
    }
}
