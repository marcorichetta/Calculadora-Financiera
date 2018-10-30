function calcular() {
    let capitalInicial = document.getElementById("capital").value;
    let plazoMensual = document.getElementById("plazo").value;

    if (capitalInicial > 100000) {
        alert("El capitalInicial debe ser menor a $100000");
    }

    if (plazoMensual > 72){
        alert("El plazo debe ser menor a 72 meses");
    }

    let cuotaFija = obtenerCuotaFija();
    let iva = (cuotaFija * 21)/100;
    let sumaTotal = cuotaFija + iva;
    let ingresosNecesarios = sumaTotal * 3.33;

    let tasaNominal = obtenerTasa() * 100;
    let tasaEfectiva = tasaNominal / plazoMensual;

    document.getElementById("ResultadoCapital").innerText = '$ ' + cuotaFija.toFixed(2);
    document.getElementById("Iva").innerText = '$ ' + iva.toFixed(2);
    document.getElementById("ResultadoIva").innerText = '$ ' + sumaTotal.toFixed(2);
    document.getElementById("Ingresos").innerText = '$ ' + ingresosNecesarios.toFixed(2);

    document.getElementById("TNA").innerText = tasaNominal.toFixed(2) + ' %';
    document.getElementById("TEM").innerText = tasaEfectiva.toFixed(2) + ' %';
}
/*  Uso una función para obtener las tasas.
    También uso una para setear este valor.
*/
function obtenerTasa() {
    /**
     * TNA: La tasa nominal anual (TNA) es el interés que nos pagan de manera
     * anual (por un período de 12 meses) al colocar nuestro dinero en algún 
     * instrumento financiero.
     */
    let tasaNominal = 0.56; // 0.17 === 17 %

    return tasaNominal;
}

// Tomo el capital y el plazo ingresados para calcular la cuota fija
function obtenerCuotaFija() {
    let capitalInicial = document.getElementById("capital").value;
    let plazoMensual = document.getElementById("plazo").value;

    let tasaNominal = obtenerTasa();

    /**
     * TEA: La tasa efectiva anual (TEA) estipula la reinversión de los 
     * intereses ganados al renovar en este caso un Plazo Fijo.
     */
    let tasaEfectiva = tasaNominal / plazoMensual;

    /**
     * Guarda el resultado de (1+i)^n siendo n el plazo
     */
    let potencia = Math.pow(1 + tasaEfectiva, plazoMensual);

    /**
     * Fórmula de Interes - Sistema Francés
     * 
     * C = S.[ {i. {(1+i)} ^ {n}} / {{(1+i)} ^ {n} -1} ]
     */
    let cuotaFija = capitalInicial * ((tasaEfectiva * potencia / ( potencia - 1 )));

    return cuotaFija;
}