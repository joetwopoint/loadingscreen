-- Manual shutdown keeps the UI visible until the player is actually active.
-- Remove loadscreen_manual_shutdown from fxmanifest.lua if you want FiveM's default shutdown behavior.
CreateThread(function()
    while not NetworkIsPlayerActive(PlayerId()) do
        Wait(250)
    end

    Wait(1500)
    ShutdownLoadingScreenNui()
    ShutdownLoadingScreen()
end)
