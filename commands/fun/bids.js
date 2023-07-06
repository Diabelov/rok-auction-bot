const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bids')
        .setDescription('See bids leaderboard')
        .addStringOption(option => option.setName('event').setDescription('Select which event to choose').setRequired(true).addChoices(
            {name: '20GH', value: '20gh'},
            {name: 'MGE', value: 'mge'}
        )),
    async execute(interaction) {
        const choice = interaction.options.getString('event')
        const filename = `bids${choice}.json`

        fs.readFile(filename, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return interaction.reply({ content: 'Error reading bids data', ephemeral: true });
            }

            let bids = [];
            if (data) {
                bids = JSON.parse(data);
            }

            // Sort the bids by bidamount in descending order
            bids.sort((a, b) => b.bidamount - a.bidamount);

            let replyMessage = 'Current highest bids:\n';

            for (let i = 0; i < bids.length; i++) {
                const { nick, bidamount } = bids[i];
                replyMessage += `${i + 1}. ${nick} - ${bidamount}\n`;
            }

            return interaction.reply({
                content: replyMessage,
                ephemeral: false
            });
        });
    },
};
