from cs50 import SQL
from flask import Flask, flash, render_template, request, jsonify, redirect, session, escape
#from flask_basicauth import BasicAuth

from helpers import check_auth, authenticate, requires_auth

app = Flask(__name__)

app.secret_key = 'testing'

app.config['BASIC_AUTH_USERNAME'] = 'root'
app.config['BASIC_AUTH_PASSWORD'] = '1234'

#basic_auth = BasicAuth(app)

db = SQL("sqlite:///prueba.db")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/plazo", methods=['GET', 'POST'])
def plazo():
    """Calcular un plazo fijo"""
    
    return render_template("plazo.html")

@app.route("/prestamo")
def prestamo():
    """Calcular un préstamo"""

    return render_template("prestamo.html")

@app.route("/admin")
@requires_auth
def admin():
    
    session["admin"] = 1

    return render_template("admin.html")

@app.route("/logout")
def logout():

    session.pop("admin", None)
    
    return redirect("/")

@app.route("/solicitud", methods=['GET', 'POST'])
def solicitud():
    """Solicitar un Plazo Fijo"""

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

        # Check para evitar insert de usuario existente
        if not('existe' in session):
            print('Insertando...')
            # Inserto los datos del cliente
            db.execute("INSERT INTO clientes (dni, nombre, apellido, localidad, telefono, email) VALUES (:dni, :nombre, :apellido, :localidad, :telefono, :email)",
                    dni=dni,
                    nombre=nombre,
                    apellido=apellido,
                    localidad=localidad,
                    telefono=telefono,
                    email=email)

        # Tabla plazos tiene id autoincremental
        db.execute("INSERT INTO plazos (dnicliente, capital, plazo, tasa) VALUES (:dni, :capital, :plazo, :tasa)",
                                dni=dni,
                                capital=capital,
                                plazo=plazo,
                                tasa=tasa)

        # Sacamos los valores para el próximo cliente
        session.pop('valor', None)
        session.pop('existe', None)

        flash('¡El plazo fijo fue depositado con éxito!')        

        return redirect("/")
    else:

        # Tomo las variables de la url
        capital = request.args.get("capital")
        plazo = int(request.args.get("plazo"))
        
        # Calculo la tasa para pasarle al template de la solicitud
        result = db.execute("SELECT tasa FROM tasasPF WHERE dias >= :plazo",
                plazo = plazo)

        # Guardo el primer resultado
        tasa = result[0]['tasa']
        
        valor = [capital, plazo, tasa]

        # Guardo variables para usarlas después en el POST del formulario.
        session['valor'] = valor

        return render_template("solicitud.html", valor=valor)

@app.route("/solicitudPrestamo", methods=['GET', 'POST'])
def solicitudPrestamo():
    """Solicitar un Préstamo"""

    if request.method == "POST":
        dni = request.form.get("dni")
        nombre = request.form.get("nombre")
        apellido = request.form.get("apellido")
        localidad = request.form.get("localidad")
        telefono = request.form.get("telefono")
        email = request.form.get("email")

        # Accedo al valor del plazo fijo con session
        # Ver más en http://flask.pocoo.org/docs/1.0/quickstart/#sessions
        capital = session['prestamo'][0]
        plazo = session['prestamo'][1]
        tasa = session['prestamo'][2]
        sistema = session['prestamo'][3]

        # Check para evitar insert de usuario existente
        if not('existe' in session):
            print('Insertando...')
            # Inserto los datos del cliente
            db.execute("INSERT INTO clientes (dni, nombre, apellido, localidad, telefono, email) VALUES (:dni, :nombre, :apellido, :localidad, :telefono, :email)",
                    dni=dni,
                    nombre=nombre,
                    apellido=apellido,
                    localidad=localidad,
                    telefono=telefono,
                    email=email)

        # Tabla prestamos tiene id autoincremental
        db.execute("INSERT INTO prestamos (dnicliente, capital, plazo, tasa, sistema) VALUES (:dni, :capital, :plazo, :tasa, :sistema)",
                    dni = dni,
                    capital = capital,
                    plazo = plazo,
                    tasa = tasa,
                    sistema = sistema)

        # Sacamos los valores para el próximo cliente
        session.pop('prestamo', None)
        session.pop('existe', None)

        flash('¡El préstamo fue solicitado con éxito!')

        return redirect("/")
    else:
        
        # Tomo variables de la url
        capital = request.args.get("capital")
        plazo = int(request.args.get("plazo"))
        sistema = request.args.get("sistema")

        result = db.execute("SELECT tasa FROM tasasPrest WHERE meses >= :plazo", 
                            plazo = plazo)

        # Guardo el primer resultado
        tasa = result[0]['tasa']

        prestamo = [capital, plazo, tasa, sistema]

        # Guardo los datos del prestamo en una session para usar en el POST
        session['prestamo'] = prestamo

        return render_template("solicitudPrestamo.html", prestamo=prestamo)

@app.route("/obtenerTasa")
def obtenerTasa():
    
    # Consulta ajax para obtener la tasa en el calculo del plazo fijo
    dias = int(request.args.get("plazo"))
    
    result = db.execute("SELECT tasa FROM tasasPF WHERE dias >= :dias",
                    dias = dias)

    # Guardo el primer resultado    
    tasa = result[0]['tasa']

    return jsonify(tasa)

# Consultar tasas para préstamo
# Ver GET para obtener y POST para UPDATE en DB.
@app.route("/obtenerTasaPrestamo")
def obtenerTasaPrestamo():

    # Consulta ajax para obtener la tasa en el calculo del préstamo
    meses = int(request.args.get("plazo"))

    result = db.execute("SELECT tasa FROM tasasPrest WHERE meses >= :meses",
                        meses = meses)

    # Guardo el primer resultado
    tasa = result[0]['tasa']
    
    return jsonify(tasa)

@app.route("/consultaUser")
def consultaUser():

    # Consulta ajax para verificar existencia del usuario
    dni = request.args.get("dni")

    # Guardo la row del usuario
    usuario = db.execute("SELECT * FROM clientes WHERE dni = :dni",
                        dni = dni)

    if len(usuario) == 0: # Ningun usuario encontrado
        return 'no'
    else:
        session['existe'] = 1 # Flag para existencia del usuario
        return jsonify(usuario)