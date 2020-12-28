const Discord = require('discord.js');
const config = require('../config.json');
const search= require('youtube-search');
const request= require('request');
const ytdl= require('ytdl-core');

module.exports = {
	name: 'search',
	description: "Search YouTube for a song to play Use ' -yourSearchWord' after the command if you have a specific search",
	async execute(message) {
		if(message.content.includes("-")){
			let query=message.content.split("-");
			let results= await search(query[1],{maxResults: 10,key: config.YOUTUBE_API,type: "video"});
			if(results){
				let youtubeResults=results.results;
				let selected=youtubeResults[0];
				let embed=new Discord.MessageEmbed()
					.setColor("#73ffdc") 
					.setTitle(`${selected.title}`)
					.setURL(`${selected.link}`)
					.setDescription(`${selected.description}`)
					.setThumbnail(`${selected.thumbnails.default.url}`);
				message.channel.send("React with 🌽 to play the video. (This message will be deleted in 10 seconds.)").then(msg => {msg.delete({ timeout: 10000 })})
  					.catch(console.error);
				message.channel.send(embed);
				let title=selected.title;
				let link =selected.link;
				let id=message.author.id
				return{
					songName: title,
					songURL: link,
					userID: id
				};
			}
		}else{
			let embed= new Discord.MessageEmbed()
				.setColor("#73ffdc") 
				.setTitle("Fubuki Search")
				.setDescription("What would you like to search?");
			let embedMsg= await message.channel.send(embed);
			let filter= m => m.author.id===message.author.id;
			let query= await message.channel.awaitMessages(filter,{max:1});
			let results= await search(query.first().content, {maxResults: 10,key: config.YOUTUBE_API,type: "video"});
			if(results){
				let youtubeResults=results.results;
				let i=0;
				let titles= youtubeResults.map(result =>{
					i++;
					return i+") "+ result.title;
				});
				console.log(titles);
				message.channel.send({
					embed:{
						title: "Select a video to play",
						description: titles.join("\n"),
						color: "#73ffdc"
					}
				});
				filter= m=> (m.author.id === message.author.id)&& m.content>=1 && m.content <=youtubeResults.length;
				let collected= await message.channel.awaitMessages(filter,{max:1});
				//make sure to check user enters int
				let selected= youtubeResults[collected.first().content -1];
				embed=new Discord.MessageEmbed()
					.setColor("#73ffdc") 
					.setTitle(`${selected.title}`)
					.setURL(`${selected.link}`)
					.setDescription(`${selected.description}`)
					.setThumbnail(`${selected.thumbnails.default.url}`);
				songInfo={
					title: `${selected.title}`,
					url: `${selected.link}`
				};
				txt=`${selected.title}`;
				message.channel.send("React with 🌽 to play the video. (This message will be deleted in 10 seconds.)").then(msg => {msg.delete({ timeout: 10000 })})
  					.catch(console.error);
				message.channel.send(embed);
				let title=selected.title;
				let link =selected.link;
				let id=message.author.id
				return{
					songName: title,
					songURL: link,
					userID: id
				};
			}
		}
	}
};