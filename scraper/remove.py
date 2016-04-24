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
        team['opponent'] = { "PTS/G": team['info']['PTS/G']}
        team['misc'] = {"Attendance": team['misc']['Attendance'], "Age": team['misc']['Age']}
        newplayers = []
        for player in team['players']:
            if player['advanced']['G'] > 5:
                del player['pergame']
                del player['perminute']
                del player['perposs']
                del player['totals']
                player['advanced'] = { "PER": player['advanced']['PER'] }
                newplayers.append(player)

        team['players'] = newplayers

with open('removed.json', 'w') as outjsonfile:
    json.dump(data, outjsonfile, indent=4)
