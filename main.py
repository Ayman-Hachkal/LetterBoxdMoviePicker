import asyncio
import time
from typing import Tuple
from bs4 import BeautifulSoup
import os
from dotenv import load_dotenv
from flask import jsonify
import requests
import httpx


async def getOMDBMovie(client, movie):
    load_dotenv()
    API_KEY = os.getenv("API_KEY")
    url_omdb = "http://www.omdbapi.com/"

    name, year = movie.rsplit(' ', 1)
    print(name)
    year = year.strip('(').strip(')')

    try: 
        response = await client.get(url_omdb, params={"apikey": API_KEY, "t": name, "y": year})
        return response.json() 
    except Exception as e:
        print(e)



async def getMovies(username : str) -> Tuple[list, int]:
    url = "https://letterboxd.com/"
    end_url = "/watchlist/"

    username = username.strip(' ')
    usernames = username.split(",")



    list_of_films = []
    omdb_list = []


    for u in usernames:
        full_url = url + u + end_url
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
                            film = poster("div")[0]["data-item-full-display-name"]
                            if film not in list_of_films:
                                list_of_films.append(film)

                    else:
                        print("Failed to fetch the page. ",  response.status_code)
                        if response.status_code == 429:
                            print("Retry in ", response.headers["Retry-After"])
                            return [response.headers["Retry-After"]], 429

            async with httpx.AsyncClient() as client:
                tasks = [getOMDBMovie(client, movie) for movie in list_of_films]

                omdb_list.append(await asyncio.gather(*tasks))

            

        else:
            print("Failed to fetch the page. ",  response.status_code)
            if response.status_code == 429:
                print("Retry in ", response.headers["Retry-After"])
                return [response.headers["Retry-After"]], 429


    return omdb_list, 200


