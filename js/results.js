/**
 * results.js - Módulo de procesamiento y visualización de resultados
 * Yeshúa, la huella / qpasahumano
 */

export function calcularPorcentaje(puntajeAcumulado, puntajeMaximo) {
  if (!puntajeMaximo || puntajeMaximo === 0) return 0;
  return Math.round((puntajeAcumulado / puntajeMaximo) * 100);
}

export function obtenerMensajeReflexivo(porcentaje, idiomaActual = 'es') {
  if (idiomaActual === 'es') {
    if (porcentaje >= 80) {
      return "Tu andar refleja una profunda sintonía con las enseñanzas y el espíritu de los Evangelios en tu vida cotidiana.";
    } else if (porcentaje >= 50) {
      return "Te encontrás en un camino consciente de crecimiento, con un equilibrio firme y áreas abiertas a seguir transformando.";
    } else {
      return "Este recorrido te invita a pausar y contemplar nuevos horizontes de empatía, servicio y transformación interior.";
    }
  } else {
    if (porcentaje >= 80) {
      return "Your walk reflects a deep harmony with the teachings and spirit of the Gospels in your daily life.";
    } else if (porcentaje >= 50) {
      return "You find yourself on a conscious path of growth, with a firm balance and open areas to continue transforming.";
    } else {
      return "This journey invites you to pause and contemplate new horizons of empathy, service, and inner transformation.";
    }
  }
}

