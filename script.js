const USUARIO = "administrador";
const PASSWORD = "usuario123";

// Funciones para el Modal de Credenciales (Básico)
function abrirModal() {
  const modal = document.getElementById("credential-modal");
  if (modal) modal.classList.add("active");
}

function cerrarModal() {
  const modal = document.getElementById("credential-modal");
  if (modal) modal.classList.remove("active");
}

function autocompletarYEntrar() {
  const uInput = document.getElementById("input-usuario");
  const pInput = document.getElementById("input-password");
  if (uInput && pInput) {
    uInput.value = USUARIO;
    pInput.value = PASSWORD;
  }
  cerrarModal();
  setTimeout(iniciarSesion, 200);
}

// Mostrar modal al cargar la página
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(abrirModal, 500);
});

function iniciarSesion() {
  const usuario = document.getElementById("input-usuario").value.trim();
  const password = document.getElementById("input-password").value;
  const error = document.getElementById("login-error");

  if (usuario === USUARIO && password === PASSWORD) {
    error.textContent = "";
    document.getElementById("pagina-login").style.display = "none";
    document.getElementById("pagina-ventas").style.display = "block";
    iniciarSistema();
  } else {
    error.textContent = "Usuario o contraseña incorrectos.";
    document.getElementById("input-password").value = "";
  }
}

function cerrarSesion() {
  document.getElementById("pagina-ventas").style.display = "none";
  document.getElementById("pagina-login").style.display = "flex";
  document.getElementById("input-usuario").value = "";
  document.getElementById("input-password").value = "";
  document.getElementById("login-error").textContent = "";
}

const productos = [
  { id: 1, nombre: "Cuaderno A4 espiral", cat: "Papelería", precio: 8.50, stock: 30 },
  { id: 2, nombre: "Lapicero azul Pilot", cat: "Papelería", precio: 3.00, stock: 50 },
  { id: 3, nombre: "El Principito", cat: "Libros", precio: 28.00, stock: 10 },
  { id: 4, nombre: "Tijera escolar", cat: "Útiles", precio: 5.50, stock: 0 },
  { id: 5, nombre: "Resaltador x3 colores", cat: "Papelería", precio: 7.00, stock: 20 },
  { id: 6, nombre: "Regla 30cm", cat: "Útiles", precio: 3.00, stock: 15 },
  { id: 7, nombre: "1984 - George Orwell", cat: "Libros", precio: 35.00, stock: 5 },
  { id: 8, nombre: "Lápices 2B x12", cat: "Papelería", precio: 6.00, stock: 25 },
];

let carrito = [];
let numVenta = 1;
let textoBusqueda = "";

function iniciarSistema() {
  document.getElementById("fecha-hoy").textContent = new Date().toLocaleDateString("es-PE", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });
  renderTabla();
}

function renderTabla() {
  const lista = productos.filter(p =>
    p.nombre.toLowerCase().includes(textoBusqueda.toLowerCase())
  );
  const tbody = document.getElementById("tabla-productos");
  tbody.innerHTML = "";
  lista.forEach(p => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
    <td>${p.nombre}</td>
    <td>${p.cat}</td>
    <td>S/. ${p.precio.toFixed(2)}</td>
    <td>${p.stock > 0 ? p.stock + " ud." : '<span class="sin-stock">Sin stock</span>'}</td>
    <td>
      <button class="btn-agregar" onclick="agregar(${p.id})" ${p.stock === 0 ? "disabled" : ""}>
        + Agregar
      </button>
    </td>
  `;
    tbody.appendChild(tr);
  });
}

function buscar(v) { textoBusqueda = v; renderTabla(); }

function agregar(id) {
  const prod = productos.find(p => p.id === id);
  const enCarrito = carrito.find(c => c.id === id);
  if (enCarrito) {
    if (enCarrito.qty >= prod.stock) { alert("Stock máximo alcanzado"); return; }
    enCarrito.qty++;
  } else {
    carrito.push({ ...prod, qty: 1 });
  }
  renderCarrito();
}

function cambiarQty(id, delta) {
  const item = carrito.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) carrito = carrito.filter(c => c.id !== id);
  renderCarrito();
}

function eliminar(id) {
  carrito = carrito.filter(c => c.id !== id);
  renderCarrito();
}

function renderCarrito() {
  const lista = document.getElementById("lista-venta");
  const totalesDiv = document.getElementById("totales");
  const btnReg = document.getElementById("btn-registrar");

  if (carrito.length === 0) {
    lista.innerHTML = '<div class="vacio">Ningún producto agregado aún</div>';
    totalesDiv.style.display = "none";
    btnReg.disabled = true;
    return;
  }

  lista.innerHTML = carrito.map(item => `
  <div class="item-venta">
    <span class="item-nombre">${item.nombre}</span>
    <div class="item-qty">
      <button onclick="cambiarQty(${item.id}, -1)">−</button>
      <span>${item.qty}</span>
      <button onclick="cambiarQty(${item.id}, 1)">+</button>
    </div>
    <span class="item-precio">S/. ${(item.precio * item.qty).toFixed(2)}</span>
    <button class="item-del" onclick="eliminar(${item.id})">✕</button>
  </div>
`).join("");

  const subtotal = carrito.reduce((a, b) => a + b.precio * b.qty, 0);
  const igv = subtotal * 0.18;
  const total = subtotal + igv;

  document.getElementById("subtotal").textContent = "S/. " + subtotal.toFixed(2);
  document.getElementById("igv").textContent = "S/. " + igv.toFixed(2);
  document.getElementById("total").textContent = "S/. " + total.toFixed(2);

  totalesDiv.style.display = "";
  btnReg.disabled = false;
}

function registrar() {
  const cliente = document.getElementById("cliente").value.trim() || "Sin nombre";
  const subtotal = carrito.reduce((a, b) => a + b.precio * b.qty, 0);
  const total = subtotal * 1.18;
  const hora = new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
  const items = carrito.reduce((a, b) => a + b.qty, 0);

  // Descontar stock
  carrito.forEach(c => {
    const p = productos.find(x => x.id === c.id);
    if (p) p.stock -= c.qty;
  });

  const tbody = document.getElementById("tabla-historial");
  if (numVenta === 1) tbody.innerHTML = "";

  const tr = document.createElement("tr");
  tr.innerHTML = `
  <td>#${String(numVenta).padStart(3, "0")}</td>
  <td>${hora}</td>
  <td>${cliente}</td>
  <td>${items} item(s)</td>
  <td><strong>S/. ${total.toFixed(2)}</strong></td>
`;
  tbody.insertBefore(tr, tbody.firstChild);

  numVenta++;
  limpiar();
  renderTabla();
  alert("✅ Venta registrada correctamente");
}

function limpiar() {
  carrito = [];
  document.getElementById("cliente").value = "";
  renderCarrito();
}
