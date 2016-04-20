from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import os.path
import pandas as pd
import re
import json

def repslash(s):
    return s.replace("/","-")

yearregex = re.compile(r"\d\d\d\d")
teamregex = re.compile(r"teams/([A-Z][A-Z][A-Z])/")

datadir = os.getcwd() + '/teamdata'

profile = webdriver.FirefoxProfile()
profile.set_preference("webdriver.load.strategy", "unstable")
profile.set_preference("browser.download.folderList", 2)
profile.set_preference("browser.download.dir", datadir)
profile.set_preference("browser.helperApps.neverAsk.saveToDisk", 'text/csv')
driver = webdriver.Firefox(firefox_profile=profile)

f = open('teamurls', 'r')
for line in f:
    team = line.split(' ')[0]
    url = line.split(' ')[1]
    year = yearregex.search(url).group(0)
    teamalias = teamregex.search(url).group(1)

    print "Doing team " + team

    rosterpath = (datadir + "/teams_" + teamalias + "_" + year + "_roster.csv")
    advancedpath = (datadir + "/teams_" + teamalias + "_" + year + "_advanced.csv")
    totalspath = (datadir + "/teams_" + teamalias + "_" + year + "_totals.csv")
    pergamepath = (datadir + "/teams_" + teamalias + "_" + year + "_per_game.csv")
    perminutepath = (datadir + "/teams_" + teamalias + "_" + year + "_per_minute.csv")
    perposspath = (datadir + "/teams_" + teamalias + "_" + year + "_per_poss.csv")
    # shootingpath = (datadir + "/teams_" + teamalias + "_" + year + "_shooting.csv")
    # playoffstotalspath = (datadir + "/teams_" + teamalias + "_" + year + "_playoffs_totals.csv")
    # playoffspergamepath = (datadir + "/teams_" + teamalias + "_" + year + "_playoffs_per_game.csv")
    # playoffsperminutepath = (datadir + "/teams_" + teamalias + "_" + year + "_playoffs_per_minute.csv")
    # playoffsperposspath = (datadir + "/teams_" + teamalias + "_" + year + "_playoffs_per_poss.csv")
    # playoffsadvancedpath = (datadir + "/teams_" + teamalias + "_" + year + "_playoffs_advanced.csv")
    # playoffsshootingpath = (datadir + "/teams_" + teamalias + "_" + year + "_playoffs_shooting.csv")
    # salariespath = (datadir + "/teams_" + teamalias + "_" + year + "_salaries.csv")
    outpath = (datadir + "/out/" + year + "_" + repslash(team) + ".json")

    if (not (os.path.isfile(rosterpath) and os.path.isfile(advancedpath) and os.path.isfile(totalspath) and os.path.isfile(pergamepath) and os.path.isfile(perminutepath) and os.path.isfile(perposspath))):
        driver.get(url)
        try:
            element = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "all_roster")))
            time.sleep(10)
            driver.execute_script("sr_download_data('roster')")
            driver.execute_script("sr_download_data('advanced')")
            driver.execute_script("sr_download_data('totals')")
            driver.execute_script("sr_download_data('per_game')")
            driver.execute_script("sr_download_data('per_minute')")
            driver.execute_script("sr_download_data('per_poss')")
            # driver.execute_script("sr_download_data('shooting')")
            # driver.execute_script("sr_download_data('playoffs_totals')")
            # driver.execute_script("sr_download_data('playoffs_per_game')")
            # driver.execute_script("sr_download_data('playoffs_per_minute')")
            # driver.execute_script("sr_download_data('playoffs_per_poss')")
            # driver.execute_script("sr_download_data('playoffs_advanced')")
            # driver.execute_script("sr_download_data('playoffs_shooting')")
            # driver.execute_script("sr_download_data('salaries')")
            while (not os.path.isfile(rosterpath) or (not os.path.isfile(advancedpath))
                    or (not os.path.isfile(totalspath))
                    or (not os.path.isfile(pergamepath))
                    or (not os.path.isfile(perminutepath))
                    or (not os.path.isfile(perposspath))
                    # or (not os.path.isfile(shootingpath))
                    # or (not os.path.isfile(playoffstotalspath))
                    # or (not os.path.isfile(playoffspergamepath))
                    # or (not os.path.isfile(playoffsperminutepath))
                    # or (not os.path.isfile(playoffsperposspath))
                    # or (not os.path.isfile(playoffsadvancedpath))
                    # or (not os.path.isfile(playoffsshootingpath))
                    # or (not os.path.isfile(salariespath))
                        ):
                print "waiting"
                time.sleep(1)
        finally:
            driver.execute_script("return window.stop();")
        
    rosterfile = pd.read_csv(rosterpath, skiprows=1)
    advancedfile = pd.read_csv(advancedpath, skiprows=1).set_index('Player').to_dict(orient='index')
    totalsfile = pd.read_csv(totalspath, skiprows=1).set_index('Player').to_dict(orient='index')
    pergamefile = pd.read_csv(pergamepath, skiprows=1).set_index('Player').to_dict(orient='index')
    perminutefile = pd.read_csv(perminutepath, skiprows=1).set_index('Player').to_dict(orient='index')
    perpossfile = pd.read_csv(perposspath, skiprows=1).set_index('Player').to_dict(orient='index')
    # shootingfile = pd.read_csv(shootingpath, skiprows=3).set_index('Player').to_dict(orient='index')
    # playoffstotalsfile = pd.read_csv(playoffstotalspath, skiprows=1).set_index('Player').to_dict(orient='index')
    # playoffspergamefile = pd.read_csv(playoffspergamepath, skiprows=1).set_index('Player').to_dict(orient='index')
    # playoffsperminutefile = pd.read_csv(playoffsperminutepath, skiprows=1).set_index('Player').to_dict(orient='index')
    # playoffsperpossfile = pd.read_csv(playoffsperposspath, skiprows=1).set_index('Player').to_dict(orient='index')
    # playoffsadvancedfile = pd.read_csv(playoffsadvancedpath, skiprows=1).set_index('Player').to_dict(orient='index')
    # playoffsshootingfile = pd.read_csv(playoffsshootingpath, skiprows=3).set_index('Player').to_dict(orient='index')
    # salariesfile = pd.read_csv(salariespath, skiprows=1).set_index('Player').to_dict(orient='index')

    merged = rosterfile.to_dict(orient='records')
    for key in merged:
        try:
            key['advanced'] = advancedfile[key['Player']]
            key['totals'] = totalsfile[key['Player']]
            key['pergame'] = pergamefile[key['Player']]
            key['perminute'] = perminutefile[key['Player']]
            key['perposs'] = perpossfile[key['Player']]
            # key['shooting'] = shootingfile[key['Player']]
        except:
            print "Didn't find player " + key['Player']
        # try:
            # key['playoffstotals'] = playoffstotalsfile[key['Player']]
            # key['playoffspergame'] = playoffspergamefile[key['Player']]
            # key['playoffsperminute'] = playoffsperminutefile[key['Player']]
            # key['playoffsperposs'] = playoffsperpossfile[key['Player']]
            # key['playoffsavanced'] = playoffsavancedfile[key['Player']]
            # key['playoffsshooting'] = playoffsshootingfile[key['Player']]
        # except:
            # print key['Player'] + " not in playoffs"
        # try:
            # key['salary'] = salariesfile[key['Player']]
        # except:
            # print "No salary for " + key['Player']

    with open(outpath, 'w') as jsonfile:
        json.dump(merged, jsonfile, indent=4)

driver.close()
