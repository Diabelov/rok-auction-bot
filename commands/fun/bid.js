const { SlashCommandBuilder } = require('discord.js');
const { writeFile } = require('node:fs')
const { Buffer } = require('node:buffer')
const  fs  = require('fs')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bid')
        .setDescription('Place your bid')
        .addStringOption(option => option.setName('nick').setDescription('Your ROK nick.').setRequired(true))
        .addIntegerOption(option => option.setName('rokid').setDescription('Your ROK ID.').setRequired(true))
        .addNumberOption(option => option.setName('bidamount2').setDescription('Amount of your bid.').setRequired(true)),
        //.addOption(option => option.setName('bidamount').setDescription('Amount of your bid.').setRequired(true)),
    async execute(interaction) {
        const nick = interaction.options.getString('nick')
        const rokid = interaction.options.getInteger('rokid')
        const bidamount2 = interaction.options.getNumber('bidamount2')

        const bidData = {
            nick: nick,
            rokid: rokid,
            bidamount: bidamount2
        };

        fs.readFile('bids.json', 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            }

            let bids = [];

            if (data) {
                bids = JSON.parse(data);
            }

            bids.push(bidData);

            fs.writeFile('bids.json', JSON.stringify(bids, null, 4), 'utf8', (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log('Bids saved successfully');
            });
        });


        return interaction.reply({ content: ` \`${nick}\`, \`${rokid}\` has succesfully bidded \`${bidamount2}\``, ephemeral: false })




    },
};