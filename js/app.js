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
    mostrarLecturaEvolutiva();
    return;
  }

  const p = codigoYeshuaPreguntas[indiceActual];

  contenedor.innerHTML = `
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
  contenedor.querySelectorAll('.opcion-btn').forEach(btn => {
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

function mostrarLecturaEvolutiva() {
  const contenedor = document.getElementById('quiz-container');
  if (!contenedor) return;

  contenedor.innerHTML = `
    <div class="resultado-final">
      <h2>Evaluación Concluida</h2>
      <p>Has completado el recorrido por el Código Yeshúa.</p>
      <button id="btn-lectura-evolutiva" class="btn-principal">Lectura evolutiva</button>
    </div>
  `;

  document.getElementById('btn-lectura-evolutiva').addEventListener('click', () => {
    // Aquí se despliegan los espejos bíblicos y la devolución detallada
    alert("Mostrando detalles de la Lectura evolutiva y espejos bíblicos...");
  });
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', iniciarAplicacion);
