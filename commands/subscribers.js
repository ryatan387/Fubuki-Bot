const Discord = require('discord.js');
const config = require('../config.json');
const search= require('youtube-search');
const request= require('request');

module.exports = {
	name: 'subscribers',
	aliases: ['subs','channel'],
	description: "Displays Fubuki's subscriber count. Use ' -yourSearchWord' after the command to display the subscriber count of a specific YouTuber",
	async execute(message, misc,musicUrls) {
		if(message.content.includes("-")){
			let query=message.content.split("-");
			let results= await search(query[1], {maxResults: 1,key: config.YOUTUBE_API,type: "channel"});
			if(results.pageInfo.totalResults!=0){
				let stats=results.results[0];
				let id=stats.id;
				let url="https://www.googleapis.com/youtube/v3/channels?part=statistics&id="+ id + "&key=" + config.YOUTUBE_API;
				request({
    				method: 'GET',
    				url: url
				}, function (err, response, text) {
    				if (err) {
        				return;
   					}
    				let json = JSON.parse(text);
   			 		let embed=new Discord.MessageEmbed()
						.setColor("#73ffdc") 
						.setTitle(`${stats.title}`)
						.setURL(`${stats.link}`)
						.setDescription(`${stats.description}`)
						.setThumbnail(`${stats.thumbnails.default.url}`);
					message.channel.send(json.items[0].statistics.subscriberCount+" subscribers!");
					message.channel.send(embed);
				});
			}else{
				message.reply("Your search came out empty!");
			}
		}else{
			let results= await search("fubuki ch", {maxResults: 1,key: config.YOUTUBE_API,type: "channel"});;
			let stats=results.results[0];
			let id=stats.id;
			let url="https://www.googleapis.com/youtube/v3/channels?part=statistics&id="+ id + "&key=" + config.YOUTUBE_API;
			request({
    			method: 'GET',
    			url: url
			}, function (err, response, text) {
    			if (err) {
        			return;
   				}
    			let json = JSON.parse(text);
   			 	let embed=new Discord.MessageEmbed()
					.setColor("#73ffdc") 
					.setTitle(`${stats.title}`)
					.setURL(`${stats.link}`)
					.setDescription(`${stats.description}`)
					.setThumbnail(`${stats.thumbnails.default.url}`);
				message.channel.send(json.items[0].statistics.subscriberCount+" subscribers!");
				message.channel.send(embed);
			});
		}
	}
};