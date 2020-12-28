const Discord = require('discord.js');

module.exports = {
	name: 'pause',
	aliases: ['stop'],
	description: 'Pauses the currently playing song',
	execute(message, misc,musicUrls) {
		if(musicUrls===undefined||musicUrls.length==0){
			message.channel.send("**There are no songs to pause.**");
		}else if(!message.member.voice.channel){
			message.channel.send("**Please join a voice channel first**");
		}else{
			misc.dispatcher.pause(true);
		}
	}
};