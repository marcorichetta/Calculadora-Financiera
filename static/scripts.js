function calcular() {
    let monto = document.getElementById("capital").value;
    let plazo = document.getElementById("plazo").value;

    for (let i = 0; i < plazo; i++) {
        let cuota = i;
        console.log((monto/12)*i);
    }
}