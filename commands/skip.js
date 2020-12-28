const Discord = require('discord.js');
const ytdl= require('ytdl-core');

module.exports = {
	name: 'skip',
	aliases: ['next'],
	description: 'Plays the next song in the queue',
	execute(message, misc,musicUrls) {
		if(musicUrls===undefined||musicUrls.length==0){
			message.channel.send("**There are no songs to skip.**");
		}else if(!message.member.voice.channel){
			message.channel.send("**Please join a voice channel first**");
		}else if(musicUrls.length==1){
			misc.dispatcher.pause(true);
			misc.dispatcher.end();
			musicUrls.shift();
		}else{
			misc.dispatcher.pause(true);
			misc.dispatcher.end();
			musicUrls.shift();
			playSong(misc.botMember,misc,musicUrls);
		}
	}
};

async function playSong(voiceConnection,misc,musicUrls){
	misc.dispatcher= voiceConnection.play(ytdl(musicUrls[0].url));
	misc.botMember=voiceConnection;
	misc.dispatcher.on("finish", () => {
		if(misc.loop==false){
			musicUrls.shift();
		}
     	if(musicUrls.length!=0){
     	 	playSong(voiceConnection);
     	}
     });
}