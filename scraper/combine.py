import json
import csv

teamfolder = "teamdata/out/"

with open('data.json', 'r') as jsonfile:
    data = json.load(jsonfile)

for yeardata in data:
    year = yeardata['year']
    for team in yeardata['teams']:
        teamname = team['team']
        teamfile = teamfolder + str(year) + "_" + teamname.replace(" ", "_").replace("/", "-") + ".csv"
        with open(teamfile, 'r') as csvfile:
            reader = csv.reader(csvfile, delimiter=',')
            keys = []
            players = []
            first = True;
            for row in reader:
                if first:
                    keys = row
                    first = False;
                else:
                    player = {}
                    for i in range(0, len(row)):
                        player[keys[i]] = row[i]
                    players.append(player)
            team['players'] = players

with open('combined.json', 'w') as outjsonfile:
    json.dump(data, outjsonfile, indent=4)
