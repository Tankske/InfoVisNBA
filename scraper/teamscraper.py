from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import os.path
import pandas as pd
import re

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
    outpath = (datadir + "/out/" + year + "_" + repslash(team) + ".csv")

    driver.get(url)
    try:
        element = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "all_roster")))
        time.sleep(4)
        driver.execute_script("sr_download_data('roster')")
        driver.execute_script("sr_download_data('advanced')")
        while (not os.path.isfile(rosterpath) or (not os.path.isfile(advancedpath))):
            print "waiting"
            time.sleep(1)
    finally:
        driver.execute_script("return window.stop();")
        
    rosterfile = pd.read_csv(rosterpath, skiprows=1, usecols=['Player', 'No.', 'Pos'])
    advancedfile = pd.read_csv(advancedpath, skiprows=1, usecols=['Player', 'PER'])
    merged = rosterfile.merge(advancedfile, on='Player')

    merged.to_csv(outpath, index=False)

driver.close()
