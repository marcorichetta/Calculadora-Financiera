from cs50 import SQL
from flask import Flask, flash, render_template, request, jsonify, redirect, session

app = Flask(__name__)

app.secret_key = 'testing'
app.debug = True

db = SQL("postgres://rkxrmcrnyvxrwy:1a639286314b08504efd8290fc73caa0865f57eee66be1b35e65d91b05d4ac54@ec2-52-73-247-67.compute-1.amazonaws.com:5432/dd4chblvrjcpsc")

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

@app.route("/solicitudes")
def solicitudes():

    clientes = db.execute("SELECT dni, nombre, apellido FROM clientes")

    return render_template("solicitudes.html", clientes = clientes)

@app.route("/consultaPrestamos")
def consulta():

    # Consulta ajax para verificar existencia del usuario
    dni = request.args.get("cliente")

    # Guardo los prestamos
    # Formato de fecha -> https://www.tutorialspoint.com/sqlite/sqlite_date_time.htm

    prestamos = db.execute("SELECT capital, plazo, tasa, sistema, \
                            strftime('%d/%m/%Y %H:%M:%S',fechaSolicitud, 'localtime') as fechaSolicitud \
                            FROM prestamos \
                            WHERE dnicliente = :dni",
                            dni = dni)

    return jsonify(prestamos)

@app.route("/consultaPlazos")
def consultaPlazos():

    # Consulta ajax para verificar existencia del usuario
    dni = request.args.get("cliente")

    plazos = db.execute("SELECT capital, plazo, tasa, \
                        strftime('%d/%m/%Y %H:%M:%S',fechaSolicitud, 'localtime') as fechaSolicitud \
                        FROM plazos \
                        WHERE dnicliente = :dni",
                        dni = dni)

    return jsonify(plazos)

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
            db.execute("INSERT INTO clientes (dni, nombre, apellido, localidad, telefono, email) \
                        VALUES (:dni, :nombre, :apellido, :localidad, :telefono, :email)",
                        dni=dni,
                        nombre=nombre,
                        apellido=apellido,
                        localidad=localidad,
                        telefono=telefono,
                        email=email)

        # Tabla plazos tiene id autoincremental
        db.execute("INSERT INTO plazos (dnicliente, capital, plazo, tasa) \
                    VALUES (:dni, :capital, :plazo, :tasa)",
                    dni=dni,
                    capital=capital,
                    plazo=plazo,
                    tasa=tasa)

        # Sacamos los valores para el próximo cliente
        session.pop('valor', None)
        session.pop('existe', None)

        flash('¡La solicitud de plazo fijo fue enviada con éxito!')

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
            db.execute("INSERT INTO clientes (dni, nombre, apellido, localidad, telefono, email) \
                        VALUES (:dni, :nombre, :apellido, :localidad, :telefono, :email)",
                        dni=dni,
                        nombre=nombre,
                        apellido=apellido,
                        localidad=localidad,
                        telefono=telefono,
                        email=email)

        # Tabla prestamos tiene id autoincremental
        db.execute("INSERT INTO prestamos (dnicliente, capital, plazo, tasa, sistema) \
                    VALUES (:dni, :capital, :plazo, :tasa, :sistema)",
                    dni = dni,
                    capital = capital,
                    plazo = plazo,
                    tasa = tasa,
                    sistema = sistema)

        # Sacamos los valores para el próximo cliente
        session.pop('prestamo', None)
        session.pop('existe', None)

        flash('¡La solicitud de préstamo fue enviada con éxito!')

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
        session.pop('existe', None) # Saco el usuario que se cargó anteriormente
        return 'no'
    else:
        session['existe'] = 1 # Flag para existencia del usuario
        return jsonify(usuario)