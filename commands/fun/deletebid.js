const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deletebid')
        .setDescription('Delete a bid entry')
        .addStringOption(option => option.setName('event').setDescription('Select which event to choose').setRequired(true).addChoices(
            { name: '20GH', value: '20gh' },
            { name: 'MGE', value: 'mge' }
        ))
        .addIntegerOption(option => option.setName('rokid').setDescription('ROK ID of the bid entry to delete.').setRequired(true)),
    async execute(interaction) {
        const rokidToDelete = interaction.options.getInteger('rokid');
        const choice = interaction.options.getString('event');

        const filename = `bids${choice}.json`;

        fs.readFile(filename, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return interaction.reply({ content: 'Error reading bids data', ephemeral: true });
            }

            let bids = [];
            if (data) {
                bids = JSON.parse(data);
            }

            // Find the index of the bid entry with the provided rokid
            const bidIndex = bids.findIndex(bid => bid.rokid === rokidToDelete);
            if (bidIndex !== -1) {
                // Remove the bid entry from the array
                bids.splice(bidIndex, 1);

                // Write the updated bids array to the JSON file
                fs.writeFile(filename, JSON.stringify(bids, null, 4), 'utf8', (err) => {
                    if (err) {
                        console.error(err);
                        return interaction.reply({ content: 'Error deleting bid entry', ephemeral: true });
                    }
                    return interaction.reply({ content: `Bid entry with ROK ID ${rokidToDelete} deleted successfully.`, ephemeral: false });
                });
            } else {
                return interaction.reply({ content: 'Bid entry not found.', ephemeral: false });
            }
        });
    },
};
