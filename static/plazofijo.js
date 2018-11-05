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

    let tasas = {30: 0.48, 45: 0.47, 60: 0.45};
    
    let capitalFinal = capitalInicial * (1 + tasas[30] * (plazo/365));
    let intereses = capitalFinal - capitalInicial;

    console.log(capitalFinal, intereses);
}