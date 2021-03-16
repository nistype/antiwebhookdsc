const {Client} = require('discord.js'),
    client = new Client;

client.login('TOKEN');

client.on('ready', async () => {
    console.log(`${client.user.tag} connected`)
})

client.on('webhookUpdate', async (channel) => {
    channel.guild.fetchAuditLogs({limit: 1, type: "WEBHOOK_CREATE"}).then(data => {
        const value = data.entries.first();
        if (value && value.executor) {
            const member = channel.guild.members.cache.get(value.executor.id);
            if (member)
                member.kick().catch(reason => console.error(reason.message)).then(() => console.log(`${member.user.tag} à été kick parce qu'il a créé un webhook !`));
        }
    }).catch(err => console.error(err.message))
    channel.fetchWebhooks().then(webs => webs.each(w => w.delete().catch(reason => console.error(reason.message)).then(() => console.log('Webhook supprimé avec succès !')))).catch(error => console.error(error.message))
})


client.on('message', (message) => {
    if (message.mentions.everyone && (message.channel.type === "text" || message.channel.type === "admins") ) {
        const chanPosition = message.channel.position;
        message.channel.delete().then(() => {
            message.channel.clone().then(value => {
                value.setPosition(chanPosition).then(() => {
                    if (message.member)
                        message.member.kick().catch(reason => console.error(reason.message)).then(() => {
                            console.log(`${message.member.user.tag} à été kick parce qu'il a ping avec un webhook !`)
                        }).catch(err => console.error(err))
                }).catch(err => console.error(err))
            }).catch(err => console.error(err))
        }).catch(err => console.error(err))
    }
})