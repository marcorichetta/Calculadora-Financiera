from cs50 import SQL
from flask import Flask, flash, render_template, request, jsonify, redirect, session, escape

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
        dni = request.form.get("dni")
        nombre = request.form.get("nombre")
        apellido = request.form.get("apellido")
        localidad = request.form.get("localidad")
        telefono = request.form.get("telefono")
        email = request.form.get("email")
        
        # Accedo al valor del plazo fijo con session
        # Ver más en http://flask.pocoo.org/docs/1.0/quickstart/#sessions
        capital = session['valor'][0]
        plazo = session['valor'][1]
        tasa = session['valor'][2]

        # Tabla plazos tiene id autoincremental
        db.execute("INSERT INTO plazos (dnicliente, capital, plazo, tasa) VALUES (:dni, :capital, :plazo, :tasa)",
                                dni=dni,
                                capital=capital,
                                plazo=plazo,
                                tasa=tasa)

        print(session)
        # Check para no agregar dos usuarios iguales 
        if not('existe' in session):
            print('NO EXISTE!')
            # Inserto los datos del cliente
            db.execute("INSERT INTO clientes (dni, nombre, apellido, localidad, telefono, email) VALUES (:dni, :nombre, :apellido, :localidad, :telefono, :email)",
                    dni=dni,
                    nombre=nombre,
                    apellido=apellido,
                    localidad=localidad,
                    telefono=telefono,
                    email=email)

        # Sacamos los valores para el próximo cliente
        session.pop('valor', None)
        session.pop('existe', None)

        flash('El plazo fijo fue depositado con éxito')        

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

        session['valor'] = valor

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

@app.route("/consultaUser")
def consultaUser():

    # Consulta ajax para verificar existencia del usuario
    dni = request.args.get("dni")

    # Guardo la row del usuario
    usuario = db.execute("SELECT * FROM clientes WHERE dni = :dni",
                        dni = dni)

    if len(usuario) == 0:
        return 'no'
    else:
        session['existe'] = 1
        return jsonify(usuario)