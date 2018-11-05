function calcularAmort() {
    let capitalInicial = document.getElementById("capital").value;
    let plazoMensual = document.getElementById("plazo").value;
    let sistemaAmort = document.getElementById("sistema").value;

    if (capitalInicial > 100000) {
        alert("El capital inicial debe ser menor a $100000");
        throw new Error("El capital inicial debe ser menor a $100000");
    }

    if (plazoMensual > 72){
        alert("El plazo debe ser menor a 72 meses");
        throw new Error("El plazo debe ser menor a 72 meses");
    }

    /**
    * Un array compuesto por [n] arrays con la información de cada cuota.
    */
    let registros;
    let cuota;

    let tasaNominal = obtenerTasaNominal(plazoMensual) * 100;

    let tasaEfectiva = tasaNominal / 12;
    
    if (sistemaAmort == 1){ // Sistema Francés
        cuota = obtenerCuotaFija(capitalInicial, plazoMensual);
        registros = amortFrances(cuota.toFixed(2), plazoMensual, capitalInicial, tasaEfectiva);
        document.getElementById("ResultadoCapital").innerText = '$ ' + cuota.toFixed(2);
    } else 
    if (sistemaAmort == 2){ // Sistema Alemán
        registros = amortAleman(plazoMensual, capitalInicial, tasaEfectiva);
        cuota = registros[0][3]; // Saco la cuota del primer registro. (Risky)
        document.getElementById("ResultadoCapital").innerText = '$ ' + cuota;
    }

//    let iva = (cuota * 21)/100;
//    let sumaTotal = cuota + iva;
    let ingresosNecesarios = cuota * 6.66;
    
    // Calculo la fecha actual y le sumo un mes para el próximo pago.
    let fechaPago = new Date();
    // Workaround para fin de año.
    let mes = fechaPago.getMonth()
    if (mes == 11){
        mes = 1;
    } else {
        mes += 1;
    }
    fechaPago.setMonth(mes);

    document.getElementById("Fecha").innerText = fechaPago.toLocaleDateString();
//    document.getElementById("ResultadoCapital").innerText = '$ ' + cuota.toFixed(2);
//    document.getElementById("Iva").innerText = '$ ' + iva.toFixed(2);
//    document.getElementById("ResultadoIva").innerText = '$ ' + sumaTotal.toFixed(2);
    document.getElementById("Ingresos").innerText = '$ ' + ingresosNecesarios.toFixed(2);
    document.getElementById("TNA").innerText = tasaNominal.toFixed(2) + ' %';
    document.getElementById("TEM").innerText = tasaEfectiva.toFixed(2) + ' %';


    let tableBody = document.getElementById("cuerpoTabla");
    tableBody.innerHTML = "";

    // Llenamos la tabla con los registros calculados
    for (let i = 0; i < registros.length; i++) {
        const registro = registros[i];
        fila = document.createElement("tr");
        for (let k = 0; k < registro.length; k++) {
            let valor = registro[k];
            
            if (k > 0){ // Excluímos el número de cuota
                valor = '$' + valor
            }
            td = document.createElement("td");
            celda = document.createTextNode(valor);
            td.appendChild(celda);
            fila.appendChild(td);
        }
        tableBody.appendChild(fila);
    }
}

/**
 * Según el plazo varía la tasa obtenida.
 */
function obtenerTasaNominal(plazo) {
    /**
     * TNA: La tasa nominal anual (TNA) es el interés que nos pagan de manera
     * anual (por un período de 12 meses) al colocar nuestro dinero en algún 
     * instrumento financiero.
     */
    let tasaNominal; // 0.17 === 17 %

    if (plazo > 36) {
        tasaNominal = 0.56;
    } else {
        tasaNominal = 0.75
    }

    return tasaNominal;
}

/**
 * Tomo el capital y el plazo ingresados para calcular la cuota utilizada en el sistema francés.
 * */ 
function obtenerCuotaFija(monto, plazo) {

    let tasaNominal = obtenerTasaNominal(plazo);

    /**
     * TEA: La tasa efectiva anual (TEA) estipula la reinversión de los 
     * intereses ganados al renovar en este caso un Plazo Fijo.
     */
    let tasaEfectiva = tasaNominal / 12;

    /**
     * Guarda el resultado de (1+i)^n siendo n el plazo
     */
    let potencia = Math.pow(1 + tasaEfectiva, plazo);

    /**
     * Fórmula de Interes - Sistema Francés
     * 
     * C = S.[ {i. {(1+i)} ^ {n}} / {{(1+i)} ^ {n} -1} ]
     */
    let cuota = monto * ((tasaEfectiva * potencia / ( potencia - 1 )));

    return cuota;
}

/**
 * Obtengo un array con n arrays con los datos de cada cuota a pagar según sistema Francés.
 * @param cuotaFija Cuota calculada en función obtenerCuotaFija()
 * @param plazo Determina cantidad de registros
 * @param monto Saldo inicial
 * @param tasa Tasa calculada en la función obtenerTasaNominal()
 */
function amortFrances(cuotaFija, plazo, monto, tasa) {
    let items = [];
    
    for (let i = 1; i <= plazo; i++) {
        let interes = monto * (tasa / 100);
        let amortizacion = cuotaFija - interes;
        monto -= amortizacion;

        interes = interes.toFixed(2);
        amortizacion = amortizacion.toFixed(2);
        monto = monto.toFixed(2);

        item = [i, interes, amortizacion, cuotaFija, monto];

        items.push(item);
    }
    
    // Actualizamos caption de la tabla.
    document.getElementById("descripcion").innerText = 'Sistema Francés'
    return items;
}

/**
 * Obtengo un array con n arrays con los datos de cada cuota a pagar según sistema Alemán.
 * @param plazo Determina cantidad de registros
 * @param monto Saldo inicial
 * @param tasa Tasa calculada en la función obtenerTasaNominal()
 */
function amortAleman(plazo, monto, tasa) {
    let items = [];
    let amortizacionFija = monto / plazo;
    
    for (let i = 1; i <= plazo; i++) {
        let interes = monto * (tasa/100);
        let cuota = amortizacionFija + interes;
        monto -= amortizacionFija;

        interes = interes.toFixed(2);
        cuota = cuota.toFixed(2);
        monto = monto.toFixed(2);

        item = [i, interes, amortizacionFija.toFixed(2), cuota, monto];

        items.push(item);
    }
 
    // Actualizamos caption de la tabla.
    document.getElementById("descripcion").innerText = 'Sistema Alemán'
    return items;
}