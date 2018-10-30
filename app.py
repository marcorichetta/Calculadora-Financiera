from cs50 import sql
from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/plazo")
def plazo():
    return render_template("plazo.html")

@app.route("/prestamo")
def prestamo():
    return render_template("prestamo.html")
