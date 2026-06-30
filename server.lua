local settings = GraveyardLoadscreen or {}
local policeEMSActivityResource = settings.PoliceEMSActivityResource or 'PoliceEMSActivity'
local defaultMaxClients = settings.DefaultMaxClients or 256

local function tableContains(list, value)
    for _, item in ipairs(list or {}) do
        if item == value then return true end
    end
    return false
end

local function classifyDepartment(label)
    local text = string.lower(tostring(label or ''))

    if string.find(text, 'fire') or string.find(text, 'fd') or string.find(text, 'rescue') or string.find(text, 'safr') then
        return 'fire'
    end

    if string.find(text, 'ems') or string.find(text, 'medical') or string.find(text, 'ambulance') or string.find(text, 'paramedic') or string.find(text, 'medic') then
        return 'ems'
    end

    if string.find(text, 'leo')
        or string.find(text, 'lspd')
        or string.find(text, 'bcso')
        or string.find(text, 'sasp')
        or string.find(text, 'police')
        or string.find(text, 'sheriff')
        or string.find(text, 'patrol')
        or string.find(text, 'trooper')
        or string.find(text, 'law') then
        return 'leo'
    end

    -- PoliceEMSActivity is emergency-role focused, so unknown duty roles default to LEO.
    return 'leo'
end

local function emptyDuty()
    return {
        leo = { label = 'LEO', count = 0 },
        fire = { label = 'Fire', count = 0 },
        ems = { label = 'EMS', count = 0 },
        departments = {},
        unavailableReason = nil
    }
end

local function getPoliceEMSActivityDuty()
    local duty = emptyDuty()

    if GetResourceState(policeEMSActivityResource) ~= 'started' then
        duty.unavailableReason = ('%s is not started'):format(policeEMSActivityResource)
        return duty
    end

    local ok, activityStats = pcall(function()
        return exports[policeEMSActivityResource]:GetDutyStats()
    end)

    if not ok or type(activityStats) ~= 'table' then
        duty.unavailableReason = 'PoliceEMSActivity export GetDutyStats was not found. Use the patched PoliceEMSActivity folder included in this package.'
        return duty
    end

    if type(activityStats.groups) == 'table' then
        for key, group in pairs(activityStats.groups) do
            if duty[key] and type(group) == 'table' then
                duty[key].count = tonumber(group.count) or 0
                duty[key].label = group.label or duty[key].label
            end
        end
    end

    if type(activityStats.departments) == 'table' then
        duty.departments = activityStats.departments

        -- Backward-compatible aggregation if the export only returned individual departments.
        if (duty.leo.count + duty.fire.count + duty.ems.count) == 0 then
            for _, dept in ipairs(activityStats.departments) do
                local groupKey = classifyDepartment(dept.label)
                if duty[groupKey] then
                    duty[groupKey].count = duty[groupKey].count + (tonumber(dept.count) or 0)
                end
            end
        end
    end

    return duty
end

local function buildStats()
    local online = #GetPlayers()
    local maxPlayers = GetConvarInt('sv_maxclients', defaultMaxClients)

    return {
        ok = true,
        type = 'graveyardLoadscreenStats',
        updatedAt = os.time(),
        players = {
            online = online,
            max = maxPlayers
        },
        duty = getPoliceEMSActivityDuty()
    }
end

local function sendJsonResponse(res, status, body)
    res.writeHead(status, {
        ['Content-Type'] = 'application/json; charset=utf-8',
        ['Access-Control-Allow-Origin'] = '*',
        ['Access-Control-Allow-Methods'] = 'GET, OPTIONS',
        ['Access-Control-Allow-Headers'] = 'Content-Type',
        ['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
    })
    res.send(json.encode(body))
end

SetHttpHandler(function(req, res)
    if req.method == 'OPTIONS' then
        return sendJsonResponse(res, 200, { ok = true })
    end

    local path = req.path or ''
    local paths = settings.StatsPaths or { '/stats.json', '/graveyard_loadscreen/stats.json' }

    if tableContains(paths, path) then
        return sendJsonResponse(res, 200, buildStats())
    end

    return sendJsonResponse(res, 404, { ok = false, error = 'Not found' })
end)
