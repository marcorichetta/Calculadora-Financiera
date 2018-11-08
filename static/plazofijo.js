function calcularPlazo() {
    let capitalInicial = document.getElementById("capital").value;
    let plazo = document.getElementById("plazo").value;

    if (capitalInicial > 100000) {
        alert("El capital inicial debe ser menor a $100000");
        throw new Error("El capital inicial debe ser menor a $100000");
    }

    if (plazo > 72){
        alert("El plazo debe ser menor a 72 meses");
        throw new Error("El plazo debe ser menor a 72 meses");
    }

    let tasaAnual;

    if (plazo < 45) {
        tasaAnual = 0.48;
    } else if (plazo < 60) {
        tasaAnual = 0.47        
    } else {
        tasaAnual = 0.45
    }

    let capitalFinal = capitalInicial * (1 + tasaAnual * (plazo/365));
    let intereses = capitalFinal - capitalInicial;

    document.getElementById("Intereses").innerText = '$ ' + intereses.toFixed(2);
    document.getElementById("Resultado").innerText = '$ ' + capitalFinal.toFixed(2);
    document.getElementById("TNA").innerText = tasaAnual*100 + ' %';
}