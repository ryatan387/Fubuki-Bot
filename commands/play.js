const Discord = require('discord.js');

module.exports = {
	name: 'play',
	aliases: ['resume'],
	description: 'Resumes playing a song',
	execute(message, misc,musicUrls) {
		if(musicUrls===undefined||musicUrls.length==0){
			message.channel.send("**There are no songs to play.**");
		}else if(!message.member.voice.channel){
			message.channel.send("**Please join a voice channel first**");
		}else{
			misc.dispatcher.resume();
		}
	}
};