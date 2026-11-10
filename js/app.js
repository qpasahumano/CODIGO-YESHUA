import { codigoYeshuaPreguntas } from './content.js';

let indiceActual = 0;
let puntajeAcumulado = 0;
const puntajeMaximo = codigoYeshuaPreguntas.length * 2; // 54 puntos totales

function iniciarAplicacion() {
  const preguntasDiv = document.getElementById('preguntas-dinamicas');
  const topSlot = document.getElementById('top-slot-container');
  const footerContainer = document.getElementById('footer-container');
  
  if (!preguntasDiv || !topSlot) return;

  // En la pantalla principal mostramos la firma institucional al pie
  if (footerContainer) {
    footerContainer.style.display = 'block';
  }

  topSlot.innerHTML = '';

  preguntasDiv.innerHTML = `
    <div class="pantalla-bienvenida">
      <h2>Tu huella de Yeshúa</h2>
      <p class="subtitulo-bienvenida">¿Cuánto de las enseñanzas de Jesucristo aplicás en tu vida?</p>
      <div class="contenedor-umbral">
        <img id="btn-comenzar" src="assets/icons/cantaro-agua.png" alt="Revelar mi código huella" class="sello-cantaro">
        <span class="texto-tocar-iniciar">Tocar para iniciar</span>
        <p class="subtitulo-explicacion">La huella de Jesucristo se irá iluminando conforme más enseñanzas de él estés aplicando en tu vida</p>
      </div>
    </div>
  `;

  const btnComenzar = document.getElementById('btn-comenzar');
  if (btnComenzar) {
    btnComenzar.addEventListener('click', () => {
      indiceActual = 0;
      puntajeAcumulado = 0;

      // Al iniciar el quiz, ocultamos la firma del pie para ganar espacio visual y mostramos solo el rostro grande
      if (footerContainer) {
        footerContainer.style.display = 'none';
      }

      topSlot.innerHTML = `
        <img id="rostro-yeshua" src="assets/icons/rostro-yeshua.png" alt="Rostro de Yeshúa" class="rostro-imagen-estatica">
      `;

      actualizarRostroVisual();
      
      const audioFondo = document.getElementById('audio-fondo');
      if (audioFondo) {
        audioFondo.volume = 0.3;
        audioFondo.play().catch(e => console.log("Audio restringido por el navegador", e));
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
    <div class="tarjeta-pergamino">
      <div class="referencia-biblica">
        <strong>📖 ${p.referenciaBiblica}</strong><br>
        <span style="font-size: 0.9rem; font-style: italic;">"${p.espejo}"</span>
      </div>
      <div class="pregunta-enunciado"><h3>${p.id}. ${p.enunciado}</h3></div>
      <div class="opciones-lista">
        ${p.opciones.map((op) => `
          <button class="opcion-btn" data-peso="${op.peso}">
            ${op.texto}
          </button>
        `).join('')}
      </div>
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
  const rostroImg = document.getElementById('rostro-yeshua');

  if (rostroImg) {
    let opacidadCalculada = 0.02 + Math.pow(porcentaje / 100, 2.0) * 0.98;
    rostroImg.style.opacity = opacidadCalculada;

    if (porcentaje >= 75) {
      rostroImg.style.filter = 'drop-shadow(0 0 18px rgba(242, 201, 76, 0.8)) grayscale(0%) contrast(1.15) brightness(1.12)';
    } else if (porcentaje >= 45) {
      rostroImg.style.filter = 'drop-shadow(0 0 10px rgba(194, 155, 56, 0.5)) grayscale(25%) contrast(1.25)';
    } else if (indiceActual >= 20 && porcentaje < 30) {
      rostroImg.style.filter = 'drop-shadow(0 0 12px rgba(242, 201, 76, 0.45)) grayscale(80%) contrast(1.5) brightness(0.75)';
    } else {
      rostroImg.style.filter = 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.8)) grayscale(100%) contrast(1.7) brightness(0.55)';
    }
  }
}

function mostrarHuellaYeshua() {
  const preguntasDiv = document.getElementById('preguntas-dinamicas') || document.getElementById('quiz-container');
  const footerContainer = document.getElementById('footer-container');
  if (!preguntasDiv) return;

  // Reactivamos la firma al pie en la pantalla final si se desea, o la dejamos limpia
  if (footerContainer) {
    footerContainer.style.display = 'block';
  }

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
      <button id="btn-reiniciar" style="background: transparent; color: #f2c94c; border: 1px solid #c29b38; padding: 8px 18px; font-size: 0.85rem; border-radius: 25px; cursor: pointer; letter-spacing: 1px;">Volver a realizar el recorrido</button>
    </div>
  `;

  document.getElementById('btn-reiniciar').addEventListener('click', () => {
    iniciarAplicacion();
  });
}

document.addEventListener('DOMContentLoaded', iniciarAplicacion);
