const { Client, Util } = require('discord.js');
const { TOKEN, PREFIX, GOOGLE_API_KEY } = require('./config');
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');

const client = new Client({ disableEveryone: true });

const youtube = new YouTube('AIzaSyAb4ntXi8jcfj26oDSeQm245XPMlikaQSI');

const queue = new Map();

client.on('warn', console.warn);

client.on('error', console.error);

client.on('ready', () => console.log('Yo this ready!'));

client.on('disconnect', () => console.log('I just disconnected, making sure you know, I will reconnect now...'));

client.on('reconnecting', () => console.log('I am reconnecting now!'));

client.on('message', async msg => {
	if (msg.author.bot) return;
	if (!msg.content.startsWith(PREFIX)) return;
	const args = msg.content.split(' ');

	if (msg.content.startsWith(`${PREFIX}play`)) {
		const voiceChannel = msg.member.voiceChannel;
		if(!voiceChannel) return msg.reply("you need to join a voice channel to play music.");
		const permissions = voiceChannel.permissionsFor(msg.client.user);
		if (!permissions.has('CONNECT')) {
			return msg.reply("I don't have the perms to join that voice channel.");
		}
		if (!permissions.has('SPEAK')) {
			return msg.reply('I am not going to join the voice channel you are in because I connot speak in it.');
		}
		
		try {
			var connection = await voiceChannel.join();
		} catch (error) {
			console.log(`I couldn't join the voice channel: ${error}`);
			return msg.channel.send(`Voice Channel joining error: ${error}`);
		}
		
		const dispatcher = connection.playStream(ytdl(args[1]))
			.on('end', () => {
				console.log('song ended');
				voiceChannel.leave();
			})
			.on('error', error => {
				console.error(error)
			});
			
		dispatcher.setVolumeLogarithmic(5 / 5)
	} else if (msg.content.startsWith(`${PREFIX}stop`)) {
		if (!msg.member.voiceChannel) return msg.channel.send("You are not in a voice channel to stop me from playing in.!");
		msg.member.voiceChannel.leave();
		return;
	}
});

client.login(TOKEN);
