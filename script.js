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

// Mostrar modal y elementos interactivos de la portada al cargar la página
window.addEventListener('DOMContentLoaded', () => {
  inicializarElementosPortada();
  setTimeout(abrirModal, 500);
});

function inicializarElementosPortada() {
  const portada = document.querySelector(".portada");
  const loginBox = document.querySelector(".login-box");
  if (!portada || !loginBox) return;

  // 1. Crear el botón de WhatsApp flotante
  const waBtn = document.createElement("a");
  waBtn.className = "btn-whatsapp";
  waBtn.href = "https://wa.me/51999999999?text=Hola,%20quisiera%20saber%20más%20información%20sobre%20los%20libros%20y%20artículos%20de%20oficina.";
  waBtn.target = "_blank";
  waBtn.title = "Contáctanos por WhatsApp";
  
  // Icono SVG oficial de WhatsApp limpio y escalable
  waBtn.innerHTML = `
    <svg viewBox="0 0 24 24">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.182 1.449 4.825 1.451 5.436.002 9.858-4.415 9.86-9.858.002-2.638-1.016-5.118-2.868-6.972C16.513 1.92 14.041.902 11.39.902c-5.447 0-9.873 4.42-9.875 9.863-.001 1.724.455 3.411 1.32 4.908l-.995 3.633 3.717-.975zm11.367-5.265c-.29-.145-1.713-.846-1.977-.942-.264-.096-.456-.145-.647.145-.19.29-.74.942-.907 1.134-.166.19-.333.214-.623.069-.29-.145-1.226-.452-2.335-1.441-.864-.771-1.448-1.723-1.618-2.014-.17-.29-.018-.447.127-.592.13-.13.29-.338.435-.507.145-.17.193-.29.29-.483.097-.19.048-.362-.024-.507-.072-.145-.647-1.56-.887-2.14-.233-.56-.47-.482-.647-.491-.167-.008-.36-.01-.553-.01-.193 0-.507.072-.773.362-.266.29-1.013.99-1.013 2.414 0 1.424 1.037 2.8 1.182 2.993.145.19 2.04 3.115 4.939 4.363.69.297 1.229.475 1.65.609.694.22 1.324.19 1.825.115.56-.085 1.714-.7 1.953-1.374.24-.674.24-1.253.167-1.374-.072-.121-.264-.19-.554-.335z"/>
    </svg>
  `;
  
  portada.appendChild(waBtn);

  // 2. Crear la cuadrícula responsiva (Grid de Portada)
  const grid = document.createElement("div");
  grid.className = "portada-grid";

  // Insertar la cuadrícula justo antes del login-box en el DOM
  loginBox.parentNode.insertBefore(grid, loginBox);

  // 3. Crear la tarjeta de la Imagen Interactiva
  const card = document.createElement("div");
  card.className = "interactive-card";

  card.innerHTML = `
    <span class="interactive-badge">📖 Bienvenidos</span>
    <img src="libreria_cover.png" alt="Librería Compra tu Coquito" />
  `;

  // Mover la tarjeta de imagen interactiva y el login-box dentro del Grid
  grid.appendChild(card);
  grid.appendChild(loginBox);

  // 4. Efecto de inclinación 3D (Tilt effect) con Javascript sencillo
  const imgElement = card.querySelector("img");

  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // Posición X
    const y = e.clientY - rect.top;  // Posición Y
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Inclinación máxima de 12 grados
    const rotateX = ((centerY - y) / centerY) * 12;
    const rotateY = ((x - centerX) / centerX) * 12;
    
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    imgElement.style.transform = `scale(1.04)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "rotateX(0deg) rotateY(0deg)";
    imgElement.style.transform = "scale(1)";
  });
}


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
