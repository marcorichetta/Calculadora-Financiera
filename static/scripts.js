function calcular() {
    let monto = document.getElementById("capital").value;
    let plazo = document.getElementById("plazo").value;

    if (monto > 100000) {
        alert("El monto debe ser menor a $100000");
    }

    if (plazo > 72){
        alert("El plazo debe ser menor a 72 meses");
    }

    document.getElementById("ResultadoCapital").innerText = cuotaFija();

}

function cuotaFija() {
    let monto = document.getElementById("capital").value;
    let plazo = document.getElementById("plazo").value;

    let tna = 0.15;
    let tem = tna / plazo;

    let potencia = Math.pow(1 + tem, 12);

    let cuota = monto * ((tem * potencia / ( potencia - 1 )));

    cuota = Math.fround();
    
    Math.fround(cuota)
    return cuota;
}