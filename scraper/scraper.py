from bs4 import BeautifulSoup
import urllib
import json
import re
import math
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import os.path
import pandas as pd
import re

datadir = os.getcwd() + '/teamdata'

profile = webdriver.FirefoxProfile()
profile.set_preference("webdriver.load.strategy", "unstable")
profile.set_preference("browser.download.folderList", 2)
profile.set_preference("browser.download.dir", datadir)
profile.set_preference("browser.helperApps.neverAsk.saveToDisk", 'text/csv')
driver = webdriver.Firefox(firefox_profile=profile)

def scrapeline(line, region, thisYear, playoffrank):
    tds = line.find_all("td")
    name = tds[0].find("a").get_text()
    allteamurls.append([name.replace(" ", "_"), tds[0].find("a")['href']])
    leaguerank = lrre.search(tds[0].find("span").get_text()).group(0)
    wins = tds[1].get_text()
    losses = tds[2].get_text()
    winlossperc = tds[3].get_text()
    gamesbehind = tds[4].get_text()
    try:
        gamesbehind = int(gamesbehind)
    except:
        gamesbehind = 0
    pointspergame = tds[5].get_text()
    pointsallowedpergame = tds[6].get_text()
    srs = tds[7].get_text()
    newValue = {'team': name, 'leaguerank': int(leaguerank), 'srs': float(srs), 'region': region, 'wins': int(wins), 'losses': int(losses), 'winlossperc': float(winlossperc), 'gamesbehind': gamesbehind, 'pointsscoredpergame': float(pointspergame), 'pointsallowedpergame': float(pointsallowedpergame)}
    if name in playoffrank:
        newValue['playoffrank'] = playoffrank[name]
    thisYear['teams'].append(newValue)


def appData(thisYear, data, name):
    newdata = data.set_index('Team').to_dict(orient='index')
    newerdata = {}
    for key in newdata:
        if key.endswith("*"):
            newkey = key[:-1]
            newerdata[newkey] = newdata[key]
        else:
            newerdata[key] = newdata[key]
    for key in thisYear['teams']:
        key[name] = newerdata[key['team']]

data = []

lrre = re.compile(r"\d\d?")
scorere = re.compile(r"\d-\d")

allteamurls = []

for year in range(1984, 2016):
#for year in range(2015, 2016):
    print "Doing year " + str(year)
    url = "http://www.basketball-reference.com/leagues/NBA_" + str(year) + ".html"
    r = urllib.urlopen(url).read()

    soup = BeautifulSoup(r)

    es = soup.find("table", id="E_standings")
    ws = soup.find("table", id="W_standings")
    easts = es.find_all("tr", class_="full_table")
    wests = ws.find_all("tr", class_="full_table")

    po = soup.find("div", id="all_playoffs").find("table")
    pos = po.find_all("tr", class_="mobile_text")

    thisYear = {'year': year, 'teams': [], 'playoffs': []}
    
    playoffrank = {}

    maxplayoffrank = int(math.log(len(pos) + 1, 2)) + 1

    for playoff in pos:
        game = playoff.find("span").get_text()
        score = scorere.search(playoff.find("td").get_text()).group(0)
        winner = playoff.find_all("a")[0].get_text()        
        loser = playoff.find_all("a")[1].get_text()        
        if winner in playoffrank:
            playoffrank[winner] -= 1
        else:
            playoffrank[winner] = maxplayoffrank - 1
        if not (loser in playoffrank):
            playoffrank[loser] = maxplayoffrank
        thisYear['playoffs'].append({'game': game, 'winner': winner, 'loser': loser, 'score': score})

    for line in easts:
        scrapeline(line, "east", thisYear, playoffrank)

    for line in wests:
        scrapeline(line, "west", thisYear, playoffrank)

    data.append(thisYear)

    teampath = (datadir + "/leagues_NBA_" + str(year) + "_team.csv")
    opponentpath = (datadir + "/leagues_NBA_" + str(year) + "_opponent.csv")
    miscpath = (datadir + "/leagues_NBA_" + str(year) + "_misc.csv")
    shootingpath = (datadir + "/leagues_NBA_" + str(year) + "_shooting.csv")
    shooting_opppath = (datadir + "/leagues_NBA_" + str(year) + "_shooting_opp.csv")
    outpath = (datadir + "/out/" + str(year) + "_basic.csv")

    driver.get(url)
    try:
        element = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "all_standings")))
        time.sleep(4)
        driver.execute_script("sr_download_data('team')")
        driver.execute_script("sr_download_data('opponent')")
        driver.execute_script("sr_download_data('misc')")
        #driver.execute_script("sr_download_data('shooting')")
        #driver.execute_script("sr_download_data('shooting_opp')")
        while (not os.path.isfile(teampath) or (not os.path.isfile(opponentpath)) or (not os.path.isfile(miscpath)) 
                #or (not os.path.isfile(shootingpath)) or (not os.path.isfile(shooting_opppath))
                ):
            print "waiting"
            time.sleep(1)
    finally:
        driver.execute_script("return window.stop();")

    teamfile = pd.read_csv(teampath, skiprows=1)
    opponentfile = pd.read_csv(opponentpath, skiprows=1)
    miscfile = pd.read_csv(miscpath, skiprows=2)
    # shootingfile = pd.read_csv(shootingpath, skiprows=3)
    # shooting_oppfile = pd.read_csv(shooting_opppath, skiprows=3)

    appData(thisYear, teamfile, "info")
    appData(thisYear, opponentfile, "opponent")
    appData(thisYear, miscfile, "misc")
    # appData(thisYear, shootingfile, "shooting")
    # appData(thisYear, shooting_oppfile, "shooting_opponent")

with open('data.json', 'w') as jsonfile:
    json.dump(data, jsonfile, indent=4)

f = open('teamurls', 'w')
for teamurl in allteamurls:
    f.write(teamurl[0] + " http://www.basketball-reference.com" + teamurl[1] + "\n")
