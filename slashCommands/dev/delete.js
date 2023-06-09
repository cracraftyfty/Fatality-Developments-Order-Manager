module.exports = {
  	name: "delete",
  	description: "Delete the current channel",
  	cooldown: 5,
  	memberpermissions: [],
  	requiredroles: [],
  	alloweduserids: [
        "344915148487786498"
    ],
  	options: [ ],
  	run: async (client, interaction) => {
        interaction.channel.delete()
    }
}