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
    if soup.pubDate.string.find("Sun") != -1:
        return {"day": day,
        "foco": dailysoup[0].contents[0].string,
        "collis": "CLOSED",
        "hop": format_specials(dailysoup[2].contents)}
    elif soup.pubDate.string.find("Sat") != -1:
        return {"day": day,
            "foco": "NONE",
            "collis": "CLOSED",
            "hop": format_specials(dailysoup[0].contents)}
    else:
        return {"day": day,
        "foco": dailysoup[0].contents[1],
        "collis": format_specials(dailysoup[1].contents),
        "hop": format_specials(dailysoup[3].contents)}

def format_specials(content):
    special = ""
    for x in content:
        if x.string and x != '':
            special += x.string
        else:
            special += "\n"
    return special

dailies = get_daily_data(BASE_URL)
client = MongoClient(sys.argv[1])
db = client.heroku_hbblgh94
db.ddsdailies.drop()
result = db.ddsdailies.insert_one(dailies).inserted_id
