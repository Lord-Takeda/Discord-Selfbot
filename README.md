# Discord-selfbot
Installation:
Install node.js v12 or 14 on your computer.
Install npm.
Through your console go:
npm i discord.js@11.5.1
npm i axios

Configuration:
Paste your token in the config.json file where you're prompted to, you silly skid.
In the config.json file, you'll see two things of interest: purgerKeyWord and purgeSuffix, whatever you put in for the purgerKeyword will trigger a purge if you send it in a message.
Same with the suffix if you end a message with it.
However, if you do not wish to have these active: simply change the "true" in 'purgeKeyWord' or 'purgerSuffix' to 'false'.
Also the "serverName" and "serverIcon" refer to nuked servers after using the 'nuke' command.

Oh yeah also:
Since DiscordJS is gay, when using the uinfo command you have to send the command in a guild that the person you're getting userinfo from is. *Just saying in case people get confused since it works by ID rather than mentioning*.
