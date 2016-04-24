import json
import csv

teamfolder = "teamdata/out/"

with open('data.json', 'r') as jsonfile:
    data = json.load(jsonfile)

for yeardata in data:
    year = yeardata['year']
    print ""
    print "NEW YEAR " + str(year)
    for team in yeardata['teams']:
        teamname = team['team']
        print "Doing team " + teamname
        teamfile = teamfolder + str(year) + "_" + teamname.replace(" ", "_").replace("/", "-") + ".json"
        with open(teamfile, 'r') as jsonfile:
            f = json.load(jsonfile)
            team['players'] = f

with open('combined.json', 'w') as outjsonfile:
    json.dump(data, outjsonfile, indent=4)
