from bs4 import BeautifulSoup
import urllib
import json
import re

data = []

lrre = re.compile(r"\d\d?")
scorere = re.compile(r"\d-\d")

allteamurls = []

for year in range(1971, 2016):
#for year in range(2015, 2016):
    url = "http://www.basketball-reference.com/leagues/NBA_" + str(year) + ".html"
    r = urllib.urlopen(url).read()

    soup = BeautifulSoup(r)

    es = soup.find("table", id="E_standings")
    ws = soup.find("table", id="W_standings")
    lines = es.find_all("tr", class_="full_table")
    lines.extend(ws.find_all("tr", class_="full_table"))

    po = soup.find("div", id="all_playoffs").find("table")
    pos = po.find_all("tr", class_="mobile_text")

    thisYear = {'year': year, 'teams': [], 'playoffs': []}
    
    playoffrank = {}

    for playoff in pos:
        game = playoff.find("span").get_text()
        score = scorere.search(playoff.find("td").get_text()).group(0)
        winner = playoff.find_all("a")[0].get_text()        
        loser = playoff.find_all("a")[1].get_text()        
        if winner in playoffrank:
            playoffrank[winner] -= 1
        else:
            playoffrank[winner] = 5
        thisYear['playoffs'].append({'game': game, 'winner': winner, 'loser': loser, 'score': score})

    for line in lines:
        tds = line.find_all("td")
        name = tds[0].find("a").get_text()
        allteamurls.append(tds[0].find("a")['href'])
        leaguerank = lrre.search(tds[0].find("span").get_text()).group(0)
        srs = tds[7].get_text()
        newValue = {'team': name, 'leaguerank': int(leaguerank), 'srs': float(srs)}
        if name in playoffrank:
            newValue['playoffrank'] = playoffrank[name]
        thisYear['teams'].append(newValue)

    data.append(thisYear)

with open('data.json', 'w') as jsonfile:
    json.dump(data, jsonfile, indent=4)

f = open('teamurls', 'w')
for teamurl in allteamurls:
    f.write("http://www.basketball-reference.com" + teamurl + "\n")
