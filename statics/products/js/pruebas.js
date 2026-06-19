const quoteTemplate = document.getElementById("quote-template").content;
const quoteContainer = document.getElementById("cotizaciones");
const quote = document.querySelector(".inf3");
const btnDownload = document.getElementById("quote-download");
let producsIds = [];

btnDownload.addEventListener('click', ()=>{
    productsToquote.forEach(id => {
        fetch(`${window.location.origin}/products/cotizacion`,{
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify([{
            'product_id': id
            }]),
        })
        .then((response) => response.json())
        .then(async (quotation) =>{
            fetch(`${window.location.origin}/products/pdf`,{
                method: 'POST',
                headers: {"Content-Type":"application/json"},
                body:JSON.stringify(quotation)
            }).then(response => response.blob())
            .then((pdf) => {
                const url = URL.createObjectURL(pdf);
                const newWindow = window.open(url);
                newWindow.location = url;
                btnDownload.href = url;
                // btnDownload.click();
                // console.log("downloaded");
            })
            .catch((err) => {console.log(err);})
        })
        .catch((error) => {console.log(error);})
    });

})



// functions------

function addToQuote(product) {
    const clone = document.importNode(quoteTemplate, true);

    clone.querySelector(".inf2").id = "_"+product.id;
    clone.querySelector(".eliminar-unitario").addEventListener('click',()=>delFromProducts(product.id))
    clone.querySelector("#nombre").textContent = product.name;
    clone.querySelector("#precio_articulo").textContent = "$"+formatearNumero(product.price).toString();
    clone.querySelector("#consumo_hora").textContent = product.consume;
    // clone.querySelector("#horas_uso").textContent = ; this one is added in makeQuote
    // clone.querySelector("#consumo_dia").textContent = product.consume;
    

    quoteContainer.appendChild(clone);
    productsToquote.push(product.id);
    makeQuote()
}

function delFromProducts(id) {
    productsToquote = productsToquote.filter((value) => value != id);
    quoteContainer.querySelector(`#_${id}`).remove();
    makeQuote();
}

async function makeQuote() {
    let quoteReturn;
    productsToquote.forEach(id => {
        fetch(`${window.location.origin}/products/cotizacion`,{
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify([{
            'product_id': id
            }]),
        })
        .then((response) => response.json())
        .then(async (quotation) =>{
            quoteReturn = quotation;
            quoteContainer.querySelector(`#_${id}`).querySelector("#horas_uso").textContent = quotation.consumptions[0].hours_used
            quoteContainer.querySelector(`#_${id}`).querySelector("#horas_sol").textContent = quotation.productions[0].sun_hours
            quoteContainer.querySelector(`#_${id}`).querySelector("#consumo_dia").textContent = quotation.consumptions[0].consumption_day
            quoteContainer.querySelector(`#_${id}`).querySelector("#porcentaje_perdidas").textContent = "%"+ quotation.consumptions[0].loss_percentage.toString()
            quoteContainer.querySelector(`#_${id}`).querySelector("#cantidad_consumo").textContent = quotation.consumptions[0].total_consumption

            const base = window.location.origin;
            const panel = await fetch(`${base}/products/panel/${quotation.panels_needed[0].id}`).then(response=>response.json()).then(panel => panel.panel);
            const regulator = await fetch(`${base}/products/regulator/${quotation.regulators_needed[0].id}`).then(response=>response.json()).then(regulator => regulator.regulator);
            const battery = await fetch(`${base}/products/battery/${quotation.batteries_needed[0].id}`).then(response=>response.json()).then(battery => battery.battery);
            const breaker = await fetch(`${base}/products/breaker/${quotation.breakers_needed[0].id}`).then(response=>response.json()).then(breaker => breaker.breaker);
    
            // console.log(quotation);
            quote.querySelector("#paneles_requeridos").textContent = quotation.panels_needed[0].amount;
            quote.querySelector("#paneles_tipo").textContent = panel.name;
            quote.querySelector("#paneles_precio").textContent = "$ "+formatearNumero(panel.price);
            
            quote.querySelector("#reguladores_requeridos").textContent = quotation.regulators_needed[0].amount;
            quote.querySelector("#reguladores_tipo").textContent = regulator.name;
            quote.querySelector("#reguladores_precio").textContent = "$ "+formatearNumero(regulator.price);
            
            quote.querySelector("#baterias_requeridos").textContent = quotation.batteries_needed[0].amount;
            quote.querySelector("#baterias_tipo").textContent = battery.name;
            quote.querySelector("#baterias_precio").textContent = "$ "+formatearNumero(battery.price);
            
            quote.querySelector("#breakers_requeridos").textContent = quotation.breakers_needed[0].amount;
            quote.querySelector("#breakers_tipo").textContent = breaker.name;
            quote.querySelector("#breakers_precio").textContent = "$ "+formatearNumero(breaker.price);
            
            quote.querySelector("#precio_acumulado").textContent = "$ "+formatearNumero(
                breaker.price+
                regulator.price+
                panel.price+
                battery.price
                );
            return quoteReturn
        })
        .catch((error) => {
            console.log(error);
        })
    });

    if (productsToquote.length < 1) {
        quote.querySelector("#paneles_requeridos").textContent = "-";
            quote.querySelector("#paneles_tipo").textContent = "-";
            quote.querySelector("#paneles_precio").textContent = "-";
            
            quote.querySelector("#reguladores_requeridos").textContent = "-";
            quote.querySelector("#reguladores_tipo").textContent = "-";
            quote.querySelector("#reguladores_precio").textContent = "-";
            
            quote.querySelector("#baterias_requeridos").textContent = "-";
            quote.querySelector("#baterias_tipo").textContent = "-";
            quote.querySelector("#baterias_precio").textContent = "-";
            
            quote.querySelector("#breakers_requeridos").textContent = "-";
            quote.querySelector("#breakers_tipo").textContent = "-";
            quote.querySelector("#breakers_precio").textContent = "-";

            quote.querySelector("#precio_acumulado").textContent = "-";
        }
    
}

// Funciones auxiliares ----------------------------------------
function formatearNumero(numero, lenguaje = "es") {
    // Crear un objeto Intl.NumberFormat con el lenguaje y las opciones deseadas
    let formateador = new Intl.NumberFormat(lenguaje, {
      useGrouping: true, // Usar agrupación de miles
      minimumFractionDigits: 0, // No mostrar decimales
      maximumFractionDigits: 0 // No mostrar decimales
    });
    // Devolver el número formateado como una cadena
    return formateador.format(numero);
  }