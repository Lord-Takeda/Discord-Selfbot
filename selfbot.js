const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const axios = require('axios');
const fs = require('fs');
const embedAuthor = ('Eclypse');

console.clear();
console.log(`logging in...`);

client.login (config.discordToken).catch(()=>{
  console.log(`[ERROR]: Invalid token or ver 12 of DiscordJS`);
});

 client.on('ready', () => {
  console.log(`\nClient logged in as ${client.user.tag},${client.user}; \nGet started by sending ${config.prefix}help in any channel!\n`);
  client.user.setPresence({
    status: "idle", 
    game: {
        name: config.userActivity,  
        type: "streaming",
        url: config.streamURL
      }
    })
  console.log(`
\x1b[40m\x1b[32m
____________________________________________________________________________
╭━━━╮╱╱╭╮
┃╭━━╯╱╱┃┃
┃╰━━┳━━┫┃╭╮╱╭┳━━┳━━┳━━╮
┃╭━━┫╭━┫┃┃┃╱┃┃╭╮┃━━┫┃━┫
┃╰━━┫╰━┫╰┫╰━╯┃╰╯┣━━┃┃━┫
╰━━━┻━━┻━┻━╮╭┫╭━┻━━┻━━╯
╱╱╱╱╱╱╱╱╱╭━╯┃┃┃
╱╱╱╱╱╱╱╱╱╰━━╯╰╯
By Takeda
_____________________________________________________________________________
\x1b[32m`);
});

client.on('message', async msg => { 
  if (msg.author === client.user && msg.content.startsWith(config.prefix)){
  let msgContent = msg.content.slice(config.prefix.length);
  if (msgContent === 'help') {
   await msg.delete();
    let help = new Discord.RichEmbed()
    .setColor('RANDOM')
    .setTitle('Eclypse help')
    .setAuthor(embedAuthor)
    .setDescription(`
${"```"}🙟ECLYPSE🙝
By Takeda
COMMANDS:
\nUtility Commands:\n
help: Sends this message.
blank: buries the chat with blank text.
purge: Deletes your messages in the Textchannel/DM/GC you send it in.
ginfo: Grabs info about the guild you send it in.
Invinfo (invite code): Displays guild info for the an invite link
checkip (IP Address): Displays IP info for an IP address.
tokeninfo (token): Displays login info for a token
logs: logs messages in a the channel you send it in.
\nRAID COMMANDS:\n
spam (message): spams a message.
gspam (message): ghost spams a message.
rspam: Spam pings all roles.
grspam: ghost spam pings all roles.
massban: Bans everyone with a role under yours in the server you send it in (Perms required*)
nuke: Nukes a server (Deletes channels, emotes, roles, spams channels *Perms required*).
\nMISC COMMANDS:\n
massreact (emoji): Reacts to every message in the channel you send it in.
msgedit (edit-to): Edits your messages in the channel you send the command in.
pspam: spam pins messages sent in a channel/GC/DM (perms required*)
${"```"}
`)
    .setTimestamp()
    .setFooter('Eclypse by Takeda');
    msg.channel.send(help);
  }
  else if (msgContent.startsWith('spam')){
   let MSGContent = msgContent.slice (`spam`.length);
   let msgCount = 0;
    msg.delete();
     while (true) {
       await msg.channel.send(MSGContent);
        msgCount++;
        if (msgCount % 10 === 0) { console.log(`Sent ${msgCount} messages!`); }
     }
  }
  else if (msgContent.startsWith('gspam')){
    let msgCount = 0;
    let MSGContent = msgContent.slice(`gspam`.length);
    msg.delete();
    while (true) {
      try{
      await msg.channel.send(MSGContent).then(async botMsg => {
        await botMsg.delete();
        msgCount++;
        if (msgCount % 10 === 0) { console.log(`Sent ${msgCount} messages!`); }
      });
     }catch(error){}
    }
  }
  else if (msgContent === 'rspam'){
    let msgCount = 0;
        msg.delete();
        let nigspam = '@everyone';
        for (role of msg.guild.roles) {
          if (role[0] === '@everyone') { continue }
          nigspam += `\n<@&${role[0]}>`;
        }
        msg.channel.send(nigspam);
        while (true) {
          await msg.channel.send(nigspam);
            msgCount++;
          if (msgCount % 10 === 0) { console.log(`Sent ${msgCount} messages!`); }
        }
  }
  else if (msgContent === 'grspam'){
    let msgCount = 0;
    msg.delete();
    let nigspam = '@everyone';
    for (role of msg.guild.roles) {
      if (role[0] === '@everyone') { continue }
      nigspam += `\n<@&${role[0]}>`;
    };
    while (true) {
      await msg.channel.send(nigspam).then(async botMsg => {
       await botMsg.delete();
        msgCount++;
        if (msgCount % 10 === 0) { console.log(`Sent ${msgCount} messages!`); }
      }).catch(err => console.log(err));
    }
  }
  else if (msgContent === 'nuke'){
    await msg.delete();
    try{
    if (msg.guild.me.hasPermission(['MANAGE_CHANNELS'])){
   console.log(`Nuking \x1b[37m${msg.guild.name}\x1b[32m...\nDeleting channels...`);
     msg.guild.channels.deleteAll();
     if(msg.guild.me.hasPermission(['MANAGE_EMOJIS'])){
     console.log('Deleting emotes...');
     msg.guild.emojis.deleteAll();
     }if(msg.guild.me.hasPermission(['MANAGE_ROLES'])){
     console.log('Deleting roles...')
     msg.guild.roles.forEach(async role=>{
         try{
         await role.delete()
         }catch(error){}
     });
     }
      msg.guild.setIcon(config.serverIcon);
       msg.guild.setName(config.serverName);
       massban();
       if (msg.guild.verificationLevel != 4){
        msg.guild.setVerificationLevel(4);
        }
        for (let i = 0, l = config.channelCount, channelNames = config.channels.split(','); i < l; i++) {
         msg.guild.createChannel(channelNames[~~(channelNames.length * Math.random())],{
          type: 'text',
           permissionOverwrites: [
           {
            id: msg.channel.id
           },
        ],
      }).catch()
    }
   }
  }catch(error){};
  }
  else if (msgContent === 'massban'){
   await msg.delete();
    massban();
  }
}
function massban(){
  console.log(`\x1b[32mMassbanning members of \x1b[31m${msg.guild.name}...`);
    msg.guild.members.forEach(async member =>{
      if (member.bannable === (false)){
        console.log(`\x1b[31mFailed to ban ${member.user.tag} from \x1b[33m${member.guild.name}.\x1b[32m`);
       }
        if (member.bannable === (true)){
        await member.ban();
        console.log(`\x1b[32mBanned ${member.user.tag} from \x1b[33m${member.guild.name}!\x1b[32m`);
      }
    });
}
});


//Purge
client.on('message', async msg => { 
  if (msg.author === client.user && (config.purgerSuffix) == (true) && (msg.content.endsWith(config.purgeSuffix) || (config.purgeKeyWord) == (true) && msg.content.includes(config.purgerKeyWord) || (msg.content == `${config.prefix}purge`))) {
      msg.delete();
      let fetched = await msg.channel.fetchMessages({limit: false});
      for (message of fetched) {
        if (message[1].author === client.user) {
          await message[1].delete();
         }
      }
    }
});

//util commands
client.on('message', async msg => { 
  if (msg.content.startsWith(config.prefix) && msg.author == client.user){
  let msgContent = msg.content.slice(config.prefix.length);
  if (msgContent.startsWith('msgedit')) {
   let MSGContent = msgContent.slice(`msgedit`.length);
    console.log(`Editing messages to "${msgContent}"`)
    let fetched = await msg.channel.fetchMessages({limit: 99});
    for (message of fetched) {
     if (message[1].author === client.user) {
      await message[1].edit(MSGContent);
    }
   }
  }
  else if (msgContent.startsWith('massreact')){
    let reaction = msgContent.slice (`massreact`.length).trimStart();
    await msg.delete();
    console.log(`Spam reacting "${reaction}"...`)
    let fetched = await msg.channel.fetchMessages({limit: 99});
    for (message of fetched) {
      await message[1].react(reaction);
    }
  }
  else if (msgContent === 'pspam') {
   await msg.delete();
    let fetched = await msg.channel.fetchMessages({limit: 50});
     for (message of fetched) {
      await message[1].pin();
   }
  }
  else if (msgContent === 'ginfo'){
    await msg.delete();
    let ginfo = (`-members: ${msg.guild.memberCount}\n-Created at: ${msg.guild.createdAt}\n-Server Region: ${msg.guild.region}\n-Verification Level: ${msg.guild.verificationLevel}\n-AFK timeout: ${msg.guild.afkTimeout}\n-Explicit Filter: ${msg.guild.explicitContentFilter}\n-mfa: ${msg.guild.mfaLevel}\n-Server ID: ${msg.guild.id}\nIcon:`)
    let guildEmbed = new Discord.RichEmbed()
    .setColor('RANDOM')
    .setTitle(`Guild Info for ${msg.guild.name}`)
    .setAuthor(embedAuthor)
    .setDescription(ginfo)
    .setTimestamp()
    .setImage(msg.guild.iconURL)
    .setFooter('Eclypse by Takeda');
    console.log(`Guild Info for: ${msg.guild.name}\n\n${ginfo}\n-Server Icon: ${msg.guild.iconURL}\n-Server Owner: <@${msg.guild.ownerID}>\n`);
    msg.channel.send(guildEmbed);
  }
  else if (msgContent.startsWith('uinfo')){
    await msg.delete();
    let users = msgContent.slice('uinfo'.length).trimEnd().trimStart();
         let member = await msg.guild.fetchMember(users);
         let uInfo = (`-Tag: ${member.user.tag}\n-ID: ${member.id}\n-Creation date: ${member.user.createdAt}\n-Bot: ${member.user.bot}\n-Avatar:`);
         let userEmbed = new Discord.RichEmbed()
         .setColor('RANDOM')
         .setTitle(`Userinfo for ${member.user.username}`)
         .setAuthor(embedAuthor)
         .setDescription("```" + uInfo + "```")
         .setTimestamp()
         .setImage(member.user.avatarURL)
         .setFooter('Eclypse by Takeda');
    console.log(`UserInfo for ${member.displayName}:\n${uInfo}\nAvatar: ${member.user.avatarURL}\n`);
    msg.channel.send(userEmbed);
  }
  else if (msgContent === 'logs'){
    await msg.delete();
    let messages = []
    let authors = []
    let fetched = await msg.channel.fetchMessages({limit: false});
    for (message of fetched) {
      let content = message[1].content
      let author = message[1].author.tag
      if (!messages.includes(content)){
        messages.push(content) 
      }
      if (!authors.includes(author)){
        messages.push(author) 
      }
    }
    fs.appendFile('logs.txt', messages.join('\n\n'), function(err) {
      if (err) throw err;
      console.log(`Logged messages`);
    });
  }
  else if (msgContent.startsWith('checkip') && msgContent.trimEnd() !== 'checkip'){
    await msg.delete();
    let ipAddress = (msgContent.slice('checkip '.length).trimEnd().trimStart());
       axios({
        url: `http://ip-api.com/json/${ipAddress}?fields=status,message,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,isp,org,as,proxy,query`,
        method: "GET"
      }).then(response =>{
        console.log(formatIpInfo(response));
        let ipEmbed = new Discord.RichEmbed()
        .setColor('RANDOM')
        .setTitle(`IP Info for ${response.data.query}`)
        .setAuthor(embedAuthor)
        .setDescription(formatIpInfo(response))
        .setTimestamp()
        .setFooter('Eclypse by Takeda');
       msg.channel.send(ipEmbed);
    });
  }
  else if (msgContent.startsWith('invinfo')){
    await msg.delete();
      let server = (msgContent.slice('invinfo '.length).trimEnd().trimStart());
       axios({
        url: `https://discord.com/api/invites/${server}`,
        method: "GET"
      }).then(response => {
        console.log(formatInviteInfo(response));
        let invinfo = formatInviteInfo(response);
        let inviteInfo = new Discord.RichEmbed()
        .setColor('RANDOM')
        .setTitle(`Guild Info for: ${response.data.guild.name}`)
        .setAuthor(embedAuthor)
        .setDescription("```" + invinfo + "```")
        .setTimestamp()
        .setFooter('Eclypse by Takeda')
        .setImage(`https://cdn.discordapp.com/icons/${response.data.guild.id}/${response.data.guild.icon}`);
        msg.channel.send(inviteInfo)
      }).catch(err =>{
        if (err.response.status == 404) { console.log(`[ERROR]: Invalid Invite`) }
    });
  }
  else if (msgContent.startsWith ('tokeninfo')) {
    msg.delete();
    let token = (msgContent.slice('tokeninfo '.length).trimEnd().trimStart());
     axios({
      url: `https://discord.com/api/v8/users/@me`,
      method: "GET",
      headers: {'Authorization': token, 'Content-Type': 'application/json'},
    }).then(response => {
      let tokenEmbed = new Discord.RichEmbed()
      .setColor('RANDOM')
      .setTitle(`Token info for: ${token}`)
      .setAuthor(embedAuthor)
      .setDescription(`${"```"}Token Info, ${token}\n${formatTokenInfo(response)}\nAvatar:${"```"}`)
      .setTimestamp()
      .setFooter('Eclypse by Takeda')
      .setImage(`Avatar: https://cdn.discordapp.com/avatars/${response.data.id}/${response.data.avatar}`);
      console.log(`Token Info,${token}:\n${formatTokenInfo(response)}\n Avatar: https://cdn.discordapp.com/avatars/${response.data.id}/${response.data.avatar}`);
      msg.channel.send(tokenEmbed);
    }).catch(err =>{
      if (err.response.status == 404) { console.log(`[ERROR]:Invalid Token`) }
    })
  }
  else if (msgContent === 'blank') {
    await msg.delete();
     msg.channel.send(`
     _ _ \n
     _ _ \n
     _ _ \n
     _ _ \n
     _ _ \n
     _ _ \n
     _ _ \n
     _ _ \n
     _ _ \n
     _ _ \n
     _ _ \n
     _ _ \n
     _ _ \n
     _ _ \n
     _ _ \n
     _ _ \n
     _ _ \n
     _ _ \n
 `)
 }
}
});

function formatTokenInfo(info) {
  let data = info.data;
  let output = `
  Tag: ${data.username}#${data.discriminator}
  ID: ${data.id}
  Verified? ${data.verified}
  Email: ${data.email}
  MFA? ${data.mfa_enabled}
  Phone num: ${data.phone}
  Locale: ${data.locale}
  `
  return output;
}

function formatInviteInfo(info) {
  let data = info.data;
  let output = `
  Guildinfo for, ${data.guild.name}:
  invite code: ${data.code}
  id: ${data.guild.id}
  banner: ${data.guild.banner}
  verification level: ${data.guild.verification_level}
  features: ${data.guild.features}
  vanity url: ${data.guild.vanity_url_code}
  splash: ${data.guild.splash}
  icon: https://cdn.discordapp.com/icons/${data.guild.id}/${data.guild.icon}
  `
  return output;
}

function formatIpInfo(info) {
  let data = info.data;
  let output = `
  IP: ${data.query}
  Country: ${data.country}
  Country code: ${data.countryCode}
  Region: ${data.region}
  City: ${data.city}
  District: ${data.district}
  Zip: ${data.zip}
  Latitude: ${data.lat}
  Longitude: ${data.lon}
  Timezone: ${data.timezone}
  ISP: ${data.isp}
  Org: ${data.org}
  As: ${data.as}
  Proxy: ${data.proxy}
  `;
  return output;
}
