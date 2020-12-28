const Discord = require('discord.js');

module.exports = {
	name: 'loop',
	description: 'Toggles song looping on/off',
	execute(message, misc,musicUrls) {
		if(!message.member.voice.channel){
			message.channel.send("**Please join a voice channel first**");
		}else if(musicUrls.length==0){
			message.channel.send("**There is nothing to loop**");
		}else{
			if(misc.loop==false){
				misc.loop=true;
				message.channel.send("**Looping is on**");
			}else{
				misc.loop=false;
				message.channel.send("**Looping is off**");
			}
		}
	}
};