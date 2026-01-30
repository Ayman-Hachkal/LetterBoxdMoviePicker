import random
from bs4 import BeautifulSoup
import os
from dotenv import load_dotenv
import requests



def getMovies(username : str):
    url = "https://letterboxd.com/"
    end_url = "/watchlist/"

    full_url = url + username + end_url

    load_dotenv()
    API_KEY = os.getenv("API_KEY")

    url_omdb = "http://www.omdbapi.com/"
    list_of_films = []
    omdb_list = []

    response = requests.get(full_url)

    if response.status_code == 200:
        html_content = response.text
        soup = BeautifulSoup(html_content, "lxml")
        list_films = soup.find_all("li", class_="griditem")
        page_list = soup.find_all("li", class_="paginate-page")
        for poster in list_films:
            list_of_films.append(poster("div")[0]["data-item-full-display-name"])


        for pages in page_list:
            a = pages.find("a")
            if a != None:
                print(a.get("href"))
                full_url = url + str(a.get("href"))

                response = requests.get(full_url)
                
                if response.status_code == 200:
                    html_content = response.text
                    soup = BeautifulSoup(html_content, "lxml")
                    list_films = soup.find_all("li", class_="griditem")
                    for poster in list_films:
                        list_of_films.append(poster("div")[0]["data-item-full-display-name"])

        for i in list_of_films:
            name, year = i.rsplit(' ', 1)
            print(name)
            year = year.strip('(').strip(')')
            params = {
                "apikey": API_KEY,
                "t": name,
                "y": year,
                    }
            response = requests.get(url_omdb, params=params)
            if response.status_code == 200:
                omdb_list.append(response.json())

            else:
                print("Time out")
        return omdb_list
            

    else:
        print("Failed to fetch the page. ",  response.status_code)
        if response.status_code == 429:
            print("Retry in ", response.headers["Retry-After"])


