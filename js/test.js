let indiceActual = 0;

// =====================
// DATOS
// =====================
let preguntas = JSON.parse(sessionStorage.getItem("test_data")) || listaPreguntas;

// =====================
// ELEMENTOS
// =====================
const contenedor = document.getElementById("contenedor-pregunta");

const btnAnterior = document.getElementById("btnAnterior");
const btnSiguiente = document.getElementById("btnSiguiente");
const btnVerificar = document.getElementById("btnVerificar");
const btnFinalizar = document.getElementById("btnFinalizar");
const btnReiniciar = document.getElementById("btnReiniciar");
const btnDark = document.getElementById("darklight");

// =====================
// 🌙 TEMA DARK / LIGHT
// =====================
function cambiarTema() {
    const html = document.documentElement;
    const body = document.getElementById("app");

    html.classList.toggle("dark");

    if (html.classList.contains("dark")) {
        localStorage.setItem("tema", "dark");
        body?.classList.add("dark:bg-slate-900");
        body?.classList.remove("bg-emerald-300");
    } else {
        localStorage.setItem("tema", "light");
        body?.classList.remove("dark:bg-slate-900");
        body?.classList.add("bg-emerald-300");
    }
}

function aplicarTemaGuardado() {
    const tema = localStorage.getItem("tema");
    const html = document.documentElement;
    const body = document.getElementById("app");

    if (tema === "dark") {
        html.classList.add("dark");
        body?.classList.add("dark:bg-slate-900");
        body?.classList.remove("bg-emerald-300");
    } else {
        html.classList.remove("dark");
        body?.classList.remove("dark:bg-slate-900");
        body?.classList.add("bg-emerald-300");
    }
}

// =====================
// RENDER
// =====================
function renderizar() {
    const p = preguntas[indiceActual];
    if (!p || !contenedor) return;

    const opcionesHTML = Object.values(p.opciones || {})
        .map(op => `
            <label class="block mb-2 cursor-pointer">
                <input type="radio" name="${p.id}" value="${op}"
                    ${p.seleccionada === op ? "checked" : ""}>
                ${op}
            </label>
        `).join("");

    contenedor.innerHTML = `
        <div class="border-4 border-teal-700 border-dashed rounded-3xl py-10 w-full max-w-[650px]
        bg-gradient-to-br from-emerald-400 via-emerald-300 px-6 space-y-4">
            <p class="font-bold text-lg mb-4">${p.texto}</p>
            ${opcionesHTML}
        </div>
    `;
}

// =====================
// VERIFICAR
// =====================
function verificar() {
    const p = preguntas[indiceActual];

    const seleccion = document.querySelector(
        `input[name="${p.id}"]:checked`
    );

    if (!seleccion) {
        alert("Selecciona una opción");
        return;
    }

    p.seleccionada = seleccion.value;
    p.puntosAsignados = (p.seleccionada === p.correcta) ? p.puntos : 0;

    sessionStorage.setItem("test_data", JSON.stringify(preguntas));

    alert(p.puntosAsignados > 0 ? "✔ Correcto" : "❌ Incorrecto");
}


function finalizarTest() {

    let correctas = 0;
    let incorrectas = 0;
    let sinResponder = 0;

    let puntosTotales = 0;
    let puntosObtenidos = 0;

    preguntas.forEach(p => {

        puntosTotales += p.puntos || 1;

        // ⚪ NO CONTESTADA
        if (!p.seleccionada) {
            sinResponder++;
            return;
        }

        // ✔ CORRECTA
        if (p.seleccionada === p.correcta) {
            correctas++;
            puntosObtenidos += p.puntos || 1;
        }

        // ❌ INCORRECTA
        else {
            incorrectas++;
        }
    });

    const porcentaje = preguntas.length
        ? ((correctas / preguntas.length) * 100).toFixed(1)
        : 0;

    contenedor.innerHTML = `
        <div class="bg-white dark:bg-slate-800 dark:text-white p-6 rounded-2xl w-full max-w-[650px] space-y-3">

            <h2 class="text-xl font-bold mb-4">📊 Resultado del Test</h2>

            <p>📌 Total preguntas: <b>${preguntas.length}</b></p>

            <p>✔ Correctas: <b>${correctas}</b></p>
            <p>❌ Incorrectas: <b>${incorrectas}</b></p>
            <p>⚪ No contestadas: <b>${sinResponder}</b></p>

            <hr class="my-3 opacity-40">

            <p>🏆 Puntuación obtenida: <b>${puntosObtenidos}</b></p>
            <p>🎯 Puntuación total: <b>${puntosTotales}</b></p>

            <p class="text-lg font-bold mt-3">
                📈 Porcentaje de acierto: ${porcentaje}%
            </p>

        </div>
    `;
}


// =====================
// INIT
// =====================
document.addEventListener("DOMContentLoaded", () => {

    aplicarTemaGuardado();
    renderizar();

    console.log("BOTÓN DARK:", btnDark);

    if (btnDark) {
        btnDark.addEventListener("click", cambiarTema);
    }

    btnAnterior?.addEventListener("click", () => {
        if (indiceActual > 0) {
            indiceActual--;
            renderizar();
        }
    });

    btnSiguiente?.addEventListener("click", () => {
        if (indiceActual < preguntas.length - 1) {
            indiceActual++;
            renderizar();
        }
    });

    btnVerificar?.addEventListener("click", verificar);

    btnFinalizar?.addEventListener("click", finalizarTest);

    btnReiniciar?.addEventListener("click", () => {
        sessionStorage.clear();
        location.reload();
    });
});