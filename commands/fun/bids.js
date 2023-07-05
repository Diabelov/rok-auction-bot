const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bids')
        .setDescription('See bids leaderboard'),
    async execute(interaction) {
        fs.readFile('bids.json', 'utf8', (err, data) => {
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

            // Extract the top 3 highest bidders
            const topBidders = bids.slice(0, 3);

            let replyMessage = 'Current highest bids:\n';

            for (let i = 0; i < topBidders.length; i++) {
                const { nick, rokid, bidamount } = topBidders[i];
                replyMessage += `${i + 1}. ${nick} (ROK ID: ${rokid}) - ${bidamount}\n`;
            }

            return interaction.reply({
                content: replyMessage,
                ephemeral: false
            });
        });
    },
};
