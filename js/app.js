import { codigoYeshuaPreguntas } from './content.js';

let indiceActual = 0;
let puntajeAcumulado = 0;
const puntajeMaximo = codigoYeshuaPreguntas.length * 2;

function iniciarCieloNocturno() {
  const cielo = document.getElementById('cielo-nocturno');
  if (!cielo) return;
  cielo.innerHTML = '';
  
  for (let i = 0; i < 14; i++) {
    const estrella = document.createElement('div');
    estrella.className = 'estrella-nocturna';
    
    const size = Math.random() * 2 + 1;
    estrella.style.width = `${size}px`;
    estrella.style.height = `${size}px`;
    estrella.style.top = `${Math.random() * 100}%`;
    estrella.style.left = `${Math.random() * 100}%`;
    estrella.style.animationDuration = `${3 + Math.random() * 4}s`;
    estrella.style.animationDelay = `${Math.random() * 3}s`;
    
    cielo.appendChild(estrella);
  }
}

function configurarControlAudio() {
  const audioFondo = document.getElementById('audio-fondo');
  const btnAudio = document.getElementById('btn-control-audio');

  if (btnAudio && audioFondo) {
    const nuevoBtn = btnAudio.cloneNode(true);
    btnAudio.parentNode.replaceChild(nuevoBtn, btnAudio);

    document.getElementById('btn-control-audio').addEventListener('click', () => {
      if (audioFondo.paused) {
        audioFondo.play().then(() => {
          document.getElementById('btn-control-audio').textContent = '🔊';
        }).catch(err => console.log("Error al reproducir audio:", err));
      } else {
        audioFondo.pause();
        document.getElementById('btn-control-audio').textContent = '🔇';
      }
    });
  }
}

function iniciarAplicacion() {
  const preguntasDiv = document.getElementById('preguntas-dinamicas');
  const topSlot = document.getElementById('top-slot-container');
  
  if (!preguntasDiv || !topSlot) return;

  iniciarCieloNocturno();
  topSlot.innerHTML = '';

  preguntasDiv.innerHTML = `
    <div class="pantalla-bienvenida">
      <h2>Tu huella de Yeshúa</h2>
      <p class="subtitulo-bienvenida">¿Cuánto de las enseñanzas de Jesucristo aplicás en tu vida?</p>
      <div class="contenedor-umbral">
        <img id="btn-comenzar" src="assets/icons/cantaro-agua.png" alt="Revelar mi huella" class="sello-cantaro">
        <span class="texto-tocar-iniciar">Tocar para iniciar</span>
        <p class="subtitulo-explicacion">La huella de Jesucristo se irá iluminando conforme más enseñanzas de él estés aplicando en tu vida</p>
      </div>
    </div>
  `;

  configurarControlAudio();

  const btnComenzar = document.getElementById('btn-comenzar');
  if (btnComenzar) {
    btnComenzar.addEventListener('click', () => {
      indiceActual = 0;
      puntajeAcumulado = 0;

      topSlot.innerHTML = `
        <img id="rostro-yeshua" src="assets/icons/rostro-yeshua.png" alt="Rostro de Yeshúa" class="rostro-imagen-estatica">
      `;

      actualizarRostroVisual();
      
      const audioFondo = document.getElementById('audio-fondo');
      const btnAudio = document.getElementById('btn-control-audio');

      if (audioFondo) {
        audioFondo.volume = 0.35;
        audioFondo.play().then(() => {
          if (btnAudio) btnAudio.textContent = '🔊';
        }).catch(e => {
          console.log("Audio restringido por políticas del navegador", e);
          if (btnAudio) btnAudio.textContent = '🔇';
        });
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
        <span style="font-size: 0.84rem; font-style: italic;">"${p.espejo}"</span>
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
      <button id="btn-reiniciar" style="background: transparent; color: #f2c94c; border: 1px solid #c29b38; padding: 7px 16px; font-size: 0.82rem; border-radius: 25px; cursor: pointer; letter-spacing: 1px;">Volver a realizar el recorrido</button>
    </div>
  `;

  document.getElementById('btn-reiniciar').addEventListener('click', () => {
    iniciarAplicacion();
  });
}

document.addEventListener('DOMContentLoaded', iniciarAplicacion);
