const apiURL = 'https://mindicador.cl/api/'

async function getMonedas() {
    const res = await fetch(apiURL);
    const monedas = await res.json();
     return(monedas);
}

async function renderMonedas() {
    const resultado = document.getElementById('resultado'); // Mostrará el total convertido
    const pesos = document.getElementById('pesos').value; // Pesos CL a convertir
    const tipomoneda = document.getElementById('tipoMoneda').value; // Dolar, euro o UF
    const monedas = await getMonedas();
    valoraConvertir = monedas[tipomoneda].valor;
    resultadoFinal = pesos/valoraConvertir;
    resultado.innerHTML = `<p>Total: ${resultadoFinal.toFixed(2)}</p>`;
    renderGrafica(tipomoneda);
}


async function getTipoMonedas(tipomoneda) {
    const apiURL2 = apiURL + tipomoneda;
    const res = await fetch(apiURL2);
    const monedas = await res.json();
     return(monedas);
}

function prepararConfiguracionParaLaGrafica(monedas) {
    // Creamos las variables necesarias para el objeto de configuración
    const tipoDeGrafica = "line";
    const titulo = "Monedas";
    const colorDeLinea = "blue";
    let monedas10 = monedas.serie.slice(0,10); // arreglo solo con los ultimos 10 registros
    const nombresDeLasMonedas = monedas10.map((moneda) => moneda.fecha); // Datos en Eje X
    const valores = monedas10.map((moneda) => moneda.valor); // Datos en Eje Y

    // Creamos el objeto de configuración usando las variables anteriores
    const config = {
        type: tipoDeGrafica,
        data: {
            labels: nombresDeLasMonedas, // Eje X
            datasets: [
                {
                    label: titulo,
                    backgroundColor: colorDeLinea, // color gráfico 
                    data: valores // Eje Y
                }
            ]
        }
    };
    return config;
}

async function renderGrafica(tipomoneda) {
    const monedas = await getTipoMonedas(tipomoneda);
    const config = prepararConfiguracionParaLaGrafica(monedas);
    const chartDOM = document.getElementById("myChart");
    new Chart(chartDOM, config);
}                

