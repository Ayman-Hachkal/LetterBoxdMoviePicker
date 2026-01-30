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
        result = getMovies(username)
        if result != None:
            return jsonify(result)
        else:
            return jsonify({"status": "error", "message": "username not found"}), 400
    else:
        return jsonify({"status": "error", "message": "username is required"}), 400
