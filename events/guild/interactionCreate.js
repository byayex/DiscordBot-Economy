const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const { Captcha } = require('../../managers/captchaGenerator');
const Members = require('../../schemas/members')
require('dotenv').config();

module.exports = async (Discord, client, interaction) =>
{
    const userData = await Members.findOne({memberID: interaction.member.id}) || await Members.create({
        memberID: interaction.member.id,
        balance: 0,
        exp: 1,
        inServer: true,
        cooldowns: {
            baltop: new Date('2000-01-01T00:00:00'),
            lastMessage: new Date('2000-01-01T00:00:00'),
            rob: new Date('2000-01-01T00:00:00'),
            gotRobbed: new Date('2000-01-01T00:00:00'),
            lastCollect: new Date('2000-01-01T00:00:00')
        },
        inventory: {
            kiosk: 0,
            gasStation: 0,
            supermarket: 0,
            jeweler: 0,
            realEstate: 0
        }
    })

    userData.inServer = true
    userData.save()

    if(interaction.isCommand())
    {
        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        try
        {
        await command.execute(interaction, client)
        } catch (err)
        {
            console.error(err);

            var error_embed = new EmbedBuilder()
            .setColor('#C20000')
            .setTitle('🤖 - Bot Error')
            .setDescription('Please contact staff!')
            .setTimestamp()
            interaction.reply({embeds: [error_embed], ephemeral: true});
        }
    }
    if(interaction.isButton())
    {
        switch(interaction.customId)
        {
            case "verify":
                {
                    const verifyRole = interaction.guild.roles.cache.find(role => role.id === client.config.verifyid);

                    if(interaction.member.roles.cache.some(role => role.id === client.config.verifyid))
                    {
                        let already_verified = new EmbedBuilder()
                        .setColor('Red')
                        .setTitle("You are already verified!")
                        .setDescription("There is no need to stay in this channel.\nWhy dont you look around?")
                        .setTimestamp()
                        interaction.reply({embeds: [already_verified], ephemeral: true})
                    }else
                    {
                        let difference = Date.now() - interaction.member.user.createdTimestamp;

                        if(difference < (72 * 60 * 60 * 1000))
                        {
                            let account_to_young = new EmbedBuilder()
                            .setColor('Red')
                            .setTitle('Your Account is too young.')
                            .setDescription('Come back in some days.')
                            .setTimestamp()
                            return interaction.reply({embeds:[account_to_young], ephemeral: true})
                        }

                        if(!client.verifyprocess.has(interaction.member.id))
                        {
                            client.verifyprocess.set(interaction.member.id)
                        }else
                        {
                            let already_in_process = new EmbedBuilder()
                            .setTimestamp()
                            .setTitle('You started the process already or have to wait.')
                            .setColor('Blue')
                            .setDescription("Please check your DM's!")
                            return interaction.reply({embeds: [already_in_process], ephemeral: true})
                        }

                        let dm = new EmbedBuilder()
                        .setTitle('Welcome in the verification process!')
                        .setDescription('Please type the characters you see.\nYou dont have to be case sensitive.\n**You have 1 minute to complete the captcha**')
                        .setColor('Blue')
                        .setTimestamp()
                        let under_image = new EmbedBuilder()
                        .setTitle('Having difficultys reading the text?')
                        .setDescription('Click on the image to see it better!')
                        .setColor('DarkGold')
                        .setTimestamp()

                        interaction.member.send({embeds: [dm]}).then(async message =>
                            {
                                let started_now = new EmbedBuilder()
                                    .setTimestamp()
                                    .setTitle('You started the process successfully.')
                                    .setColor('Blue')
                                    .setDescription("**Please check your DM's**")

                                interaction.reply({embeds: [started_now], ephemeral: true})
                                let captcha = new Captcha(6);
                                let image = await captcha.image(captcha.currentString);

                                let attachment = new AttachmentBuilder(image);
                                await interaction.member.send({files: [attachment]})
                                interaction.member.send({embeds: [under_image]})

                                let filter = m => m.author.bot != true;
                                let collector = interaction.user.dmChannel.createMessageCollector({filter, max: 1, time: 60000, errors: ['time']})
                                collector.on('collect', response => {
                                    if(response.content.toUpperCase() == captcha.currentString.toUpperCase())
                                    {
                                        let right_code = new EmbedBuilder()
                                        .setColor('Blue')
                                        .setTitle("That was correct!")
                                        .setDescription("You are now verified.\n**You can go back to the server now.**")
                                        .setTimestamp()
                                        interaction.member.roles.add(verifyRole, "Verified himself!")
                                        interaction.member.send({embeds: [right_code]})
                                    }else
                                    {
                                        let wrong_code = new EmbedBuilder()
                                        .setColor('Blue')
                                        .setTitle("That was wrong!")
                                        .setDescription("This was the wrong code.\nTry it in 1 minute again!\nYou have to click the 'Verify' Button again.")
                                        .setTimestamp()

                                        interaction.member.send({embeds: [wrong_code]})
                                        setTimeout(() => {client.verifyprocess.delete(interaction.member.id)},1*60*1000)
                                    }
                                })
                                collector.on('end', collected => {
                                    if(collected.size != 1)
                                    {
                                        let too_long = new EmbedBuilder()
                                        .setColor('Blue')
                                        .setTitle("You took to long to verify")
                                        .setDescription("You took to long to verify.\nTry it in 1 minute again!\nYou have to click the 'Verify' Button again.")
                                        .setTimestamp()

                                        interaction.member.send({embeds: [too_long]})
                                        setTimeout(() => {client.verifyprocess.delete(interaction.member.id)},1*60*1000)
                                    }
                                })                                       
                            }).catch(err => {
                                let enable_dm = new EmbedBuilder()
                                        .setColor('Blue')
                                        .setTitle("Please enable your direct messages!")
                                        .setTimestamp()
                                interaction.reply({embeds: [enable_dm], ephemeral: true})
                                client.verifyprocess.delete(interaction.member.id)
                            })
                    }
                    break;
                }
        }
    }
}
