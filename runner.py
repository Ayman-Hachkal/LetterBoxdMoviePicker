import json
from flask import Flask, jsonify, render_template 
from markupsafe import escape


app = Flask(__name__) 

@app.route('/')
def home():
    return render_template("mainpage.html")

@app.route("/<username>")  # pyright: ignore[reportArgumentType]
def getmoviedata(username):
    return jsonify({"username": "happy"})
