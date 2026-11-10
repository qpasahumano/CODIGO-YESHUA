import { codigoYeshuaPreguntas } from './content.js';

let indiceActual = 0;
let puntajeAcumulado = 0;
const puntajeMaximo = codigoYeshuaPreguntas.length * 2; // 54 puntos totales

export function iniciarAplicacion() {
  indiceActual = 0;
  puntajeAcumulado = 0;
  renderizarPregunta();
}

function renderizarPregunta() {
  const contenedor = document.getElementById('quiz-container');
  if (!contenedor) return;

  if (indiceActual >= codigoYeshuaPreguntas.length) {
    mostrarHuellaYeshua();
    return;
  }

  const p = codigoYeshuaPreguntas[indiceActual];

  // Mantenemos el contenedor del quiz separado o aseguramos que no pise el rostro
  const preguntasDiv = document.getElementById('preguntas-dinamicas') || contenedor;

  preguntasDiv.innerHTML = `
    <div class="bloque-info">Bloque ${p.bloque} - ${p.categoria}</div>
    <div class="pregunta-enunciado"><h3>${p.id}. ${p.enunciado}</h3></div>
    <div class="opciones-lista">
      ${p.opciones.map((op, idx) => `
        <button class="opcion-btn" data-peso="${op.peso}">
          ${op.texto}
        </button>
      `).join('')}
    </div>
  `;

  // Asignar eventos a los botones de opción
  preguntasDiv.querySelectorAll('.opcion-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const pesoSeleccionado = parseInt(e.currentTarget.getAttribute('data-peso'));
      procesarRespuesta(pesoSeleccionado);
    });
  });
}

function procesarRespuesta(peso) {
  puntajeAcumulado += peso;
  actualizarRostroVisual();
  indiceActual++;
  renderizarPregunta();
}

function actualizarRostroVisual() {
  const porcentaje = (puntajeAcumulado / puntajeMaximo) * 100;
  const capas = document.querySelectorAll('.trazo-rostro');
  const textoProgreso = document.getElementById('progreso-texto');

  if (textoProgreso) {
    textoProgreso.textContent = `Alineación espiritual: ${Math.round(porcentaje)}%`;
  }

  capas.forEach((capa, index) => {
    const umbralPleno = (index + 1) * 33;
    const umbralLight = (index + 1) * 15;

    if (porcentaje >= umbralPleno) {
      capa.classList.remove('estado-oculto', 'estado-light');
      capa.classList.add('estado-pleno');
    } else if (porcentaje >= umbralLight) {
      capa.classList.remove('estado-oculto', 'estado-pleno');
      capa.classList.add('estado-light');
    } else {
      capa.classList.remove('estado-pleno', 'estado-light');
      capa.classList.add('estado-oculto');
    }
  });
}

function mostrarHuellaYeshua() {
  const preguntasDiv = document.getElementById('preguntas-dinamicas') || document.getElementById('quiz-container');
  if (!preguntasDiv) return;

  const porcentajeTotal = Math.round((puntajeAcumulado / puntajeMaximo) * 100);

  let mensajeReflexivo = "";
  if (porcentajeTotal >= 80) {
    mensajeReflexivo = "Tu andar refleja una profunda sintonía con las enseñanzas y el espíritu de los Evangelios en tu vida cotidiana.";
  } else if (porcentajeTotal >= 50) {
    mensajeReflexivo = "Te encontrás en un camino consciente de crecimiento, con un equilibrio firme y áreas abiertas a seguir transformando.";
  } else {
    mensajeReflexivo = "Este recorrido te invita a pausar y contemplar nuevos horizontes de empatía, servicio y transformación interior.";
  }

  preguntasDiv.innerHTML = `
    <div class="resultado-final">
      <h2>Tu huella de Yeshúa</h2>
      <div class="tarjeta-resumen">
        <p class="puntaje-final">Alineación espiritual global: <strong>${porcentajeTotal}%</strong></p>
        <p class="mensaje-evolutivo">${mensajeReflexivo}</p>
      </div>
      <p class="texto-invitacion">El Código Yeshúa no es una medida de juicio, sino un espejo para observar qué huella estás dejando en tu entorno.</p>
      <button id="btn-reiniciar" class="btn-principal">Volver a realizar el recorrido</button>
    </div>
  `;

  document.getElementById('btn-reiniciar').addEventListener('click', () => {
    iniciarAplicacion();
  });
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', iniciarAplicacion);
