const validacion =/^[0-9]+[+-/*]{1}[0-9]+$|^[0-9]+[+-/*]{1]\([0-9]+[+-/*]{1}[0-9]+\)$|^\([0-9]+[+-/*]{1}[0-9]+\)[+-/*][0-9]+$|^\([0-9]+[+-/*]{1}[0-9]+\)[+-/*]\([0-9]+[+-/*]{1}[0-9]+\)$/;
const arbol = document.getElementById("contenido_arbol");
const estilos = {
    color: '#1221a5ff',
    outline: false,
    endPlugOutLine: false,
    endPlugSize: 1,
    startPlug: 'behind',
    endPlug: 'behind'
};
// Nodo número
const nodo = (valor, id) => {
    return `<div class='col-2 text-center'><span id="${id}" class='btn btn-warning rounded-circle'>${valor}</span></div>`;
};
// Nodo operador
const nodo2 = (valor, id) => {
    return `<div class='col-2 text-center'><span id="${id}" class='btn btn-danger rounded-circle'>${valor}</span></div>`;
};
// Dibujar subárbol 
const generar_arbol = (izq, op, der, id, depth) => {
    let nivel = obtenerNivel(depth);

    let dibujo = `
        ${izq ? nodo(izq, "a" + id) : ""}
        ${nodo2(op, "o" + id)}
        ${der ? nodo(der, "b" + id) : ""}
    `;

    nivel.innerHTML += dibujo;
};

// Conectar nodos
const conectar = (id) => {
    const operador = document.getElementById("o" + id);
    const a = document.getElementById("a" + id);
    const b = document.getElementById("b" + id);

    if (a) new LeaderLine(operador, a, estilos);
    if (b) new LeaderLine(operador, b, estilos);
};

// ----------------- PARSER RECURSIVO -----------------
function parseExpresion(exp) {
    exp = exp.trim();

    if (exp.startsWith("(") && exp.endsWith(")")) {
        let count = 0, valido = true;
        for (let i = 0; i < exp.length; i++) {
            if (exp[i] == "(") count++;
            if (exp[i] == ")") count--;
            if (count == 0 && i < exp.length - 1) { valido = false; break; }
        }
        if (valido) return parseExpresion(exp.slice(1, -1));
    }

    let nivel = 0;
    for (let i = exp.length - 1; i >= 0; i--) {
        let c = exp[i];
        if (c == ")") nivel++;
        if (c == "(") nivel--;
        if (nivel == 0 && /[+\-*/]/.test(c)) {
            return {
                op: c,
                izq: parseExpresion(exp.slice(0, i)),
                der: parseExpresion(exp.slice(i + 1))
            };
        }
    }
    return { valor: exp };
}

// ----------------- DIBUJAR RECURSIVO -----------------
let contador = 0;
function dibujar(arbolExp, depth = 0) {
    if (arbolExp.valor) {
        return arbolExp.valor;
    }

    let id = contador++;
    let izq = dibujar(arbolExp.izq, depth + 1);
    let der = dibujar(arbolExp.der, depth + 1);

    generar_arbol(izq, arbolExp.op, der, id, depth);
    conectar(id);

    return "o" + id;
}

// ----------------- EVENTO -----------------
document.getElementById("btn_generar").addEventListener("click", () => {
    arbol.innerHTML = "";
    contador = 0;
    let expresion = document.getElementById("expresion").value;

    try {
        let parsed = parseExpresion(expresion);
        dibujar(parsed);
    } catch (e) {
        alert("Expresión inválida");
    }
});
