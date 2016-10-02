from bs4 import BeautifulSoup
from urllib2 import urlopen
from pymongo import MongoClient
import sys

BASE_URL = "http://www.dartmouth.edu/dining/menus/feed/"

def get_daily_data(section_url):
    xml = urlopen(section_url).read()
    soup = BeautifulSoup(xml, "lxml-xml")
    day = soup.item.title.string
    html = soup.item.description.string
    dailysoup = BeautifulSoup(html, "lxml").find_all('p')
    if soup.pubDate.find("Sun") != -1:
        return {"day": day,
        "foco": dailysoup[0].contents[0].string,
        "collis": "CLOSED",
        "hop": "Lunch Special: " + dailysoup[2].contents[1] +
            "\nDinner Special: " + dailysoup[2].contents[5] +
            "\nSoups: " + dailysoup[2].contents[8] +
            "\nBurger Special: " + dailysoup[2].contents[12]}
#    else if soup.pubDate.find("Sat") != -1:
        #Saturday
    else:
         return {"day": day,
            "foco": dailysoup[0].contents[1],
            "collis": "Lunch special: " + dailysoup[1].contents[1] +
                "\n and Soups: " + dailysoup[1].contents[4],
            "hop": "Lunch Special:" + dailysoup[2].contents[1] +
                "\nDinner Special:" + dailysoup[2].contents[4] +
                "\nSoups:" + dailysoup[2].contents[7] +
                "\nBurger Special:" + dailysoup[2].contents[10]}

print "hi"
dailies = get_daily_data(BASE_URL)
print "scraped"
client = MongoClient(sys.argv[1])
db = client.heroku_hbblgh94
db.ddsdailies.drop()
result = db.ddsdailies.insert_one(dailies).inserted_id
print result
