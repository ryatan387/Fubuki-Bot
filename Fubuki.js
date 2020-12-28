const Discord = require('discord.js');
const config = require('./config.json');
const fs= require('fs');
const client = new Discord.Client();
client.commands =new Discord.Collection();
const commandFiles= fs.readdirSync('./commands').filter(file =>file.endsWith('.js'));
const ytdl= require('ytdl-core');

let query="x";
let images=[];
let musicUrls=[];
let songName, songURL, userID, songInfo;
let misc={
	dispatcher: 'x',
	botMember: 'x',
	loop: false
};

for(const file of commandFiles){
	const command = require(`./commands/${file}`);
	client.commands.set(command.name,command);
}

client.once('ready', () => {
	console.log('Ready!');
});
client.login(config.token);

client.on('message', async message=>{
	let checker=1;
	if(message.author.bot&&message.embeds){
		const embedMsg =message.embeds.find(msg =>msg.title===songName);
		if(embedMsg){
			message.react('🌽')
			.then((reaction => {  reaction.message.delete({ timeout: 10000 })}))
			.catch(err=> console.error);
		}
	}
	if (message.content.toLowerCase().startsWith(`${config.prefix}`)||message.content.toLowerCase().startsWith(`${config.prefix2}`)){
		const lowerCase= message.content.toLowerCase();
		if(lowerCase.includes("wife")||lowerCase.includes("waifu")||lowerCase.includes("girlfriend")){
			message.channel.send("No! Friends!");
		}else if(lowerCase.includes("marry")){
			message.channel.send("No! Friends only!");
		}else if(lowerCase.includes("friends")||lowerCase.includes("friend")){
			message.channel.send("Yes! Best friends!!!");
		}else if(lowerCase.includes("glasses")){
			message.channel.send("Glasses are really versatile. First, you can have glasses-wearing girls take them off and suddenly become beautiful, or have girls wearing glasses flashing those cute grins, or have girls stealing the protagonist's glasses and putting them on like, 'Haha, got your glasses!' That's just way too cute! Also, boys with glasses! I really like when their glasses have that suspicious looking gleam, and it's amazing how it can look really cool or just be a joke. I really like how it can fulfill all those abstract needs. Being able to switch up the styles and colors of glasses based on your mood is a lot of fun too! It's actually so much fun! You have those half rim glasses, or the thick frame glasses, everything! It's like you're enjoying all these kinds of glasses at a buffet. I really want Luna to try some on or Marine to try some on to replace her eyepatch. We really need glasses to become a thing in hololive and start selling them for HoloComi. Don't. You. Think. We. Really. Need. To. Officially. Give. Everyone. Glasses?");
		}else if(lowerCase.includes("scatman")){
			message.channel.send("beat up a pineapple");
		}else if(lowerCase.includes("cat")){
			message.channel.send("No!!! I am fox!!");
		}else if(lowerCase.includes("faq")){
			message.channel.send("fack");
		}else if(lowerCase.includes("good morning")){
			message.channel.send("GOOD MORNING MADAFAKA!!!");
		}else if(lowerCase.includes("help")||lowerCase.includes("commands")){
			let data=[];
			data.push(client.commands.map(command=>{
				if(command.aliases!=undefined){
					return "**"+command.name+"**"+" ("+command.aliases+"): "+command.description;
				}else{
					return "**"+command.name+"**"+": "+command.description;
				}
			}).join("\n"));
			let embed=new Discord.MessageEmbed()
			.setColor("#73ffdc")
			.setTitle("Commands(use fbk/fubuki to call bot)")
			.setDescription(data);
			message.channel.send(embed);
		}else{
			checker=0;
		}
		const args=lowerCase.split(" ");
		if(!client.commands.has(args[1])&&!client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[1]))){
			if(checker==0){
				let embed=new Discord.MessageEmbed()
				.setColor("#73ffdc")
				.setImage("https://media1.tenor.com/images/2a0a2a1021e29f96173e35bc17f5b326/tenor.gif?itemid=18015941")
				.setDescription("**Use fbk help or fbk commands for avaliable commands!**");
				message.channel.send(embed);
			}
			return;
		}
		const commandName=args[1];
		const command=client.commands.get(args[1])|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[1]));
		try{
			if(commandName==="art"){
				query=await command.execute(message,images,query);
			}else if(commandName==="search"){
				({songName,songURL,userID}=await command.execute(message));
				songInfo={
					title: songName,
					url: songURL
				};
			}else{
				command.execute(message, misc,musicUrls);
			}
		}catch(error){
			console.error(error);
			message.reply("There was an error trying to execute that command.");
		}
	}
});

client.on('messageReactionAdd', async (reaction,user)=> {
	if(user.bot){
		return;
	}
	if(reaction.emoji.name==='🌽'&&user.id===userID){
		let member=reaction.message.guild.member(user);
		let channel=member.voice.channel;
		if(channel){
			if(!reaction.message.member.voice.channel||musicUrls===undefined||musicUrls.length==0){
				let connection= await channel.join();
				musicUrls.push(songInfo);
				playSong(connection);
				reaction.message.channel.send("**Added to queue!**");
			}else{
				musicUrls.push(songInfo);
				reaction.message.channel.send("**Added to queue!**");
			}		
		}else{
			reaction.message.channel.send("**Please join a voice channel first**");
		}
	}
});

async function playSong(voiceConnection){
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