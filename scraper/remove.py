import json
import csv

teamfolder = "teamdata/out/"

with open('combined.json', 'r') as jsonfile:
    data = json.load(jsonfile)

for yeardata in data:
    year = yeardata['year']
    print ""
    print "NEW YEAR " + str(year)
    for team in yeardata['teams']:
        teamname = team['team']
        print "Doing team " + teamname
        team['info'] = { "PTS/G": team['info']['PTS/G'], "FG%": team['info']['FG%']}
        team['opponent'] = { "PTS/G": team['opponent']['PTS/G']}
        team['misc'] = {"Attendance": team['misc']['Attendance'], "Age": team['misc']['Age'], "ORtg": team['misc']['ORtg'], "DRtg": team['misc']['DRtg']}
        newplayers = []
        totalper = 0
        for player in team['players']:
            if player['advanced']['G'] > 5:
                del player['pergame']
                del player['perminute']
                player['perposs'] = { "ORtg": player['perposs']['ORtg'], "DRtg": player['perposs']['DRtg'] }
                player['totals'] = { "Age": player['totals']['Age'], "eFG%" : player['totals']['eFG%'] }
                player['advanced'] = { "PER": player['advanced']['PER'] }
                totalper += player['advanced']['PER']
                newplayers.append(player)

        team['players'] = newplayers
        team['totalper'] = totalper

with open('removed.json', 'w') as outjsonfile:
    json.dump(data, outjsonfile, indent=4)
