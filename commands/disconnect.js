const Discord = require('discord.js');

module.exports = {
	name: 'disconnect',
	aliases: ['dc'],
	description: 'Disconnects the bot from the voice channel',
	execute(message, misc,musicUrls) {
		if(!message.member.voice.channel){
			message.channel.send("**Please join a voice channel first**");
		}else if(!misc.botMember){
			message.channel.send("**.**");
		}else{
			misc.dispatcher.end();
			musicUrls.length=0;
			misc.botMember.disconnect();
		}
	}
};