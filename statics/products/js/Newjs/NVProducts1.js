const inputs = document.querySelectorAll(".horas-sol-producto");
const quoteTemplate = document.getElementById("quote-template").content;
const quoteContainer = document.querySelector(".acumulador-cotizador");
let cantidad_html=document.getElementById(`cantidades`);
let contador=0;
let productsToquote = [];
let cotizacion_enviar;
let mas_cantidad=false
let del_requeriments=[];
let eliminador=false;
let data1=0;
const url="/products/"

inputs.forEach(div => {
  div.querySelector("input").addEventListener('change', ()=>{
    div.querySelector("strong").textContent = div.querySelector("input").value;
  })
  div.querySelector("input").value = 24;
  div.querySelector("strong").textContent = div.querySelector("input").value;
});

// functions------

async function addToQuote(product_id1,product_name,product_price ,hours_used=24) {
  console.log(product_id1,product_name ,product_price ,"=======================================");
  inputhoras=`product°${product_id1}`;
  console.log(inputhoras);
  hours_used =  parseInt((document.getElementById(inputhoras)).querySelector("input").value);
  console.log(hours_used)
  if (productsToquote.find((obj) => obj.product_id == product_id1)) {
    console.log("ya existe",product_id1);
    new_amount = productsToquote.find((obj) => obj.product_id == product_id1);
    new_amount.amount ++;
    new_amount.eliminar_requeimientos = del_requeriments;
    console.log(new_amount,"new_amount",productsToquote,"productsToquote");
    mas_cantidad=true;
  }else{
    productsToquote.push(
      {
        amount:1,
        product_id:product_id1,
        hours:hours_used,
        borrar:false,
        eliminar_requeimientos:del_requeriments
      }
      
    );
    console.log(productsToquote,"productsToquote del add to quote");
  }
  console.log(productsToquote,"productsToquote");

  const consumptions = await fetch(url+"vista_prueba",{
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify([
          ...productsToquote,
          ]),
          
      },console.log(`hiso la peticion con ${product_id1} y ${hours_used}`)).then((response) => response.json()).then((quotation) =>quotation);
    console.log(consumptions,"consumptions");
  
  // MISSING FIX
  cotizacion_enviar=consumptions;
  makeQuote(consumptions,product_id1,product_name,product_price,hours_used,eliminador=false);
}

function delFromProducts(id) {
  productsToquote = productsToquote.filter((obj) => obj.product_id != id);
  //productsToquote.find((obj) => obj.product_id == id).remove;
  console.log(productsToquote,"productsToquote de eliminar");
  quoteContainer.querySelector(`#_${id}`).remove();
  eliminarProducto(productsToquote);
  
  //makeQuote();
}

async function makeQuote(quotation,product_id,product_name,product_price,hours_used,eliminador) {
  let quoteReturn;
      // datos productos
      let total_precio=0;
      
      if (mas_cantidad==false && eliminador==false) {
        console.log("mas cantidad",contador);
        let cant=quotation.products[contador].amount;
        console.log(cant,"cant");
        let consumptions=quotation.consumptions[contador]
        contador++;
        console.log(consumptions,"consumption en makeQuote",contador);
      const clone = document.importNode(quoteTemplate, true);
      clone.querySelector(".quote").id += "_"+product_id;
      clone.querySelector(".eliminar-cotizador").addEventListener('click',()=>delFromProducts(product_id));
      clone.querySelector(".titulo-producto-cotizador").textContent += product_name;
      let ac1=clone.querySelector(".precio-unitario");
      ac1.setAttribute("id", `4-${product_id}`);
      ac1.textContent += "$"+formatearNumero(product_price*cant).toString();
      clone.querySelector(".horas-uso-cotizador").textContent += hours_used;
      let ac3=clone.querySelector(".consumo-hora-cotizador");
      ac3.setAttribute("id", `6-${product_id}`);
      ac3.textContent += formatearNumero(consumptions.consumption_hr*cant ).toString()+" W/hora";
      let ac4=clone.querySelector(".consumo-dia-cotizador");
      ac4.setAttribute("id", `7-${product_id}`);
      ac4.textContent += formatearNumero(consumptions.consumption_day*cant).toString() +" W/dia";
      let ac5=clone.querySelector(".porcentaje-perdidas-cotizador");
      ac5.setAttribute("id", `8-${product_id}`);
      ac5.textContent += consumptions.loss_percentaje+" % perdidas: "+formatearNumero(consumptions.loss_consumption*cant).toString() +" W";
      let ac6=clone.querySelector(".total-consumo-cotizador");
      ac6.setAttribute("id", `9-${product_id}`);
      ac6.textContent += formatearNumero(consumptions.total_consumption_day*cant).toString() +" W";
      let cantidades=clone.querySelector(".cantidad-cotizador") ;
      cantidades.setAttribute("id", `cantidades-${product_id}`);
      cantidades.textContent += cant;
      quoteContainer.appendChild(clone);
      }else{
        console.log("mas cantidad");
        let canti=quotation.products;
        let contador2=0;
        canti.forEach(element => {
          console.log(element,"element");
          if (element.product_id==product_id) {
            let consumptions=quotation.consumptions[contador2]
            console.log(element.amount,"element.amount",element.product_id,"element.product_id");
            document.getElementById(`cantidades-${product_id}`).textContent = element.amount;
            document.getElementById(`4-${product_id}`).textContent = "$"+formatearNumero(product_price*element.amount).toString();
            document.getElementById(`6-${product_id}`).textContent = formatearNumero(consumptions.consumption_hr*element.amount ).toString()+" W/hora";
            document.getElementById(`7-${product_id}`).textContent = formatearNumero(consumptions.consumption_day*element.amount).toString() +" W/dia";
            document.getElementById(`8-${product_id}`).textContent = consumptions.loss_percentaje+" % perdidas: "+formatearNumero(consumptions.loss_consumption*element.amount).toString()+"W" ;
            document.getElementById(`9-${product_id}`).textContent = formatearNumero(consumptions.total_consumption_day*element.amount).toString() +" W";
            contador2++;
          }
          
        });
      }
      // precio de los productos
      quotation.productos.forEach((productos) => {
        console.log(productos,"product en makeQuote para precios");
        total_precio += productos.price * productos.amount;
      });
      console.log(total_precio,"total_precio");

      console.log(product_price,"product_price");
      
      mas_cantidad=false;
        
      
        

      
      //
      // seccion paneles
      let total_panel=quotation.panel_needed.price*quotation.panel_needed.amount;
      document.querySelector(".paneles-requeridos1").textContent = ` ${quotation.panel_needed.amount}`;
      document.querySelector(".paneles-tipo-requeridos1").textContent = quotation.panel_needed.name;
      document.querySelector(".paneles-precio-requeridos1").textContent = formatearNumero(quotation.panel_needed.price).toString();
      document.querySelector(".paneles-precio-requeridos2").textContent = ` ${formatearNumero(total_panel).toString()}`;
      //
      total_precio += parseInt(total_panel);

      // seccion baterias
      console.log(quotation.battery_needed.name,"bateria");
      document.querySelector(".baterias-requeridos1").textContent = quotation.battery_needed.amount;
      document.querySelector(".baterias-tipo-requeridos").textContent = quotation.battery_needed.name;
      document.querySelector(".baterias-precio-requeridos1").textContent = formatearNumero(quotation.battery_needed.price).toString();
      document.querySelector(".baterias-precio-requeridos2").textContent = formatearNumero(quotation.battery_needed.price*quotation.battery_needed.amount).toString();
      total_precio += parseInt(quotation.battery_needed.price*quotation.battery_needed.amount);
      //
  
      document.querySelector(".reguladores-requeridos").textContent = quotation.regulator_needed.amount;
      document.querySelector(".reguladores-tipo-requeridos").textContent = quotation.regulator_needed.name;
      document.querySelector(".reguladores-precio-requeridos").textContent = formatearNumero(quotation.regulator_needed.price).toString();
      // document.querySelector(".reguladores-precio-total-requeridos").textContent = quotation.regulators_needed[0].price*quotation.regulators_needed[0].amount;
      total_precio += parseInt(quotation.regulator_needed.price);
      // 
        
      
      // 
        
      document.querySelector(".breakers-requeridos").textContent = quotation.breaker_needed.amount;
      document.querySelector(".breakers-tipo-requeridos").textContent = quotation.breaker_needed.name;
      document.querySelector(".breakers-precio-unitario-total-requeridos1").textContent = formatearNumero(quotation.breaker_needed.price).toString();
      total_precio += parseInt(quotation.breaker_needed.price*quotation.breaker_needed.amount);
      document.querySelector(".breakers-precio-requeridos1").textContent = formatearNumero(quotation.breaker_needed.price*quotation.breaker_needed.amount).toString();
        
      document.querySelector(".cables-requeridos").textContent = quotation.rubberized_cable_needed.amount;
      document.querySelector(".cables-tipo-requeridos").textContent = quotation.rubberized_cable_needed.name;
      document.querySelector(".cables-precio-requeridos").textContent = formatearNumero(quotation.rubberized_cable_needed.price).toString();
      document.querySelector(".cables-precio-total-requeridos").textContent = formatearNumero(quotation.rubberized_cable_needed.price*quotation.rubberized_cable_needed.amount).toString() ;
      total_precio+= parseInt( quotation.rubberized_cable_needed.price*quotation.rubberized_cable_needed.amount);
      
      document.querySelector(".soportes-sobre-techo-requeridos").textContent = quotation.panel_support_needed.amount;
      document.querySelector(".soportes-sobre-techo-tipo-requeridos").textContent = quotation.panel_support_needed.name;
      document.querySelector(".soportes-sobre-techo-precio-requeridos").textContent = formatearNumero(quotation.panel_support_needed.price).toString();
      document.querySelector(".soportes-sobre-techo-precio-total-requeridos").textContent = formatearNumero(quotation.panel_support_needed.price*quotation.panel_support_needed.amount).toString();
      total_precio += quotation.panel_support_needed.price*quotation.panel_support_needed.amount;   
      
      document.querySelector(".modulos-centralizados-requeridos").textContent = quotation.centralized_modules_needed.amount;
      document.querySelector(".modulos-centralizados-tipo-requeridos").textContent = quotation.centralized_modules_needed.name;
      document.querySelector(".modulos-centralizados-precio-requeridos").textContent = formatearNumero(quotation.centralized_modules_needed.price).toString();
      document.querySelector(".modulos-centralizados-precio-total-requeridos").textContent = formatearNumero(quotation.centralized_modules_needed.price*quotation.centralized_modules_needed.amount).toString();
      total_precio += parseInt( quotation.centralized_modules_needed.price*quotation.centralized_modules_needed.amount);  
      
      document.querySelector(".unidad-de-potencia-requeridos").textContent = quotation.power_units_needed.amount;
      document.querySelector(".unidad-de-potencia-tipo-requeridos").textContent = quotation.power_units_needed.name;
      document.querySelector(".unidad-de-potencia-precio-requeridos").textContent = formatearNumero(quotation.power_units_needed.price).toString();
      document.querySelector(".unidad-de-potencia-precio-total-requeridos").textContent = formatearNumero(quotation.power_units_needed.price*quotation.power_units_needed.amount).toString();
      total_precio += parseInt( quotation.power_units_needed.price*quotation.power_units_needed.amount);   
      
      document.querySelector(".terminales-MC4-requeridos").textContent = quotation.terminals_needed.amount;
      document.querySelector(".terminales-MC4-tipo-requeridos").textContent = quotation.terminals_needed.name;
      document.querySelector(".terminales-MC4-precio-requeridos").textContent = formatearNumero(quotation.terminals_needed.price).toString();
      document.querySelector(".terminales-MC4-precio-total-requeridos").textContent = formatearNumero(quotation.terminals_needed.price*quotation.terminals_needed.amount).toString();
      total_precio += parseInt( quotation.terminals_needed.price*quotation.terminals_needed.amount);

      document.querySelector(".conectores-en-y-requeridos").textContent = quotation.connector_needed.amount;
      document.querySelector(".conectores-en-y-tipo-requeridos").textContent = quotation.connector_needed.name;
      document.querySelector(".conectores-en-y-precio-requeridos").textContent = formatearNumero(quotation.connector_needed.price).toString();
      document.querySelector(".conectores-en-y-precio-total-requeridos").textContent = formatearNumero(quotation.connector_needed.price*quotation.connector_needed.amount).toString();
      total_precio += parseInt( quotation.connector_needed.price*quotation.connector_needed.amount);

      document.querySelector(".cable-vehicular-requeridos").textContent = quotation.vehicle_cable_needed.amount;
      document.querySelector(".cable-vehicular-tipo-requeridos").textContent = quotation.vehicle_cable_needed.name;
      document.querySelector(".cable-vehicular-precio-requeridos").textContent = formatearNumero(quotation.vehicle_cable_needed.price).toString();
      document.querySelector(".cable-vehicular-precio-total-requeridos").textContent = formatearNumero(quotation.vehicle_cable_needed.price*quotation.vehicle_cable_needed.amount).toString();
      total_precio += parseInt( quotation.vehicle_cable_needed.price*quotation.vehicle_cable_needed.amount);   

      document.querySelector(".materiales-electricos-requeridos").textContent = quotation.electric_materials_needed.amount;
      document.querySelector(".materiales-electricos-tipo-requeridos").textContent = quotation.electric_materials_needed.name;
      document.querySelector(".materiales-electricos-precio-requeridos").textContent = formatearNumero(quotation.electric_materials_needed.price).toString();
      document.querySelector(".materiales-electricos-precio-total-requeridos").textContent = formatearNumero(quotation.electric_materials_needed.price*quotation.electric_materials_needed.amount).toString();
      total_precio += parseInt( quotation.electric_materials_needed.price*quotation.electric_materials_needed.amount);

      document.querySelector(".kit-puesta-a-tierra-requeridos1").textContent = quotation.ground_security_kit_needed.amount;
      document.querySelector(".kit-puesta-a-tierra-tipo-requeridos1").textContent = quotation.ground_security_kit_needed.name;
      document.querySelector(".kit-puesta-a-tierra-precio-requeridos1").textContent = formatearNumero(quotation.ground_security_kit_needed.price).toString();
      document.querySelector(".kit-puesta-a-tierra-precio-total-requeridos1").textContent = formatearNumero(quotation.ground_security_kit_needed.price*quotation.ground_security_kit_needed.amount).toString();

      console.log(quotation.rack_bateria.name,"rack bateria");
      document.querySelector(".rack-soporte-baterias-requeridos1").textContent = quotation.rack_bateria.amount;
      document.querySelector(".rack-soporte-baterias-tipo-requeridos1").textContent = quotation.rack_bateria.name;
      document.querySelector(".rack-soporte-baterias-precio-requeridos1").textContent = formatearNumero(quotation.rack_bateria.price).toString();
      document.querySelector(".rack-soporte-baterias-precio-total-requeridos1").textContent = formatearNumero(quotation.rack_bateria.price*quotation.rack_bateria.amount).toString();
      
      document.querySelector(".Inversor-requeridos1").textContent =  quotation.inversor.amount;
      document.querySelector(".Inversor-tipo-requeridos1").textContent = quotation.inversor.name;
      document.querySelector(".Inversor-precio-requeridos1").textContent = formatearNumero(quotation.inversor.price).toString();
      document.querySelector(".Inversor-precio-total-requeridos1").textContent = formatearNumero(quotation.inversor.price*quotation.ground_security_kit_needed.amount).toString();
      total_precio += parseInt( quotation.ground_security_kit_needed.price*quotation.ground_security_kit_needed.amount);

      total_precio += parseInt(quotation.ground_security_kit_needed.price*quotation.ground_security_kit_needed.amount);
      total_precio += parseInt(quotation.rack_bateria.price*quotation.rack_bateria.amount);
      premiun = total_precio ;
      total_precio -= parseInt( quotation.power_units_needed.price*quotation.power_units_needed.amount);   
      premiun -= parseInt( quotation.centralized_modules_needed.price*quotation.centralized_modules_needed.amount); 
      console.log("total_precio",total_precio);
      // total de la cotizacion
      console.log(total_precio,"total precio");
      let totales=document.getElementById("totales");
      totales.textContent="$ "+formatearNumero(total_precio).toString();
      let totales_premiun=document.getElementById("premiun");
      totales_premiun.textContent="$ "+formatearNumero(premiun).toString();

      return quoteReturn
  
}
async function createandsendpdf(nombre, email,apellido) {
  console.log("enviando pdf", nombre, email);
  Swal.fire({
    title: 'Su cotizacion estara en su correo en unos segundos',
    icon: 'success',
    confirmButtonText: false,
    stopKeydownPropagation: true,
    timer: 5000,
    showTimerProgressBar: true,

  })
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
    console.log(data);
    alert("Se ha enviado el pdf a su correo", data);
    window.location.href = url + "pdf_vista";
  }).catch(error => {
    console.log("Error:", error);
  });
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

async function eliminarProducto(prod){
  console.log(prod,"prod");
  await fetch(url+"vista_prueba",{
  method: "POST",
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(prod),
})
.then(response => response.json())
.then(data => {
  console.log(data);
  reiniciar=false
  if (data.error == "no hay datos") {
    let reiniciar=  Swal.fire({
      title: 'Ha eliminado todos los productos',
      icon: 'warning',
      confirmButtonText: 'Ok',
      stopKeydownPropagation: true,

    }).then((result) => 
    {
      cotizacion_enviar=data
      if (result.isConfirmed) {
        window.location.reload();
      }

    })
  }else{
    cotizacion_enviar=data
    window.location.reload();
  }
})
}
function borrar() {
  fetch(url+"vista_prueba",{
  method: "POST",
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify([{"borrar":true}]),
})
.then(response => response.json())
.then(data => {
  console.log(data);
  
    //actualizar la pagina
    
  window.location.reload();

}
)
}

async function eliminar_requerimientos(requerimiento,product){
  if (del_requeriments.length==0) {
    del_requeriments.push(requerimiento)
    console.log(del_requeriments,"del_requeriments despues del push");
  }
  del_requeriments.forEach(element => {
    if (element==requerimiento) {
      console.log("element ya esta",element);
    }else{
      del_requeriments.push(requerimiento)
      console.log(del_requeriments,"del_requeriments despues del push");
    }
  });
// encontrar el ultimo objeto de productsToquote  y agregarle la lista del_requeriments
console.log(productsToquote, "productsToquote antes de eliminar requerimientos");

productsToquote.forEach(element => {
  element.eliminar_requeimientos=del_requeriments
});
console.log(productsToquote, "productsToquote eliminando requerimientos");

await fetch(url+"vista_prueba",{
  method: "POST",
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify([
    ...productsToquote
  ]),
})
.then(response => response.json())
.then(data => {
  console.log(data);
    mas_cantidad=true
    data.productos.forEach(element => {

    makeQuote(data, element.id, element.name, element.price, element.hours_used,eliminador=true)
    cotizacion_enviar= data;
  });
  
  return data
})

}

function reagregar_requerimientos(requerimiento,product){

  console.log(requerimiento,"requerimiento");
  console.log(product,"product");
  console.log(productsToquote,"productsToquote antes de reagregar requerimientos");
  productsToquote.forEach(element => {
      element.eliminar_requeimientos.forEach(element2 => {
        if (element2==requerimiento) {
          element.eliminar_requeimientos=element.eliminar_requeimientos.filter(item => item !== requerimiento)
        }
      });
  });
  console.log(productsToquote,"productsToquote despues de reagregar requerimientos");
  fetch(url+"vista_prueba",{
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify([
      ...productsToquote
    ]),
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    mas_cantidad=true
    data.productos.forEach(element => {
      makeQuote(data, element.id, element.name, element.price, element.hours_used,eliminador=true)
    cotizacion_enviar= data;
  });
  })
}
async function delToQuote(producto) {
  console.log(producto,"producto a eliminar");
  console.log(productsToquote,"productsToquote antes de eliminar");
  productsToquote.forEach(element => {
    if (element.product_id==producto) {
      if (element.amount==1) {
        delFromProducts(producto)
        
      }else{
      element.amount=element.amount-1
      }
    }
  });
  console.log(productsToquote,"productsToquote despues de eliminar");
  fetch(url+"vista_prueba",{
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify([
      ...productsToquote
    ]),
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    mas_cantidad=true
    data.productos.forEach(element => {

    makeQuote(data, element.id, element.name, element.price, element.hours_used,eliminador=true)
    cotizacion_enviar= data;
  });
  })

  // actualizar la pagina
  
}
  





const consumptions =  fetch(url+"vista_prueba",{
  method: "POST",
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({}),
}).then(response => response.json()).then(data => {
  console.log(data)
  contador_productos = 0;
  data.eliminar_requirements.forEach(element => {
    console.log(element,"element");
    del_requeriments.push(element)
  });
  data.productos.forEach(element => {
    productsToquote.push(
      {
        amount:element.amount,
        product_id:element.id,
        hours:element.hours_used,
        eliminar_requeimientos:del_requeriments
      }
    );
    // añadir lista de eliminados
    console.log(productsToquote,"productsToquote actualizar pagina");
    mas_cantidad=0

    makeQuote(data, element.id, element.name, element.price, element.hours_used,eliminador=false)
    cotizacion_enviar= data;
  });
  console.log(data.eliminar_requirements,"eliminar_requirements");
  

  
  return data
}).catch(error => {
  console.log(error)
})