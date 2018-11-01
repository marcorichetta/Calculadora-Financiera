function calcular() {
    let capitalInicial = document.getElementById("capital").value;
    let plazoMensual = document.getElementById("plazo").value;

    if (capitalInicial > 100000) {
        alert("El capital inicial debe ser menor a $100000");
    }

    if (plazoMensual > 72){
        alert("El plazo debe ser menor a 72 meses");
    }

    let cuotaFija = obtenerCuotaFija(capitalInicial, plazoMensual);
//    let iva = (cuotaFija * 21)/100;
//    let sumaTotal = cuotaFija + iva;
    let ingresosNecesarios = cuotaFija * 3.33;

    let tasaNominal = obtenerTasa(plazoMensual) * 100;

    let tasaEfectiva = tasaNominal / plazoMensual;

    document.getElementById("ResultadoCapital").innerText = '$ ' + cuotaFija.toFixed(2);
//    document.getElementById("Iva").innerText = '$ ' + iva.toFixed(2);
//    document.getElementById("ResultadoIva").innerText = '$ ' + sumaTotal.toFixed(2);
    document.getElementById("Ingresos").innerText = '$ ' + ingresosNecesarios.toFixed(2);

    document.getElementById("TNA").innerText = tasaNominal.toFixed(2) + ' %';
    document.getElementById("TEM").innerText = tasaEfectiva.toFixed(2) + ' %';

    /**
     * Un array compuesto por [n] arrays con la información de cada cuota.
     */
    let registros = obtenerAmortizacion(cuotaFija.toFixed(2), plazoMensual, capitalInicial, tasaEfectiva);

    let tableBody = document.getElementById("cuerpoTabla");

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
function obtenerTasa(plazo) {
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
 * Tomo el capital y el plazo ingresados para calcular la cuota fija.
 * */ 
function obtenerCuotaFija(monto, plazo) {

    let tasaNominal = obtenerTasa();

    /**
     * TEA: La tasa efectiva anual (TEA) estipula la reinversión de los 
     * intereses ganados al renovar en este caso un Plazo Fijo.
     */
    let tasaEfectiva = tasaNominal / plazo;

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
 * @param tasa Tasa calculada en la función obtenerTasa()
 */
function obtenerAmortizacion(cuotaFija, plazo, monto, tasa) {
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

    return items;
}