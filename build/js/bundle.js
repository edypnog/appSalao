async function mostrarServicos(){try{const o=await fetch("./servicios.json"),c=await o.json(),{servicios:n}=c;console.log(o),n.forEach(o=>{})}catch(o){console.log(o)}}document.addEventListener("DOMContentLoaded",(function(){mostrarServicos()}));