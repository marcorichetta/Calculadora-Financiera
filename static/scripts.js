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
    let iva = (cuotaFija * 21)/100;
    let sumaTotal = cuotaFija + iva;
    let ingresosNecesarios = sumaTotal * 3.33;

    let tasaNominal = obtenerTasa(plazoMensual) * 100;

    let tasaEfectiva = tasaNominal / plazoMensual;

    document.getElementById("ResultadoCapital").innerText = '$ ' + cuotaFija.toFixed(2);
    document.getElementById("Iva").innerText = '$ ' + iva.toFixed(2);
    document.getElementById("ResultadoIva").innerText = '$ ' + sumaTotal.toFixed(2);
    document.getElementById("Ingresos").innerText = '$ ' + ingresosNecesarios.toFixed(2);

    document.getElementById("TNA").innerText = tasaNominal.toFixed(2) + ' %';
    document.getElementById("TEM").innerText = tasaEfectiva.toFixed(2) + ' %';
}
/**
 * Uso una función para obtener las tasas.
 * Debería usar una para fijar este valor también.
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
 * Tomo el capital y el plazo ingresados para calcular la cuota fija
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

function obtenerAmortizacion(cuotaFija, plazo, monto, tasa) {
    let items = [];
    
    for (let i = 1; i <= plazo; i++) {
        let interes = monto * tasa;
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