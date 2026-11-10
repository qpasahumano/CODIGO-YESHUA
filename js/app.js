import { codigoYeshuaPreguntas } from './content.js';

let indiceActual = 0;
let puntajeAcumulado = 0;
const puntajeMaximo = codigoYeshuaPreguntas.length * 2; // 54 puntos totales

function iniciarAplicacion() {
  const preguntasDiv = document.getElementById('preguntas-dinamicas');
  if (!preguntasDiv) return;

  // Renderizamos la pantalla inicial con la vasija interactiva
  preguntasDiv.innerHTML = `
    <div class="pantalla-bienvenida">
      <h2>Tu huella de Yeshúa</h2>
      <p class="subtitulo-bienvenida">¿Cuánto de las enseñanzas de Jesucristo aplicás en tu vida?</p>
      <div class="contenedor-umbral">
        <img id="btn-comenzar" src="assets/icons/cantaro-agua.png" alt="Revelar mi código huella" class="sello-cantaro">
        <span class="subtitulo-cantaro">Tocar para iniciar</span>
      </div>
    </div>
  `;

  // Aseguramos la captura del botón (imagen) ni bien se dibuja en el DOM
  const btnComenzar = document.getElementById('btn-comenzar');
  if (btnComenzar) {
    btnComenzar.addEventListener('click', () => {
      indiceActual = 0;
      puntajeAcumulado = 0;
      actualizarRostroVisual();
      
      // Activar la música ambiental tenue y sutil al iniciar la experiencia
      const audioFondo = document.getElementById('audio-fondo');
      if (audioFondo) {
        audioFondo.volume = 0.3; // Volumen tenue (30%)
        audioFondo.play().catch(e => console.log("Audio autoplay bloqueado o restringido por el navegador", e));
      }

      renderizarPregunta();
    });
  }
}

function renderizarPregunta() {
  const contenedor = document.getElementById('quiz-container');
  if (!contenedor) return;

  if (indiceActual >= codigoYeshuaPreguntas.length) {
    mostrarHuellaYeshua();
    return;
  }

  const p = codigoYeshuaPreguntas[indiceActual];
  const preguntasDiv = document.getElementById('preguntas-dinamicas') || contenedor;

  preguntasDiv.innerHTML = `
    <div class="bloque-info">Bloque ${p.bloque} - ${p.categoria}</div>
    <div class="pregunta-enunciado"><h3>${p.id}. ${p.enunciado}</h3></div>
    <div class="opciones-lista">
      ${p.opciones.map((op) => `
        <button class="opcion-btn" data-peso="${op.peso}">
          ${op.texto}
        </button>
      `).join('')}
    </div>
  `;

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
  
  // Con la imagen estática png, manejamos la opacidad y los filtros en base al porcentaje
  const rostroImg = document.getElementById('rostro-yeshua');
  const textoProgreso = document.getElementById('progreso-texto');

  if (textoProgreso) {
    textoProgreso.textContent = `Alineación espiritual: ${Math.round(porcentaje)}%`;
  }

  if (rostroImg) {
    // Cálculo dinámico de opacidad y brillo según el progreso (de 0.25 a 1.0)
    const opacidadCalculada = Math.max(0.25, porcentaje / 100);
    rostroImg.style.opacity = opacidadCalculada;

    if (porcentaje >= 80) {
      rostroImg.style.filter = 'drop-shadow(0 0 16px rgba(242, 201, 76, 0.6)) grayscale(0%)';
    } else if (porcentaje >= 40) {
      rostroImg.style.filter = 'drop-shadow(0 0 8px rgba(194, 155, 56, 0.3)) grayscale(30%)';
    } else {
      rostroImg.style.filter = 'drop-shadow(0 4px 15px rgba(0, 0, 0, 0.6)) grayscale(80%)';
    }
  }
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
      <button id="btn-reiniciar" class="sello-umbral">Volver a realizar el recorrido</button>
    </div>
  `;

  document.getElementById('btn-reiniciar').addEventListener('click', () => {
    iniciarAplicacion();
  });
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', iniciarAplicacion);
