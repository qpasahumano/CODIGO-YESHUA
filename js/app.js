import { codigoYeshuaPreguntas } from './content.js';

const i18nTextos = {
  es: {
    titulo: "Yeshúa, la huella",
    subtitulo: "¿Cuánto de las enseñanzas de Jesucristo aplicás en tu vida?",
    tocarIniciar: "Tocar para iniciar",
    explicacion: "Tu huella brillará según tu andar.",
    resultadoTitulo: "Tu huella de Yeshúa",
    etiquetaAlineacion: "Alineación espiritual global",
    btnReiniciar: "Volver a realizar el recorrido",
    textoInvitacion: "El Código Yeshúa no es una medida de juicio, sino un espejo para observar qué huella estás dejando en tu entorno."
  },
  en: {
    titulo: "Yeshúa, la huella",
    subtitulo: "How much of Jesus Christ's teachings do you apply in your daily life?",
    tocarIniciar: "Tap to begin",
    explicacion: "Your footprint will shine according to your walk.",
    resultadoTitulo: "Your footprint of Yeshúa",
    etiquetaAlineacion: "Global spiritual alignment",
    btnReiniciar: "Start the journey over",
    textoInvitacion: "The Yeshúa Code is not a measure of judgment, but a mirror to observe what footprint you are leaving in your environment."
  }
};

let idiomaActual = localStorage.getItem('yeshua_idioma') || 'es';
let indiceActual = 0;
let puntajeAcumulado = 0;
const puntajeMaximo = codigoYeshuaPreguntas.length * 2;
let juegoIniciado = false;

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

function inicializarControlesGlobales() {
  const btnIdioma = document.getElementById('btn-idioma');
  const btnAudio = document.getElementById('btn-control-audio');
  const audioFondo = document.getElementById('audio-fondo');

  if (btnIdioma && !btnIdioma.dataset.listenerAsignado) {
    btnIdioma.dataset.listenerAsignado = "true";
    btnIdioma.addEventListener('click', () => {
      idiomaActual = idiomaActual === 'es' ? 'en' : 'es';
      localStorage.setItem('yeshua_idioma', idiomaActual);
      
      btnIdioma.textContent = idiomaActual === 'es' ? '🌐 EN' : '🌐 ES';

      if (!juegoIniciado) {
        renderizarBienvenida();
      } else if (indiceActual >= codigoYeshuaPreguntas.length) {
        mostrarHuellaYeshua();
      } else {
        renderizarPregunta();
      }
    });
  }

  if (btnAudio && audioFondo && !btnAudio.dataset.listenerAsignado) {
    btnAudio.dataset.listenerAsignado = "true";
    btnAudio.addEventListener('click', () => {
      if (audioFondo.paused) {
        audioFondo.play().then(() => {
          btnAudio.textContent = '🔊';
        }).catch(err => console.log("Error al reproducir audio:", err));
      } else {
        audioFondo.pause();
        btnAudio.textContent = '🔇';
      }
    });
  }
}

function iniciarAplicacion() {
  indiceActual = 0;
  puntajeAcumulado = 0;
  juegoIniciado = false;

  iniciarCieloNocturno();
  inicializarControlesGlobales();

  const topSlot = document.getElementById('top-slot-container');
  if (topSlot) topSlot.innerHTML = '';

  renderizarBienvenida();
}

function renderizarBienvenida() {
  const preguntasDiv = document.getElementById('preguntas-dinamicas');
  const topSlot = document.getElementById('top-slot-container');
  const btnIdioma = document.getElementById('btn-idioma');

  if (!preguntasDiv) return;

  if (btnIdioma) {
    btnIdioma.textContent = idiomaActual === 'es' ? '🌐 EN' : '🌐 ES';
  }

  if (topSlot && !juegoIniciado) {
    topSlot.innerHTML = '';
  }

  const t = i18nTextos[idiomaActual];

  preguntasDiv.innerHTML = `
    <div class="pantalla-bienvenida">
      <div>
        <h2>${t.titulo}</h2>
        <p class="subtitulo-bienvenida">${t.subtitulo}</p>
      </div>
      <div class="contenedor-umbral">
        <img id="btn-comenzar" src="assets/icons/cantaro-agua.png" alt="Revelar mi huella" class="sello-cantaro">
        <span class="texto-tocar-iniciar">${t.tocarIniciar}</span>
      </div>
      <div>
        <p class="subtitulo-explicacion">${t.explicacion}</p>
      </div>
    </div>
  `;

  const btnComenzar = document.getElementById('btn-comenzar');
  if (btnComenzar) {
    btnComenzar.addEventListener('click', () => {
      juegoIniciado = true;
      
      if (topSlot) {
        topSlot.innerHTML = `
          <img id="rostro-yeshua" src="assets/icons/rostro-yeshua.png" alt="Rostro de Yeshúa" class="rostro-imagen-estatica">
        `;
      }

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
  const btnIdioma = document.getElementById('btn-idioma');
  if (!contenedor) return;

  if (btnIdioma) {
    btnIdioma.textContent = idiomaActual === 'es' ? '🌐 EN' : '🌐 ES';
  }

  if (indiceActual >= codigoYeshuaPreguntas.length) {
    mostrarHuellaYeshua();
    return;
  }

  const p = codigoYeshuaPreguntas[indiceActual];
  const preguntasDiv = document.getElementById('preguntas-dinamicas') || contenedor;

  const esIngles = idiomaActual === 'en';
  const enunciadoTexto = esIngles && p.enunciadoEn ? p.enunciadoEn : p.enunciado;
  const espejoTexto = esIngles && p.espejoEn ? p.espejoEn : p.espejo;
  
  let opcionesActuales = p.opciones;
  if (esIngles && p.opcionesEn && p.opcionesEn.length > 0) {
    opcionesActuales = p.opcionesEn;
  }

  preguntasDiv.innerHTML = `
    <div class="tarjeta-pergamino">
      <div class="referencia-biblica">
        <strong>📖 ${p.referenciaBiblica}</strong><br>
        <span style="font-size: 0.82rem; font-style: italic;">"${espejoTexto}"</span>
      </div>
      <div class="pregunta-enunciado"><h3>${p.id}. ${enunciadoTexto}</h3></div>
      <div class="opciones-lista">
        ${opcionesActuales.map((op) => `
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
  const btnIdioma = document.getElementById('btn-idioma');
  if (!preguntasDiv) return;

  if (btnIdioma) {
    btnIdioma.textContent = idiomaActual === 'es' ? '🌐 EN' : '🌐 ES';
  }

  const porcentajeTotal = Math.round((puntajeAcumulado / puntajeMaximo) * 100);
  const t = i18nTextos[idiomaActual];

  let mensajeReflexivo = "";
  if (idiomaActual === 'es') {
    if (porcentajeTotal >= 80) {
      mensajeReflexivo = "Tu andar refleja una profunda sintonía con las enseñanzas y el espíritu de los Evangelios en tu vida cotidiana.";
    } else if (porcentajeTotal >= 50) {
      mensajeReflexivo = "Te encontrás en un camino consciente de crecimiento, con un equilibrio firme y áreas abiertas a seguir transformando.";
    } else {
      mensajeReflexivo = "Este recorrido te invita a pausar y contemplar nuevos horizontes de empatía, servicio y transformación interior.";
    }
  } else {
    if (porcentajeTotal >= 80) {
      mensajeReflexivo = "Your walk reflects a deep harmony with the teachings and spirit of the Gospels in your daily life.";
    } else if (porcentajeTotal >= 50) {
      mensajeReflexivo = "You find yourself on a conscious path of growth, with a firm balance and open areas to continue transforming.";
    } else {
      mensajeReflexivo = "This journey invites you to pause and contemplate new horizons of empathy, service, and inner transformation.";
    }
  }

  preguntasDiv.innerHTML = `
    <div class="resultado-final">
      <h2>${t.resultadoTitulo}</h2>
      <div class="tarjeta-resumen">
        <p class="puntaje-final">${t.etiquetaAlineacion}: <strong>${porcentajeTotal}%</strong></p>
        <p class="mensaje-evolutivo">${mensajeReflexivo}</p>
      </div>
      <p class="texto-invitacion">${t.textoInvitacion}</p>
      <button id="btn-reiniciar" style="background: transparent; color: #f2c94c; border: 1px solid #c29b38; padding: 7px 16px; font-size: 0.82rem; border-radius: 25px; cursor: pointer; letter-spacing: 1px;">${t.btnReiniciar}</button>
    </div>
  `;

  document.getElementById('btn-reiniciar').addEventListener('click', () => {
    iniciarAplicacion();
  });
}

document.addEventListener('DOMContentLoaded', iniciarAplicacion);
  
