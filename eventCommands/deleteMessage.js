//Import Modules
const moment = require('moment-timezone')
module.exports = async (client, interaction) => {
    const {guild, member, customId} = interaction;
    let today = moment.tz('Australia/Sydney');
    if(!interaction.isButton()) return

    if(!['deleteMessage'].includes(customId)) return; 
    interaction.message.delete()
}