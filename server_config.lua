GraveyardLoadscreen = GraveyardLoadscreen or {}

-- Must match the folder/resource name of your PoliceEMSActivity script.
GraveyardLoadscreen.PoliceEMSActivityResource = 'PoliceEMSActivity'

-- Used only if sv_maxclients cannot be read.
GraveyardLoadscreen.DefaultMaxClients = 256

-- Accept multiple paths so the UI still works whether the host strips the resource name or not.
GraveyardLoadscreen.StatsPaths = {
    '/stats.json',
    '/graveyard_loadscreen/stats.json',
    '/graveyard-loadscreen/stats.json',
    '/graveyard_dual_loadscreen/stats.json',
    '/graveyard-dual-loadscreen/stats.json'
}
