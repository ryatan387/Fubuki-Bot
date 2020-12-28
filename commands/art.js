const Discord = require('discord.js');
const config = require('../config.json');
const PixivApi = require('pixiv-api-client');
const pixiv = new PixivApi();
const axios = require('axios');
const fs= require('fs');
const path= require('path');

let max=0;

pixiv.login(config.username,config.password);

module.exports = {
	name: 'art',
	description: "Posts fanart of Fubbuki from Pixix. Use ' -yourSearchWord' after the command to search for fanart",
	async execute(message, images, query) {
		let searchWord;
		if(message.content.includes("-")){
			searchWord=message.content.split("-")[1];
		}else{
			searchWord="白上フブキ";
		}
		let numResults;
		if(searchWord!=query){
			await pixiv.searchIllustPopularPreview(searchWord).then(json=> {
				numResults=json.illusts.length;
			});
			max =await getMax(numResults,searchWord);
		}
		if(images.length==max||searchWord!=query){
			images.length=0;
		}
		await searchPixiv(searchWord,message, images);
		return searchWord;
	}
};

async function searchPixiv(searchWord, message, images){
	let num;
	let checkRandom=1;
	while(checkRandom==1){
		num=Math.floor(Math.random() * 30);
		checkRandom=0;
		for(i=0; i<images.length;i++){
			if(num==images[i]){
				checkRandom=1;
			}
		}
	}
		await pixiv.searchIllustPopularPreview(searchWord).then(json=> {
			checkR18(json,num,searchWord,message, images);
		});
}
async function checkR18(json,num,searchWord,message, images){
	if(json.illusts[num]==null){
		message.reply("Your search came out empty!");
	}else if(json.illusts[num].tags[0].name=="R-18"){	
		searchPixiv(searchWord,message, images);
	}else{
		gettingImage(json,num,message);
		images.push(num);
	}
}
async function gettingImage(json,num,message){
	let imageExt=json.illusts[num].image_urls.large.split(".").reverse()[0];
	let fileName="untitled";
	const image = await axios({
		method: 'get',
		url: json.illusts[num].image_urls.large,
		headers: {
			referer: "https://www.pixiv.net/en/artworks/"+json.illusts[num].id
		},
		responseType: 'stream'
	});
	if(image.status===200){
		const writer =fs.createWriteStream(path.resolve(__dirname,`../${fileName}.${imageExt}`));
		await fileWriter(writer,image.data);
	}
	let embed=new Discord.MessageEmbed()
		.setColor("#73ffdc")
		.attachFiles("./untitled.jpg")
		.setImage("attachment://untitled.jpg")
		.setDescription("https://www.pixiv.net/en/artworks/"+json.illusts[num].id);
	message.channel.send(embed);
}

function fileWriter (writer, stream){
	return new Promise((resolve,reject)=>{
		stream.pipe(writer);
		let error=null;
		writer.on("error", err=>{
			error=err;
			writer.close();
			reject(err);
		});
		writer.on("close",()=>{
			if(!error){
				resolve(true);
			}
		});
	});
}
async function getMax(numResults,searchWord){
	max=0;
	for(let i=0;i<numResults;i++){
		pixiv.searchIllustPopularPreview(searchWord).then(json=> {
			if(json.illusts[i].tags[0].name!="R-18"){
				max++;
			}
		});
	}
	return max;
}