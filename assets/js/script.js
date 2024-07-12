const apiURL = "https://mindicador.cl/api/";
let tipomoneda = document.getElementById("tipoMoneda").value;
let myChart;

async function getMonedas() {
    // Obtener datos de la API
    const res = await fetch(apiURL);
    const monedas = await res.json();
    return monedas;
}

async function renderMonedas() {
  try {
    const pesos = document.getElementById("pesos").value; // Pesos CL a convertir
    // const tipomoneda = document.getElementById("tipoMoneda").value; // Dolar, euro o UF
    const resultado = document.getElementById("resultado"); // Resultado del total convertido
    const monedas = await getMonedas();
    valoraConvertir = monedas[tipomoneda].valor;
    resultadoFinal = pesos / valoraConvertir;
    resultado.innerHTML = `<p>Total: ${resultadoFinal.toFixed(2)}</p>`;
    renderGrafica(tipomoneda);
  } catch (error) {
    console.log(`ERROR al obtener los datos de la API`);
    const errorSpan = document.getElementById("error");
    errorSpan.innerHTML = `<p><strong>*** Error: ${error.message} ***</strong></p>`;
  }
}

async function getTipoMonedas(tipomoneda) {
  const apiURL2 = apiURL + tipomoneda;
  const res = await fetch(apiURL2);
  const monedas = await res.json();
  const monedas10 = (monedas.serie.slice(0, 10)).reverse();
  return monedas10;
}

function prepararConfiguracionParaLaGrafica(monedas10) {
  // Creamos las variables necesarias para el objeto de configuración
  const tipoDeGrafica = "line";
  const titulo = "Moneda: ";
  const colorDeLinea = "blue";
//   let monedas10 = monedas.serie.slice(0, 10); // arreglo solo con los ultimos 10 registros
  const nombresDeLasMonedas = monedas10.map((moneda) => moneda.fecha.substring(0, 10)); // Datos en Eje X
  const valores = monedas10.map((moneda) => moneda.valor); // Datos en Eje Y
  // Crear objeto de configuración usando variables anteriores
  const config = {
    type: tipoDeGrafica,
    data: {
      labels: nombresDeLasMonedas, // Eje X
      datasets: [
        {
          label: `${titulo} ${tipomoneda.toUpperCase()}`,
          backgroundColor: colorDeLinea, // color gráfico
          data: valores, // Eje Y
        },
      ],
    },
  };
  return config;
}

async function renderGrafica(tipomoneda) {
    try {
        const monedas = await getTipoMonedas(tipomoneda);
        const config = prepararConfiguracionParaLaGrafica(monedas);
        let chartDOM = document.getElementById("myChart");
        console.log(myChart);
        if (myChart) {
            console.log('destruye mychart con moneda ' + tipomoneda);
            myChart.destroy();
            myChart = new Chart(chartDOM, config);
        }else {
            console.log('crea mychart con moneda ' + tipomoneda);
            myChart = new Chart(chartDOM, config);
        }
        
    } catch (error) {
            const errorSpan = document.getElementById("errorGraf");
            errorSpan.innerHTML = `<p><strong>*** Error al generar gráfico: ${error.message} ***</strong></p>`;
    }
}

