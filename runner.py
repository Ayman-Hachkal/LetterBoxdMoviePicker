import asyncio
import json
from flask import Flask, jsonify, render_template, request
from markupsafe import escape

from main import getMovies


app = Flask(__name__)


@app.route("/")
def home():
    return render_template("mainpage.html")


@app.get("/getmoviedata")
def getmoviedata():
    username = request.args.get("username")
    if username:
        result, status = asyncio.run(getMovies(username))
        if result != None and status == 200:
            return jsonify(result)
        elif status == 429:
            return jsonify({"message": f"retry in {result[0]}"}), 429
        else:
            return jsonify({"status": "error", "message": "something went wrong"}), 400
    else:
        return jsonify({"status": "error", "message": "username is required"}), 400
