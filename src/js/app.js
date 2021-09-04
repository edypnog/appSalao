let pagina = 1;

const cita = {
    nombre: '',
    data: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function(){

    // Consulta los Servicios
    iniciar();
    
});

function iniciar(){
    mostrarServicos();

    // resalta el div actual segun el tab al que se presiona
    mostrarSeccion();

    // oculta o muestra una seccion segun el tab al que se presiona
    cambiarSeccion();

    // paginacion siguiente y anterior
    paginaSeguinte();

    paginaAnterior();

    // combrueba la pagina actual para ocultar o mostrar la paginacion
    botonesPaginador();

    // muestra el resumen de la cita
    mostrarResumo();

    // armazena o nome no objeto
    nombreCita();

    // armazena a data no objeto
    dataCita();

    // desabilita dias anteriores 
    disablePrevData();

    // armazena a hora no objeto
    horaCita();
}

function mostrarSeccion(){

    // Eliminar mostrar-seccion de la sección anterior
    const seccionAnterior = document.querySelector('.mostrar-seccion');
    if( seccionAnterior ) {
        seccionAnterior.classList.remove('mostrar-seccion');
    }

    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    // Eliminar la clase de actual en el tab anterior
    const tabAnterior = document.querySelector('.tabs .actual');
    if(tabAnterior) {
        tabAnterior.classList.remove('actual');
    }
   
    // Resalta el Tab Actual
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual');
}

function cambiarSeccion(){
    const enlaces = document.querySelectorAll('.tabs button');

    enlaces.forEach(enlace => {
        enlace.addEventListener('click', (element) => {

            element.preventDefault();
            pagina = parseInt(element.target.dataset.paso);

            // Llamar la función de mostrar sección
            mostrarSeccion();

            botonesPaginador();

        })
    })
}
 

async function mostrarServicos(){    
    try {
        const resultado = await fetch('./servicios.json')
        const db = await resultado.json();

        const {servicios} = db;
        
        // Generar el HTML

        servicios.forEach(servicio => {
            const { id, nombre, precio } = servicio;

            // DOM SCRIPTING
            
            // nome
            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre
            nombreServicio.classList.add('nombre-servicio');

            // preço
            const precioServicio = document.createElement('H2');
            precioServicio.textContent = `$${precio}`;
            precioServicio.classList.add('precio-servicio');

            // gerar div
            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList.add('servicio');
            servicioDiv.dataset.idServicio = id;

            // selecciona un servicio para la cita
            servicioDiv.onclick = selecionarServico;
            
            // add preço e nome na div
            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);

            // inyectar en HTML
            document.querySelector('#servicios').appendChild(servicioDiv);

            
        });

    } catch (error) {
        console.log(error)
    }
}

function selecionarServico(e){

    let elemento;

    if (e.target.tagName === 'P' || e.target.tagName === 'H2') {
        elemento = e.target.parentElement;
    } else {
        elemento = e.target;
    }

    if(elemento.classList.contains('seleccionado')){
        elemento.classList.remove('seleccionado');

        const id = parseInt(elemento.dataset.idServicio);

        eliminarServicio(id);
    } else {
        elemento.classList.add('seleccionado');

        const servicioObj = {
            id: parseInt(elemento.dataset.idServicio),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent

        }

        agregarServicio(servicioObj);
    }
}


function eliminarServicio(id) {
    const { servicios } = cita;
    cita.servicios = servicios.filter( servicio => servicio.id !== id );
 
    console.log(cita);
 }
 

 function agregarServicio(servicioObj) {
    const { servicios } = cita;
    cita.servicios = [...servicios, servicioObj];

    console.log(cita);
}


function paginaSeguinte() {
    const paginaSeguinte = document.querySelector('#seguinte');
    paginaSeguinte.addEventListener('click', ()=> {
        pagina++;
        botonesPaginador();
    });
}

function paginaAnterior() {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', ()=> {
        pagina--;
        botonesPaginador();
    });
    
}

function botonesPaginador() {
    const paginaAnterior = document.querySelector('#anterior');
    const paginaSeguinte = document.querySelector('#seguinte');

    if(pagina === 1) {
        paginaAnterior.classList.add('ocultar');
    
    } else if(pagina === 3) {
        paginaSeguinte.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');

        mostrarResumo(); // estamos na pag 3
    } else {        
        paginaAnterior.classList.remove('ocultar');
        paginaSeguinte.classList.remove('ocultar');
    }

    mostrarSeccion();
}

function mostrarResumo(){
    // destructuring
    const {nombre, data, hora, servicios} = cita;

    // seleccionar el resumen
    const resumenDiv = document.querySelector('.conteudo-resumo');

    // limpar html
    while (resumenDiv.firstChild) {
        resumenDiv.removeChild(resumenDiv.firstChild)
    }
    
    // validacion
    if(Object.values(cita).includes('')){
        const noServicios = document.createElement('P');
        noServicios.textContent = 'Faltam dados para o serviço.';

        noServicios.classList.add('invalidar-cita');

        // agregar a resumen div
        resumenDiv.appendChild(noServicios);
        
        return;
    } 
    
    const serviciosCita = document.createElement('DIV');
    serviciosCita.classList.add('resumen-servicios');

    let quantidade = 0;
    
    // iterar sobre el arreglo del servicio
    servicios.forEach( servicio => {
        
        const { nombre, precio } = servicio;
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');
        
        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;
        
        const precioServicio = document.createElement('P');
        precioServicio.textContent = precio;
        precioServicio.classList.add('precio-servicio')

        const totalServicio = precio.split('$');

        quantidade += parseInt(totalServicio[1].trim());
        
        // add in div
        
        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);
        
        serviciosCita.appendChild(contenedorServicio);
        
        
    }) 
    
    // mostrar resumo
    const headingServicio = document.createElement('H2');
    headingServicio.textContent = 'Resumo do serviço'
    
    const nombreCita = document.createElement('P')
    nombreCita.innerHTML = `<span>Nome:</span> ${nombre}`
    
    const dataCita = document.createElement('P')
    dataCita.innerHTML = `<span>Data:</span> ${data}`
    
    const horaCita = document.createElement('P')
    horaCita.innerHTML = `<span>Horário:</span> ${hora}`
    

    
    serviciosCita.appendChild(headingServicio);
    resumenDiv.appendChild(nombreCita);
    resumenDiv.appendChild(dataCita);
    resumenDiv.appendChild(horaCita);
    
    resumenDiv.appendChild(serviciosCita);

    const quantidadePagar = document.createElement('P');
    quantidadePagar.innerHTML = `<span>Total a pagar: </span> <p>${quantidade}</p>`;
    quantidadePagar.classList.add('total');

    resumenDiv.appendChild(quantidadePagar);
}   

function nombreCita(){
    const nombreInput = document.querySelector('#nome');

    nombreInput.addEventListener('input', e =>{
        const nombreTexto = e.target.value.trim();

        if (nombreTexto === '' || nombreTexto.length < 3){
            mostrarAlerta('O nome informado é inválido.', 'error')
        } else {
            const alerta = document.querySelector('.alerta');
            if(alerta){
                alerta.remove();
            }
            cita.nombre = nombreTexto;
        }
    });
}

function mostrarAlerta(mensaje, tipo){
    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia){
        return;
    }

    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');

    if(tipo === 'error') {
        alerta.classList.add('error');
    }

    const formulario = document.querySelector('.formulario');
    formulario.appendChild(alerta)

    setTimeout(function(){
        formulario.removeChild(alerta)
    }, 3000)
}

function dataCita(){
    const dataInput = document.querySelector('#data');
    dataInput.addEventListener('input', (e) =>{

        const dia = new Date(e.target.value).getUTCDay();

        if ([0].includes(dia)){
            e.preventDefault();
            dataInput.value = '';
            mostrarAlerta('Não foi possível selecionar a data informada.', 'error')
        } else {
            cita.data = dataInput.value;
        }
    });
}

function disablePrevData(){

    const inputData = document.querySelector('#data');
    const dataNow = new Date();
    const year = dataNow.getFullYear();
    const month = dataNow.getMonth() + 1;
    const day = dataNow.getDate() + 1;
    const disable = `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;

    inputData.min = disable;
}

function horaCita(){
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', e => {
        const horaCita = e.target.value;
        const hora = horaCita.split(':');

        if(hora[0] < 10 || hora[0] > 18){
            mostrarAlerta('Hora inválida', 'error')
            setTimeout(()=>{
                inputHora.value = '';
            }, 3000);
        } else {    
            cita.hora = horaCita;
        }
    });
}