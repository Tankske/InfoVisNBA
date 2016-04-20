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
        team['misc'] = {"Attendance": team['misc']['Attendance']}
        for player in team['players']:
            del player['pergame']
            del player['perminute']
            del player['perposs']
            del player['totals']
            player['advanced'] = { "PER": player['advanced']['PER'] }

with open('removed.json', 'w') as outjsonfile:
    json.dump(data, outjsonfile, indent=4)
