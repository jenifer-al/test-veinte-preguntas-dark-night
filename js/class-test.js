class Pregunta {
    constructor(id, texto, opciones, correcta, justificacion, puntos) {
        this.id = id;
        this.texto = texto;
        this.opciones = opciones;
        this.correcta = correcta;
        this.justificacion = justificacion;
        this.puntos = puntos;
        this.seleccionada = null;
        this.puntosAsignados = 0;
    }
}