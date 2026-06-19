const inputs = document.querySelectorAll(".horas-sol-producto");
const quoteTemplate = document.getElementById("quote-template").content;
const quoteContainer = document.querySelector(".acumulador-cotizador");
let contador = 0;
let productsToquote = [];
let cotizacion_enviar;
let mas_cantidad = false;
let del_requeriments = [];
let eliminador = false;
const url = "/products/";

inputs.forEach(div => {
    div.querySelector("input").addEventListener('change', () => {
        div.querySelector("strong").textContent = div.querySelector("input").value;
    });
    div.querySelector("input").value = 4;
    div.querySelector("strong").textContent = div.querySelector("input").value;
});

async function addToQuote(product_id1, product_name, product_price, hours_used) {
    const inputhoras = `product°${product_id1}`;
    const productDiv = document.getElementById(inputhoras);
    hours_used = productDiv ? parseInt(productDiv.querySelector("input").value) : 4;

    if (productsToquote.find((obj) => obj.product_id == product_id1)) {
        const existing = productsToquote.find((obj) => obj.product_id == product_id1);
        existing.amount++;
        existing.eliminar_requeimientos = del_requeriments;
        mas_cantidad = true;
    } else {
        productsToquote.push({
            amount: 1,
            product_id: product_id1,
            hours: hours_used,
            borrar: false,
            eliminar_requeimientos: del_requeriments
        });
    }

    const quotation = await fetch(url + "vista_prueba", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([...productsToquote]),
    }).then((response) => response.json());

    cotizacion_enviar = quotation;
    makeQuote(quotation, product_id1, product_name, product_price, hours_used, false);
}

function delFromProducts(id) {
    productsToquote = productsToquote.filter((obj) => obj.product_id != id);
    const item = quoteContainer.querySelector(`#_${id}`);
    if (item) item.remove();
    eliminarProducto(productsToquote);
}

async function makeQuote(quotation, product_id, product_name, product_price, hours_used, eliminador) {
    let total_precio = 0;

    if (mas_cantidad == false && eliminador == false) {
        const cant = quotation.products[contador].amount;
        const consumptions = quotation.consumptions[contador];
        contador++;
        const clone = document.importNode(quoteTemplate, true);
        const quoteRoot = clone.querySelector(".quote") || clone.querySelector(".quote-item");
        if (!quoteRoot) {
            return;
        }
        quoteRoot.id = `_${product_id}`;
        const elimBtn = clone.querySelector(".eliminar-cotizador") || clone.querySelector(".eliminar-item");
        if (elimBtn) elimBtn.addEventListener('click', () => delFromProducts(product_id));
        clone.querySelector(".titulo-producto-cotizador").textContent = product_name;
        const ac1 = clone.querySelector(".precio-unitario");
        ac1.setAttribute("id", `4-${product_id}`);
        ac1.textContent = "$" + formatearNumero(product_price * cant);
        clone.querySelector(".horas-uso-cotizador").textContent = hours_used;
        const ac3 = clone.querySelector(".consumo-hora-cotizador");
        ac3.setAttribute("id", `6-${product_id}`);
        ac3.textContent = formatearNumero(consumptions.consumption_hr * cant) + " W/hora";
        const ac4 = clone.querySelector(".consumo-dia-cotizador");
        ac4.setAttribute("id", `7-${product_id}`);
        ac4.textContent = formatearNumero(consumptions.consumption_day * cant) + " W/dia";
        const ac5 = clone.querySelector(".porcentaje-perdidas-cotizador");
        ac5.setAttribute("id", `8-${product_id}`);
        ac5.textContent = consumptions.loss_percentaje + "% perdidas: " + formatearNumero(consumptions.loss_consumption * cant) + " W";
        const ac6 = clone.querySelector(".total-consumo-cotizador");
        ac6.setAttribute("id", `9-${product_id}`);
        ac6.textContent = formatearNumero(consumptions.total_consumption_day * cant) + " W";
        const cantidades = clone.querySelector(".cantidad-cotizador");
        cantidades.setAttribute("id", `cantidades-${product_id}`);
        cantidades.textContent = cant;
        quoteContainer.appendChild(clone);
    } else {
        const canti = quotation.products;
        let contador2 = 0;
        canti.forEach(element => {
            if (element.product_id == product_id) {
                const consumptions = quotation.consumptions[contador2];
                document.getElementById(`cantidades-${product_id}`).textContent = element.amount;
                document.getElementById(`4-${product_id}`).textContent = "$" + formatearNumero(product_price * element.amount);
                document.getElementById(`6-${product_id}`).textContent = formatearNumero(consumptions.consumption_hr * element.amount) + " W/hora";
                document.getElementById(`7-${product_id}`).textContent = formatearNumero(consumptions.consumption_day * element.amount) + " W/dia";
                document.getElementById(`8-${product_id}`).textContent = consumptions.loss_percentaje + "% perdidas: " + formatearNumero(consumptions.loss_consumption * element.amount) + "W";
                document.getElementById(`9-${product_id}`).textContent = formatearNumero(consumptions.total_consumption_day * element.amount) + " W";
                contador2++;
            }
        });
    }

    quotation.productos.forEach((productos) => {
        total_precio += productos.price * productos.amount;
    });

    mas_cantidad = false;

    const fillReq = (selector, text) => {
        const el = document.querySelector(selector);
        if (el) el.textContent = text;
    };

    const total_panel = quotation.panel_needed.price * quotation.panel_needed.amount;
    fillReq(".paneles-requeridos1", ` ${quotation.panel_needed.amount}`);
    fillReq(".paneles-tipo-requeridos1", quotation.panel_needed.name);
    fillReq(".paneles-precio-requeridos1", formatearNumero(quotation.panel_needed.price));
    fillReq(".paneles-precio-requeridos2", ` ${formatearNumero(total_panel)}`);
    total_precio += parseInt(total_panel);

    fillReq(".baterias-requeridos1", quotation.battery_needed.amount);
    const btyTotal = quotation.battery_needed.price * quotation.battery_needed.amount;
    fillReq(".baterias-precio-requeridos1", formatearNumero(quotation.battery_needed.price));
    fillReq(".baterias-precio-requeridos2", formatearNumero(btyTotal));
    total_precio += parseInt(btyTotal);

    fillReq(".reguladores-requeridos1", quotation.regulator_needed.amount);
    fillReq(".reguladores-tipo-requeridos1", quotation.regulator_needed.name);
    fillReq(".reguladores-precio-requeridos1", formatearNumero(quotation.regulator_needed.price));
    total_precio += parseInt(quotation.regulator_needed.price);

    fillReq(".breakers-requeridos1", quotation.breaker_needed.amount);
    fillReq(".breakers-tipo-requeridos1", quotation.breaker_needed.name);
    const brkTotal = quotation.breaker_needed.price * quotation.breaker_needed.amount;
    fillReq(".breakers-precio-unitario-total-requeridos1", formatearNumero(quotation.breaker_needed.price));
    fillReq(".breakers-precio-requeridos1", formatearNumero(brkTotal));
    total_precio += parseInt(brkTotal);

    fillReq(".cables-requeridos1", quotation.rubberized_cable_needed.amount);
    fillReq(".cables-tipo-requeridos1", quotation.rubberized_cable_needed.name);
    fillReq(".cables-precio-requeridos1", formatearNumero(quotation.rubberized_cable_needed.price));
    const cabTotal = quotation.rubberized_cable_needed.price * quotation.rubberized_cable_needed.amount;
    fillReq(".cables-precio-total-requeridos1", formatearNumero(cabTotal));
    total_precio += parseInt(cabTotal);

    fillReq(".soportes-sobre-techo-requeridos1", quotation.panel_support_needed.amount);
    fillReq(".soportes-sobre-techo-tipo-requeridos1", quotation.panel_support_needed.name);
    fillReq(".soportes-sobre-techo-precio-requeridos1", formatearNumero(quotation.panel_support_needed.price));
    const supTotal = quotation.panel_support_needed.price * quotation.panel_support_needed.amount;
    fillReq(".soportes-sobre-techo-precio-total-requeridos1", formatearNumero(supTotal));
    total_precio += parseInt(supTotal);

    fillReq(".modulos-centralizados-requeridos1", quotation.centralized_modules_needed.amount);
    fillReq(".modulos-centralizados-tipo-requeridos1", quotation.centralized_modules_needed.name);
    fillReq(".modulos-centralizados-precio-requeridos1", formatearNumero(quotation.centralized_modules_needed.price));
    const modTotal = quotation.centralized_modules_needed.price * quotation.centralized_modules_needed.amount;
    fillReq(".modulos-centralizados-precio-total-requeridos1", formatearNumero(modTotal));
    total_precio += parseInt(modTotal);

    fillReq(".unidad-de-potencia-requeridos1", quotation.power_units_needed.amount);
    fillReq(".unidad-de-potencia-tipo-requeridos1", quotation.power_units_needed.name);
    fillReq(".unidad-de-potencia-precio-requeridos1", formatearNumero(quotation.power_units_needed.price));
    const powTotal = quotation.power_units_needed.price * quotation.power_units_needed.amount;
    fillReq(".unidad-de-potencia-precio-total-requeridos1", formatearNumero(powTotal));
    total_precio += parseInt(powTotal);

    fillReq(".terminales-MC4-requeridos1", quotation.terminals_needed.amount);
    fillReq(".terminales-MC4-tipo-requeridos1", quotation.terminals_needed.name);
    fillReq(".terminales-MC4-precio-requeridos1", formatearNumero(quotation.terminals_needed.price));
    const terTotal = quotation.terminals_needed.price * quotation.terminals_needed.amount;
    fillReq(".terminales-MC4-precio-total-requeridos1", formatearNumero(terTotal));
    total_precio += parseInt(terTotal);

    fillReq(".conectores-en-y-requeridos1", quotation.connector_needed.amount);
    fillReq(".conectores-en-y-tipo-requeridos1", quotation.connector_needed.name);
    fillReq(".conectores-en-y-precio-requeridos1", formatearNumero(quotation.connector_needed.price));
    const conTotal = quotation.connector_needed.price * quotation.connector_needed.amount;
    fillReq(".conectores-en-y-precio-total-requeridos1", formatearNumero(conTotal));
    total_precio += parseInt(conTotal);

    fillReq(".cable-vehicular-requeridos1", quotation.vehicle_cable_needed.amount);
    fillReq(".cable-vehicular-tipo-requeridos1", quotation.vehicle_cable_needed.name);
    fillReq(".cable-vehicular-precio-requeridos1", formatearNumero(quotation.vehicle_cable_needed.price));
    const vehTotal = quotation.vehicle_cable_needed.price * quotation.vehicle_cable_needed.amount;
    fillReq(".cable-vehicular-precio-total-requeridos1", formatearNumero(vehTotal));
    total_precio += parseInt(vehTotal);

    fillReq(".materiales-electricos-requeridos1", quotation.electric_materials_needed.amount);
    fillReq(".materiales-electricos-tipo-requeridos1", quotation.electric_materials_needed.name);
    fillReq(".materiales-electricos-precio-requeridos1", formatearNumero(quotation.electric_materials_needed.price));
    const elecTotal = quotation.electric_materials_needed.price * quotation.electric_materials_needed.amount;
    fillReq(".materiales-electricos-precio-total-requeridos1", formatearNumero(elecTotal));
    total_precio += parseInt(elecTotal);

    fillReq(".kit-puesta-a-tierra-requeridos1", quotation.ground_security_kit_needed.amount);
    fillReq(".kit-puesta-a-tierra-tipo-requeridos1", quotation.ground_security_kit_needed.name);
    fillReq(".kit-puesta-a-tierra-precio-requeridos1", formatearNumero(quotation.ground_security_kit_needed.price));
    const kitTotal = quotation.ground_security_kit_needed.price * quotation.ground_security_kit_needed.amount;
    fillReq(".kit-puesta-a-tierra-precio-total-requeridos1", formatearNumero(kitTotal));
    total_precio += parseInt(kitTotal);

    fillReq(".rack-soporte-baterias-requeridos1", quotation.rack_bateria.amount);
    fillReq(".rack-soporte-baterias-tipo-requeridos1", quotation.rack_bateria.name);
    fillReq(".rack-soporte-baterias-precio-requeridos1", formatearNumero(quotation.rack_bateria.price));
    const rackTotal = quotation.rack_bateria.price * quotation.rack_bateria.amount;
    fillReq(".rack-soporte-baterias-precio-total-requeridos1", formatearNumero(rackTotal));
    total_precio += parseInt(rackTotal);

    fillReq(".inversores-requeridos1", quotation.inversor.amount);
    fillReq(".inversores-tipo-requeridos1", quotation.inversor.name);
    fillReq(".inversores-precio-requeridos1", formatearNumero(quotation.inversor.price));
    const invTotal = quotation.inversor.price * quotation.inversor.amount;
    fillReq(".inversores-precio-total-requeridos1", formatearNumero(invTotal));
    total_precio += parseInt(invTotal);

    const premiun = total_precio;
    total_precio -= parseInt(quotation.power_units_needed.price * quotation.power_units_needed.amount);

    const totales = document.getElementById("totales");
    const totales_premiun = document.getElementById("premiun");
    if (totales) totales.textContent = "$ " + formatearNumero(total_precio);
    if (totales_premiun) totales_premiun.textContent = "$ " + formatearNumero(premiun);
}

async function createandsendpdf(nombre, email, apellido) {
    Swal.fire({
        title: 'Su cotizacion estara en su correo en unos segundos',
        icon: 'success',
        confirmButtonText: false,
        stopKeydownPropagation: true,
        timer: 5000,
        showTimerProgressBar: true,
    });

    function getCSRFToken() {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.startsWith('csrftoken=')) {
                    cookieValue = decodeURIComponent(cookie.substring('csrftoken='.length));
                    break;
                }
            }
        }
        return cookieValue;
    }

    fetch(url + "sendQuote", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken()
        },
        body: JSON.stringify({
            "name": nombre,
            "lastname": apellido,
            "email": email,
        })
    }).then(response => response.json()).then(data => {
        alert("Se ha enviado el pdf a su correo");
        window.location.href = url + "pdf_vista";
    }).catch(error => {
        console.log("Error:", error);
    });
}

function formatearNumero(numero, lenguaje = "es") {
    const formateador = new Intl.NumberFormat(lenguaje, {
        useGrouping: true,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
    return formateador.format(numero);
}

async function eliminarProducto(prod) {
    await fetch(url + "vista_prueba", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prod),
    }).then(response => response.json()).then(data => {
        if (data.error == "no hay datos") {
            Swal.fire({
                title: 'Ha eliminado todos los productos',
                icon: 'warning',
                confirmButtonText: 'Ok',
                stopKeydownPropagation: true,
            }).then((result) => {
                cotizacion_enviar = data;
                if (result.isConfirmed) {
                    window.location.reload();
                }
            });
        } else {
            cotizacion_enviar = data;
            window.location.reload();
        }
    });
}

function borrar() {
    fetch(url + "vista_prueba", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([{ "borrar": true }]),
    }).then(response => response.json()).then(data => {
        window.location.reload();
    });
}

async function eliminar_requerimientos(requerimiento) {
    if (del_requeriments.length == 0) {
        del_requeriments.push(requerimiento);
    } else {
        const exists = del_requeriments.some(el => el == requerimiento);
        if (!exists) del_requeriments.push(requerimiento);
    }

    productsToquote.forEach(element => {
        element.eliminar_requeimientos = del_requeriments;
    });

    await fetch(url + "vista_prueba", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([...productsToquote]),
    }).then(response => response.json()).then(data => {
        mas_cantidad = true;
        data.productos.forEach(element => {
            makeQuote(data, element.id, element.name, element.price, element.hours_used, true);
            cotizacion_enviar = data;
        });
        return data;
    });
}

function reagregar_requerimientos(requerimiento) {
    productsToquote.forEach(element => {
        element.eliminar_requeimientos = element.eliminar_requeimientos.filter(item => item !== requerimiento);
    });

    fetch(url + "vista_prueba", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([...productsToquote]),
    }).then(response => response.json()).then(data => {
        mas_cantidad = true;
        data.productos.forEach(element => {
            makeQuote(data, element.id, element.name, element.price, element.hours_used, true);
            cotizacion_enviar = data;
        });
    });
}

async function delToQuote(producto) {
    productsToquote.forEach(element => {
        if (element.product_id == producto) {
            if (element.amount == 1) {
                delFromProducts(producto);
            } else {
                element.amount = element.amount - 1;
            }
        }
    });

    fetch(url + "vista_prueba", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([...productsToquote]),
    }).then(response => response.json()).then(data => {
        mas_cantidad = true;
        data.productos.forEach(element => {
            makeQuote(data, element.id, element.name, element.price, element.hours_used, true);
            cotizacion_enviar = data;
        });
    });
}

const consumptions = fetch(url + "vista_prueba", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
}).then(response => response.json()).then(data => {
    if (data.error == "no hay datos") {
        return data;
    }
    data.eliminar_requirements.forEach(element => {
        del_requeriments.push(element);
    });
    data.productos.forEach(element => {
        productsToquote.push({
            amount: element.amount,
            product_id: element.id,
            hours: element.hours_used,
            eliminar_requeimientos: del_requeriments
        });
        makeQuote(data, element.id, element.name, element.price, element.hours_used, false);
        cotizacion_enviar = data;
    });
    return data;
}).catch(error => {
    console.log(error);
});

// Popover initialization
document.addEventListener('DOMContentLoaded', function() {
    var popoverTriggerList = Array.prototype.slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    var popoverList = popoverTriggerList.map(function(popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
});

// Cargar tiempo de uso por defecto desde categorías
function Show_category() {
    fetch(url + "show_Category", {
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
    }).then(response => response.json()).then(data => {
        let input_range = document.getElementsByTagName("input");
        data.categorias.forEach(element => {
            let id_category = parseInt(element.id);
            for (let i = 0; i < input_range.length; i++) {
                let este_rango = `range-${id_category}`;
                if (input_range[i].id == este_rango) {
                    input_range[i].value = element.tiempo_uso;
                    const parentDiv = input_range[i].closest(".horas-sol-producto");
                    if (parentDiv) {
                        parentDiv.querySelector("strong").textContent = element.tiempo_uso;
                    }
                }
            }
        });
    });
}
Show_category();
