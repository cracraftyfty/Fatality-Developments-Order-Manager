//Import Modules
const moment = require('moment-timezone')
module.exports = async (client, interaction) => {
    const {guild, member, customId} = interaction;
    let today = moment.tz('Australia/Sydney');
    //if(!interaction.isSelectMenu()) return
    //if(!customId.startsWith('order')) return;
    //if(!interaction.values.includes('order_clothing')) return
    //console.log(interaction.values)
    //console.log(`CUSTOM ID: ${customId}`)
    
}