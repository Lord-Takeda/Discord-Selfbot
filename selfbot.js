const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const axios = require('axios');
const fs = require('fs')
require('events').EventEmitter.defaultMaxListeners = (21);

console.clear();
console.log(`logging in...`);
try{
client.login (config.discordToken); 
}catch(error){console.log('ERR: Invalid token or incompatible version of DiscordJS')}
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
\x1b[40m\x1b[32m\____________________________________________________________________________________________
╭━━━╮╱╱╭╮
┃╭━━╯╱╱┃┃
┃╰━━┳━━┫┃╭╮╱╭┳━━┳━━┳━━╮
┃╭━━┫╭━┫┃┃┃╱┃┃╭╮┃━━┫┃━┫
┃╰━━┫╰━┫╰┫╰━╯┃╰╯┣━━┃┃━┫
╰━━━┻━━┻━┻━╮╭┫╭━┻━━┻━━╯
╱╱╱╱╱╱╱╱╱╭━╯┃┃┃
╱╱╱╱╱╱╱╱╱╰━━╯╰╯
By Takeda
____________________________________________________________________________________________
\x1b[32m`);
});

//Help.
client.on('message', msg => { 
  if (msg.author === client.user && msg.content.startsWith(config.prefix)){
  let msgContent = msg.content.slice(config.prefix.length);
  if (msgContent === 'help') {
    msg.delete();
    msg.channel.send("```                                         🙟ECLYPSE🙝 \n                                         By: Takeda \n --------------------------------------------------------------------------------------- \n COMMANDS: \n Utility Commands: \n \n help: Sends this message.\n \n blank: buries the chat with blank text. \n \n purge: Deletes your messages in the Textchannel/DM/GC you send it in. \n \n ginfo: Grabs info about the guild you send it in.\n Invinfo (invite code): Displays guild info for the an invite link\n checkip (IP Address): Displays IP info for an IP address.\n tokeninfo (token): Displays login info for a token\n\nlogs: logs messages in a the channel you send it in.\n \n RAID COMMANDS: \n \n spam (message): spams what you place after the command. \n \n gspam (message): spams what you place after the command and deletes it at the same time. \n \n rspam: Spam pings all roles. \n \n grspam: ghost spam pings all roles \n \n massban: Bans everyone with a role under yours in the server you send it in (Perms required*) \n \n nuke: Nukes a server (Deletes channels, emotes, roles, spams channels *Perms required*). \n \n MISC COMMANDS: \n \n massreact (emoji): Reacts to every message in the channel you send it in. \n \n msgedit (edit-to): Edits your messages in the channel you send the command in. \n \n pspam: spam pins messages sent in a channel/GC/DM (perms required*)\n                              ---------------------------------------------------------------------------------------------  ```");
  }
}
});

//spam
client.on('message', async msg => { 
  let msgContent = msg.content.slice(config.prefix.length);
  if (msg.author === client.user && msgContent.startsWith(`spam`)) {
   let MSGContent = msgContent.slice (`spam`.length);
   let msgCount = 0;
    msg.delete();
     while (true) {
       await msg.channel.send(MSGContent);
        msgCount++;
        if (msgCount % 10 === 0) { console.log(`Sent ${msgCount} messages!`); }
     }
   }
});

//Ghost spam.
client.on('message', async msg => { 
  let msgContent = msg.content.slice(config.prefix.length);
  if (msg.author === client.user && msgContent.startsWith(`gspam`)) {
    let msgCount = 0;
    let MSGContent = msgContent.slice(`gspam`.length);
    msg.delete();
    while (true) {
      await sleep(0.1);
      msg.channel.send(MSGContent).then(botMsg => {
        botMsg.delete(0.1);
        msgCount++;
        if (msgCount % 10 === 0) { console.log(`Sent ${msgCount} messages!`); }
      }).catch(err => console.log(err));
    }
  }
});

//rspam
client.on('message', async msg => {
  if (msg.author === client.user && msg.content.startsWith(config.prefix)){
     let msgContent = msg.content.slice(config.prefix.length);
      if (msgContent === 'rspam') {
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
   }
});

//grspam
client.on('message', async msg => {
  if (msg.author === client.user && msg.content.startsWith(config.prefix)) {
     let msgContent = msg.content.slice(config.prefix.length);
      if (msgContent === 'grspam') {
        let msgCount = 0;
        msg.delete();
        let nigspam = '@everyone';
        for (role of msg.guild.roles) {
          if (role[0] === '@everyone') { continue }
          nigspam += `\n<@&${role[0]}>`;
        };
        while (true) {
          await sleep(0.1);
           msg.channel.send(nigspam).then(botMsg => {
            botMsg.delete(0.1);
            msgCount++;
            if (msgCount % 10 === 0) { console.log(`Sent ${msgCount} messages!`); }
          }).catch(err => console.log(err));
        }
     } 
   }
});

//Nuke
client.on('message', async (msg) => { 
  if (msg.author === client.user && msg.content.startsWith(config.prefix)){
  let msgContent = msg.content.slice(config.prefix.length);
  if (msgContent === 'nuke') {
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
       if(msg.guild.verificationLevel !== 4){
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
}
});

//Massban
client.on('message', async msg => { 
  if (msg.author === client.user && msg.content.startsWith(config.prefix)){
  let msgContent = msg.content.slice(config.prefix.length);
  if (msgContent === 'massban') {
    msg.delete();
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
  }
});

//Purge
client.on('message', async msg => { 
  if (msg.author === client.user && (config.purgerSuffix) == (true) && (msg.content.endsWith(config.purgeSuffix) ||(config.purgeKeyWord) == (true) && msg.content.includes(config.purgerKeyWord) || (msg.content == `${config.prefix}purge`))) {
      msg.delete();
      let fetched = await msg.channel.fetchMessages({limit: false});
      for (let i = 0; true; i++) {
      for (message of fetched) {
        if (message[1].author === client.user) {
          await message[1].delete();
         }
        }
      }
    }
});

//msgedit
client.on('message', async msg => { 
  if ( msg.author === client.user && msg.content.startsWith (`${config.prefix}msgedit`)) {
   let msgContent = msg.content.slice (`${config.prefix}msgedit`.length);
    msg.delete();
    console.log(`Editing messages to "${msgContent}"`)
    let fetched = await msg.channel.fetchMessages({limit: 99});
    for (message of fetched) {
     if (message[1].author === client.user) {
      await sleep(0.1);
      message[1].edit(msgContent);
    }
   }
  }
});

//massreact
client.on('message', async msg => { 
  if ( msg.author === client.user && msg.content.startsWith (`${config.prefix}massreact `)) {
    let reaction = msg.content.slice (`${config.prefix}massreact `.length);
    await msg.delete();
    console.log(`Spam reacting "${reaction}"...`)
    let fetched = await msg.channel.fetchMessages({limit: 99});
    for (let i = 0; true; i++) {
    for (message of fetched) {
      await sleep(0.1);
      message[1].react(reaction);
     }
    }
  }
});

//pinspam
client.on('message', async msg => { 
  if (msg.author === client.user && msg.content.startsWith(config.prefix)){
  let msgContent = msg.content.slice(config.prefix.length);
   if (msgContent === 'pspam') {
     msg.delete();
     let fetched = await msg.channel.fetchMessages({limit: 50});
     for (message of fetched) {
      await sleep(0.1);
      message[1].pin();
    }
   }
  }
});

//GuildInfo
client.on('message', async msg  => {
  if (msg.author === client.user && msg.content.startsWith(config.prefix)){
     let msgContent = msg.content.slice(config.prefix.length);
      if (msgContent === 'ginfo') {
        msg.delete();
        let ginfo = (`-members: ${msg.guild.memberCount}\n-Created at: ${msg.guild.createdAt}\n-Server Region: ${msg.guild.region}\n-Verification Level: ${msg.guild.verificationLevel}\n-AFK timeout: ${msg.guild.afkTimeout}\n-Explicit Filter: ${msg.guild.explicitContentFilter}\n-mfa: ${msg.guild.mfaLevel}\n-Server ID: ${msg.guild.id}`)
        let guildInfo = new Discord.RichEmbed().setColor('RANDOM').setTitle(`Guild Info for: ${msg.guild.name}`).setDescription(`${"```"}${ginfo}\n-Server Owner: <@${msg.guild.ownerID}>${"```"}`).setImage(msg.guild.iconURL).setTimestamp();
        msg.channel.send(guildInfo);
        console.log(`Guild Info for: ${msg.guild.name}\n\n${ginfo}\n-Server Icon: ${msg.guild.iconURL}\n-Server Owner: <@${msg.guild.ownerID}>\n`);
      }
    }
});

//UserInfo
client.on('message', async msg  => {
  if (msg.author === client.user && msg.content.startsWith(config.prefix)){
     let msgContent = msg.content.slice(config.prefix.length);
      if (msgContent.startsWith('uinfo')) {
        await msg.delete();
        let users = msgContent.slice('uinfo'.length).trimEnd().trimStart();
         let member = await msg.guild.fetchMember(users);
         let uInfo = (`-Tag: ${member.user.tag}\n-ID: ${member.id}\n-Creation date: ${member.user.createdAt}\n-Bot: ${member.user.bot}\n-Avatar:`);
          const UInfo = new Discord.RichEmbed().setColor("RANDOM").setTitle(`Userinfo for ${member.displayName}`).setTimestamp().setAuthor('🙟ƩƈĿƴþꚃ𐰫🙝', "https://cdn.discordapp.com/avatars/792165710134247444/fa63d2daf5eaf69d5c583551e20e8448.png")
        .setDescription(`${config.grave}${uInfo}${config.grave}`).setImage(member.user.avatarURL);
        msg.channel.send(UInfo);
       console.log(`UserInfo for ${member.displayName}:\n${uInfo}\nAvatar: ${member.user.avatarURL}\n`)
    }
   }
});

function formatUserInfo(info){
  let data = info.data
  let output = `
-Tag: ${data.username}#${data.discriminator}
-ID: ${data.id}
-Avatar:
`
  return output;
}

//msglogger
client.on('message', async msg => {
  if (msg.author === client.user && msg.content.startsWith(config.prefix)) {
    let msgContent = msg.content.slice(config.prefix.length);
    if (msgContent === 'logs') {
      let messages = []
      let authors = []
      msg.delete();
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
      fs.appendFile('logs.txt', messages.join('\n'), function(err) {
        if (err) throw err;
        console.log(`Logged messages`);
      });
    }
  }
});

//IPcheck
client.on('message', async msg => {
  if (msg.author === client.user && msg.content.startsWith(config.prefix)) {
    let msgContent = msg.content.slice(config.prefix.length);
    if (msgContent.startsWith ('checkip')) {
      msg.delete();
      let ipAddress = (msgContent.slice('checkip '.length).trimEnd().trimStart());
       axios({
        url: `http://ip-api.com/json/${ipAddress}?fields=status,message,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,isp,org,as,proxy,query`,
        method: "GET"
      }).then(response => {
        console.log(formatIpInfo(response));
        msg.channel.send(`${"```"}${formatIpInfo(response)}${"```"}`);
      }).catch(err => console.log(err));
    }
  } 
});

//InviteInfo
client.on('message', async msg => {
  if (msg.author === client.user && msg.content.startsWith(config.prefix)) {
    let msgContent = msg.content.slice(config.prefix.length);
    if (msgContent.startsWith ('invinfo')) {
      msg.delete();
      let server = (msgContent.slice('invinfo '.length).trimEnd().trimStart());
       axios({
        url: `https://discord.com/api/invites/${server}`,
        method: "GET"
      }).then(response => {
        console.log(formatInviteInfo(response));
        msg.channel.send(`${"```"}${formatInviteInfo(response)}${"```"}`);
      }).catch(err => console.log(err));
    }
  } 
});

//TokenInfo
client.on('message', async msg => {
  if (msg.author === client.user && msg.content.startsWith(config.prefix)) {
    let msgContent = msg.content.slice(config.prefix.length);
    if (msgContent.startsWith ('tokeninfo')) {
      msg.delete();
      let token = (msgContent.slice('tokeninfo '.length).trimEnd().trimStart());
       axios({
        url: `https://discord.com/api/v8/users/@me`,
        method: "GET",
        headers: {'Authorization': token, 'Content-Type': 'application/json'},
      }).then(response => {
        console.log(`Token Info,${token}:\n${formatTokenInfo(response)}\n Avatar: https://cdn.discordapp.com/avatars/${response.data.id}/${response.data.avatar}`);
        msg.channel.send(`${"```"}Token Info, ${token}\n${formatTokenInfo(response)}${"```"}\n Avatar: https://cdn.discordapp.com/avatars/${response.data.id}/${response.data.avatar}`);
      }).catch(err => console.log(err));
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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};


//BlankBomb
client.on('message', msg => { 
  if (msg.author === client.user && msg.content.startsWith(config.prefix)) {
  let msgContent = msg.content.slice(config.prefix.length);
  if (msgContent === 'blank') {
   msg.delete();
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
   _ _ \n`
);
}};
});
