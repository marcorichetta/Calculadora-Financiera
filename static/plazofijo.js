function calcularPlazo() {
    let capitalInicial = document.getElementById("capital").value;
    let plazo = document.getElementById("plazo").value;

    if (!capitalInicial || !plazo) {
        alert("Por favor ingrese los datos solicitados.");
        throw new Error("Por favor ingrese los datos solicitados")
    }

    if (capitalInicial > 100000) {
        alert("El capital inicial debe ser menor a $100000");
        throw new Error("El capital inicial debe ser menor a $100000");
    }

    if (plazo > 365){
        alert("El plazo debe ser menor a 365 días");
        throw new Error("El plazo debe ser menor a 72 meses");
    }

    let tasaAnual;

    /**Solicitud al servidor para obtener las tasas.
     * Notese el 'async:false' para evitar que se realicen 
     * los cálculos sin obtener las tasas.
     */
    $.ajax({
        url: "/obtenerTasa",
        method: "GET",
        async: false,
        data: {
            plazo: plazo
        }
    }) 
        .done(function(tasa) {
        tasaAnual = tasa;
    });

    tasaAnual /= 100;
     
    let capitalFinal = capitalInicial * (1 + tasaAnual * (plazo/365));
    let intereses = capitalFinal - capitalInicial;

    let fechaActual = new Date();
    let milliseconds = plazo * 86400000;
    let tempVariable = fechaActual.getTime() + milliseconds;

    let fechaVencimiento = new Date(tempVariable);

    document.getElementById("Intereses").innerText = '$ ' + intereses.toFixed(2);
    document.getElementById("Resultado").innerText = '$ ' + capitalFinal.toFixed(2);
    document.getElementById("Vencimiento").innerText = fechaVencimiento.toLocaleDateString();
    document.getElementById("TNA").innerText = tasaAnual*100 + ' %';
}