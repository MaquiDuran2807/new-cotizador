// ajax para consumir el servicio de carrito
// y mostrar el carrito en la vista
// se ejecuta al cargar la vista

    let articulo 
    let articulos = [ ];
    let contador =1;
    let articulosguardado;
    let nombre;
    let descripcion;
    let precios=[];
    let precio=0;
    let panel;
    let consumptions;
    let batterys;
function carrito(articulosid,name,description,price) {
    let price1=parseInt(price);
    precios.push(price1);

    console.log(articulosid, 'articulosid', name, 'name', description, 'description', price, 'price');
   
    
    if (articulosid == articulosguardado){
        console.log(articulosid, 'articulosid', articulosguardado, 'articulosguardado');
        contador ++;
        sumararticulo=articulos.find(articulo => articulo.product_id == articulosid);
        console.log(sumararticulo, 'sumararticulo');
        sumararticulo.amount ++;
        console.log(articulos, 'articulos');
    }else{
    articulosguardado = articulosid;
    data={
        "product_id":articulosid,
        "amount":1,
        "hours":24
    }
    articulos.push(data);
    }
    
    // cada que se escoge un articulo se agrega a la lista el id y la cantidad 
    // capturar de html el id del articulo y la cantidad
    // agregar a la lista
    // enviar la lista al servicio
    // el servicio debe devolver el carrito
    // el carrito debe ser mostrado en la vista
    articulo = document.getElementById("articulo");
    let urlsapi=  `${window.location.origin}/products/cotizacion`

    fetch(urlsapi, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'cors':'Access-Control-Allow-Origin'
        },
        body: JSON.stringify(articulos),
        
    })
    .then(function(response)  {
        return response.json()
    }).catch(function(error) {
        console.log('Hubo un problema con la petición Fetch:' + error.message);
    })
    .then((data) => {
        console.log('Success:', data);
        let paneles = document.getElementById('paneles');
        let baterias= document.getElementById('baterias');
        panel=data.productions[0];
        consumptions=data.consumptions[0];
        batterys=data.batteries_needed[0];
        console.log(panel, 'panel', consumptions, 'consumptions', batterys, 'batterys');
        //paneles.innerHTML = '';
           // paneles.innerHTML += `<p>${panel.panel}  (${panel.amount}) </br>$ ${panel.panel.precio*panel.panel.cantidad} (${panel.panel.precio})  </p> 
            
          //`
          //baterias.innerHTML = '';
          //baterias.innerHTML += `<p>${panel.baterias.nombre}  (${panel.baterias.cantidad}) </br>$ ${panel.baterias.precio*panel.baterias.cantidad} (${panel.baterias.precio})  </p> 
          
        //`
          total=document.getElementById("total");
          // convertir a entero `
          let precio_panel=panel.panel.precio*panel.panel.cantidad;
          //let precio_bateria=panel.baterias.precio*panel.baterias.cantidad;
          precios.forEach(element => {
            console.log(element, 'element',"ti´po", typeof(element));
                precio += element; 
                console.log(precio, 'precio'); 
            });
          //suma_valores=precio+precio_panel+precio_bateria;
        //total.innerHTML = `${suma_valores}` ;
        precio=0;
        console.log(panel.sun_hours, 'panel.panel.sun_hours', consumptions.consumption_hour, 'consumptions.consumption_hour', consumptions.consumption_day, 'consumptions.consumption_day', consumptions.consumption_for_loss, 'consumptions.consumption_for_loss', consumptions.total_consumption, 'consumptions.total_consumption');
        objetos=document.getElementById("articulos");
        precio_articulo=document.getElementById("precio_articulo");
        objetos.innerHTML += `<div> ${name}</div>`;
        precio_articulo.innerHTML += `<div> ${price}</div>`;
        horas_uso=document.getElementById("horas_uso");
        horas_uso.innerHTML += `<div> 24</div>`;
        horas_sol=document.getElementById("horas_sol");
        horas_sol.innerHTML += `<div> ${panel.sun_hours}</div>`;
        consumo_hora=document.getElementById("consumo_hora");
        consumo_hora.innerHTML += `<div> ${consumptions.consumption_hour}</div>`;
        consumo_dia=document.getElementById("consumo_dia");
        consumo_dia.innerHTML += `<div> ${consumptions.consumption_day}</div>`;
        porcentaje_perdidas=document.getElementById("porcentaje_perdidas");
        porcentaje_perdidas.innerHTML += `<div> ${consumptions.consumption_for_loss}</div>`;
        consumo_total=document.getElementById("cantidad_consumo");
        consumo_total.innerHTML += `<div> ${consumptions.total_consumption}</div>`;

        // info3 produccion
        let paneles_requeridos=document.getElementById("paneles_requeridos");
        paneles_requeridos.innerHTML = `${panel.amount}`;
        paneles_tipo=document.getElementById("paneles_tipo");
        paneles_tipo.innerHTML = `<div> ${panel.panel}</div>`;
        paneles_precio=document.getElementById("paneles_precio");
        paneles_precio.innerHTML = `<div> ${panel.price_per_panel}</div>`;

        // info4 baterias

    }).then((data)=>{
        console.log(batterys, 'batterys');
        let urlsapi2 =  `${window.location.origin}/products/battery/${batterys.amount} `;
        fetch(urlsapi2, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            
        })
        .then(function(response)  {
            return response.json()
        }).catch(function(error) {
            console.log('Hubo un problema con la petición Fetch:' + error.message);
        })
        .then((data) => {
            console.log('Success:', data);
            let baterias= document.getElementById('baterias_requeridas');
            baterias.innerHTML = `${batterys.amount}`;
            let baterias_tipo= document.getElementById('baterias_tipo');
            baterias_tipo.innerHTML = `${data.battery.name}`;
            let baterias_precio= document.getElementById('baterias_precio');
            baterias_precio.innerHTML = `${data.battery.price}`;
        });
    });
    
    if (nombre == name){
        console.log('es igual');
    }


    // id de los articulos la cantidad y las horas de funcionamiento en una lista con json
    
}
   