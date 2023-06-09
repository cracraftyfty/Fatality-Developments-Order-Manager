//Import Modules
const { MessageEmbed } = require("discord.js");
const fs = require('fs')
const unix = require("unix-timestamp");
module.exports = async (client) => {
    const allevents = [];
    const event_files = fs.readdirSync(`./eventCommands/`).filter((file) => file.endsWith(".js"));
    for (const file of event_files) {
        try {
            const event = require(`../../eventCommands/${file}`)
            let eventName = file.split(".")[0];
            allevents.push(eventName);
            client.on('interactionCreate', event.bind(null, client));
        } catch (e) {
            console.log(e)
        }
    }


    //Restart timers if any
    let accessFile = JSON.parse(fs.readFileSync(`./database/tempAccess.json`))
    for(let channels in accessFile){
        
        for(let users in accessFile[channels]){
            //console.log(channels, users)
            //console.log(accessFile[channels][users], unix.now(), accessFile[channels][users] > unix.now())
            if(accessFile[channels][users] > unix.now()){
                let timeLeft = accessFile[channels][users] - unix.now()
                setTimeout(async () => {
                    let guild = await client.guilds.cache.get('868366789476745257')
                    let customer =  await guild.members.fetch(users)
                    let accessChannel = await client.channels.cache.get(channels)
                    await accessChannel.permissionOverwrites.edit(customer, { VIEW_CHANNEL: false })

                    delete accessFile[channels][users]
                    fs.writeFileSync(`./database/tempAccess.json`, JSON.stringify(accessFile, null, 4))
                    client.channels.cache.get('1106165697576452137').then(c => {
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
                    })
                }, 3000)
            }else{
                let guild = await client.guilds.cache.get('868366789476745257')
                let customer =  await guild.members.fetch(users)
                let accessChannel = await client.channels.cache.get(channels)
                await accessChannel.permissionOverwrites.edit(customer, { VIEW_CHANNEL: false })

                delete accessFile[channels][users]
                fs.writeFileSync(`./database/tempAccess.json`, JSON.stringify(accessFile, null, 4))
                client.channels.cache.get('1106165697576452137').then(c => {
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
                })
            }
        }
    }
    
}