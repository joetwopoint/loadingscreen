fx_version 'cerulean'
game 'gta5'

name 'Graveyard Loading Screen'
author 'Two Point Development'
description 'Dual Graveyard Shift RP loading screen with seamless design switching, shared assets/config, shared music, real progress, player count, and duty counts.'
version '1.0.0'

loadscreen 'html/index.html'
loadscreen_manual_shutdown 'yes'
loadscreen_cursor 'yes'

files {
    'html/index.html',
    'html/twopoint.html',
    'html/graveyard.html',
    'html/dual-shell.css',
    'html/dual-shell.js',
    'html/shared-config.js',
    'html/twopoint.css',
    'html/twopoint.js',
    'html/graveyard.css',
    'html/graveyard.js',
    'html/assets/images/*',
    'html/assets/staff/*',
    'html/assets/wanted/*',
    'html/assets/gallery/*',
    'html/assets/music/*'
}

client_script 'client.lua'

server_scripts {
    'server_config.lua',
    'server.lua'
}
