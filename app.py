from cs50 import SQL
from flask import Flask, flash, render_template, request, jsonify, redirect

app = Flask(__name__)

app.secret_key = 'testing'

db = SQL("sqlite:///prueba.db")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/plazo", methods=['GET', 'POST'])
def plazo():
    """Solicitar un plazo fijo"""
    
    return render_template("plazo.html")

@app.route("/prestamo")
def prestamo():
    return render_template("prestamo.html")

@app.route("/solicitud", methods=['GET', 'POST'])
def solicitud():

    if request.method == "POST":
        nombre = request.form.get("nombre")
        apellido = request.form.get("apellido")
        localidad = request.form.get("localidad")
        telefono = request.form.get("telefono")
        email = request.form.get("email")

        # Data to be sent to database.
        userData = [nombre,apellido,localidad, telefono, email]
        print(userData)

        flash('El plazo fijo fue depositado con éxito')
        
        db.execute("INSERT INTO usuarios (usuario, telefono, domicilio, sueldo) VALUES (:usuario, :telefono, :domicilio, :sueldo)",
                    usuario=nombre,
                    telefono=telefono,
                    domicilio=localidad,
                    sueldo=45000)

        return redirect("/")
    else:

        # Tomo las variables de la url
        capital = request.args.get("capital")
        plazo = int(request.args.get("plazo"))
        
        # Calculo tasa para pasarle al template de la solicitud
        if (plazo < 45):
            tasa = 48
        elif (plazo < 60):
            tasa = 47
        else:
            tasa = 45
            
        valor = [capital, plazo, tasa]

        return render_template("solicitud.html", valor=valor)

@app.route("/obtenerTasa")
def obtenerTasa():
    
    # Consulta ajax para obtener la tasa en el calculo del plazo fijo
    dias = int(request.args.get("plazo"))
    
    if (dias < 45):
        tasa = 48
    elif (dias < 60):
        tasa = 47
    else:
        tasa = 45

    return jsonify(tasa)