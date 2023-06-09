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

    //Read Files
    let settings = JSON.parse(fs.readFileSync(`./database/settings.json`))
    let count = 0
    interaction.values.forEach(category => {
        count++
        
        let NAME = `${category.split('_')[1]}-${settings.ordercount}`
        let parentCategory = client.channels.cache.get(settings.categories[category])

        if(["pre-order_accessories", "pre-order_packages"].includes(category)){
            //PreOrders
            //Create channels
            let options = []
            console.log(`Category: ${category}`)
            let dir = fs.readdirSync(`./database/premade/${category}`)
            dir.forEach(d => {
                console.log(d)
                options.push(
                    {
                        "label": `${cap(d.split('_')[1])}`,
                        "description": `View premade ${d.split('_')[1]}!`,
                        "value": `${category}-view_${d}`
                    }
                )
            })  

            console.log(options)

            if(options.length <= 0) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setColor('RED')
                    .setDescription(`${settings.emotes.wrong} Nothing to show in this category`)
                ],
                ephemeral: true
            })

            guild.channels.create(`${NAME}`, {
                type: 'text',
                parent: parentCategory,
                permissionOverwrites: [
                    {
                        id: guild.id,
                        deny: ["VIEW_CHANNEL"]
                    },
                    {
                        id: member.id,
                        allow: ["VIEW_CHANNEL"]
                    },
                    {
                        id: settings.job_roles[category],
                        allow: ["VIEW_CHANNEL"]
                    }
                ],
            }).then(async c => {
               
                c.send({
                    content: `<@344915148487786498>`,
                    embeds: [
                        new MessageEmbed()
                        .setColor('GREEN')
                        .setDescription(`Premade category ticket created, Please select the items from the dropdown menu below to choose what you would like to purchase`)
                        .setTitle(`Fatality Developments | ${cap(category.split('_')[0])} ${cap(category.split('_')[1])}`)
                        .setTimestamp()
                        .setThumbnail(guild.iconURL())
                        .setFooter({
                            text: ee.footertext,
                            iconURL: ee.footericon
                        })
                    ],
                    components: [
                        new Discord.MessageActionRow()
                        .addComponents(
                            new Discord.MessageSelectMenu()
                            .setCustomId('order-premade')
                            .setPlaceholder('Select the desired option to purchase')
					        .setMinValues(1)
					        .setMaxValues(settings.orders.premadeOptions[category].length)
                            .addOptions(options)
                        )
                    ]
                })

                settings.ordercount++
                fs.writeFileSync(`./database/settings.json`, JSON.stringify(settings, null, 4))

                /* setTimeout(() => {
                    c.delete()
                }, 10000) */
            })
            return
        }else{
            return
            //Category for other tings
            //Create channels
            guild.channels.create(`${NAME}`, {
                type: 'text',
                parent: parentCategory,
                permissionOverwrites: [
                    {
                        id: guild.id,
                        deny: ["VIEW_CHANNEL"]
                    },
                    {
                        id: member.id,
                        allow: ["VIEW_CHANNEL"]
                    },
                    {
                        id: settings.job_roles[category],
                        allow: ["VIEW_CHANNEL"]
                    }
                ],
            }).then(async c => {
                c.send({
                    content: `<@344915148487786498> ${member}`
                })
                setTimeout(() => {
                    c.delete()
                }, 10000)
            })
            return
        }
    })

    
}