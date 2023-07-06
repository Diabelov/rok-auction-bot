const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bid')
        .setDescription('Place your bid')
        .addStringOption(option => option.setName('event').setDescription('Select which event to choose').setRequired(true).addChoices(
            {name: '20GH', value: '20gh'},
            {name: 'MGE', value: 'mge'}
        ))
        .addIntegerOption(option => option.setName('rokid').setDescription('Your ROK ID.').setRequired(true))
        .addNumberOption(option => option.setName('bidamount2').setDescription('Amount of your bid.').setRequired(true)),
    async execute(interaction) {
        const rokid = interaction.options.getInteger('rokid');
        const bidamount2 = interaction.options.getNumber('bidamount2');
        const choice = interaction.options.getString('event');

        if (bidamount2 < 0.1) {
            return interaction.reply({content: 'Bid amount must be at least 0.1', ephemeral: true});
        }

        fs.readFile('animal_names.txt', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return interaction.reply({content: 'Error reading animal names data', ephemeral: true});
            }

            const animalNames = data.split('\n').map(name => name.trim()).filter(Boolean);

            const randomIndex = Math.floor(Math.random() * animalNames.length);
            let randomAnimal = animalNames[randomIndex];

            const filename = `bids${choice}.json`;

            fs.readFile(filename, 'utf8', (err, data) => {
                if (err) {
                    console.error(err);
                    return interaction.reply({content: 'Error reading bids data', ephemeral: true});
                }

                let bids = [];
                if (data) {
                    bids = JSON.parse(data);
                }

                // Check if the bid amount is equal to any existing bid
                const existingBid = bids.find(bid => bid.bidamount === bidamount2);
                if (existingBid) {
                    return interaction.reply({content: 'Your bid cannot be equal to an existing bid', ephemeral: true});
                }

                // Check if the randomAnimal is already used in bids
                let animalCount = 1;
                while (bids.some(bid => bid.nick === randomAnimal)) {
                    randomAnimal = `${randomAnimal}-${animalCount}`;
                    animalCount++;
                }

                const existingBidder = bids.find(bidder => bidder.rokid === rokid);
                if (existingBidder) {
                    existingBidder.nick = randomAnimal;
                    existingBidder.bidamount = bidamount2;
                } else {
                    bids.push({nick: randomAnimal, rokid: rokid, bidamount: bidamount2});
                }

                bids.sort((a, b) => b.bidamount - a.bidamount);

                fs.writeFile(filename, JSON.stringify(bids, null, 4), 'utf8', (err) => {
                    if (err) {
                        console.error(err);
                        return interaction.reply({content: 'Error saving bid data', ephemeral: true});
                    }
                    console.log('Bids saved successfully');
                });

                return interaction.reply({
                    content: `\`${rokid}\` has successfully bid \`${bidamount2}\`, your hidden nick is \`${randomAnimal}\` for the \`${choice.toUpperCase()}\` event`,
                    ephemeral: true
                });
            });
        });
    },
};