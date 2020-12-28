const Discord = require('discord.js');

module.exports = {
	name: 'queue',
	description: 'Displays what songs are currently in the queue',
	execute(message, misc,musicUrls) {
		if(!message.member.voice.channel){
			message.channel.send("**Please join a voice channel first**");
		}else if(musicUrls.length==0){
			message.channel.send("**There is nothing in the queue**");
		}else{
			let titles=[];
			for(let i=0; i<musicUrls.length; i++){
				titles.push((i+1)+") "+musicUrls[i].title);
			}
			let embed=new Discord.MessageEmbed()
				.setColor("#73ffdc") 
				.setTitle("Queue")
				.setDescription(titles.join("\n"));
			message.channel.send(embed);
		}				
	}
};