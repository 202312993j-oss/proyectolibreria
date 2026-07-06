// ============================================================
// Compra tu Coquito - script.js
// Toda la lógica de negocio (productos, ventas, login) vive en el
// backend PHP. Este archivo solo consume esos endpoints por AJAX.
// ============================================================

const API_LOGIN    = "../backend/controllers/LoginController.php";
const API_PRODUCTO = "../backend/controllers/ProductoController.php";
const API_VENTA    = "../backend/controllers/VentaController.php";

// Credenciales de demo (solo texto informativo del modal, la
// validación real la hace el backend contra la base de datos)
const USUARIO_DEMO = "administrador";
const PASSWORD_DEMO = "usuario123";

// -------------------- Modal de credenciales --------------------
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
    uInput.value = USUARIO_DEMO;
    pInput.value = PASSWORD_DEMO;
  }
  cerrarModal();
  setTimeout(iniciarSesion, 200);
}

// -------------------- Inicio --------------------
window.addEventListener("DOMContentLoaded", () => {
  inicializarElementosPortada();
  verificarSesionActiva();
});

async function verificarSesionActiva() {
  try {
    const res = await fetch(`${API_LOGIN}?accion=estado`);
    const data = await res.json();
    if (data.ok) {
      mostrarPanelVentas();
    } else {
      setTimeout(abrirModal, 500);
    }
  } catch (e) {
    setTimeout(abrirModal, 500);
  }
}

function inicializarElementosPortada() {
  const portada = document.querySelector(".portada");
  const loginBox = document.querySelector(".login-box");
  if (!portada || !loginBox) return;

  const waBtn = document.createElement("a");
  waBtn.className = "btn-whatsapp";
  waBtn.href = "https://wa.me/51999999999?text=Hola,%20quisiera%20saber%20más%20información%20sobre%20los%20libros%20y%20artículos%20de%20oficina.";
  waBtn.target = "_blank";
  waBtn.title = "Contáctanos por WhatsApp";

  waBtn.innerHTML = `
    <svg viewBox="0 0 24 24">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.182 1.449 4.825 1.451 5.436.002 9.858-4.415 9.86-9.858.002-2.638-1.016-5.118-2.868-6.972C16.513 1.92 14.041.902 11.39.902c-5.447 0-9.873 4.42-9.875 9.863-.001 1.724.455 3.411 1.32 4.908l-.995 3.633 3.717-.975zm11.367-5.265c-.29-.145-1.713-.846-1.977-.942-.264-.096-.456-.145-.647.145-.19.29-.74.942-.907 1.134-.166.19-.333.214-.623.069-.29-.145-1.226-.452-2.335-1.441-.864-.771-1.448-1.723-1.618-2.014-.17-.29-.018-.447.127-.592.13-.13.29-.338.435-.507.145-.17.193-.29.29-.483.097-.19.048-.362-.024-.507-.072-.145-.647-1.56-.887-2.14-.233-.56-.47-.482-.647-.491-.167-.008-.36-.01-.553-.01-.193 0-.507.072-.773.362-.266.29-1.013.99-1.013 2.414 0 1.424 1.037 2.8 1.182 2.993.145.19 2.04 3.115 4.939 4.363.69.297 1.229.475 1.65.609.694.22 1.324.19 1.825.115.56-.085 1.714-.7 1.953-1.374.24-.674.24-1.253.167-1.374-.072-.121-.264-.19-.554-.335z"/>
    </svg>
  `;

  portada.appendChild(waBtn);

  const grid = document.createElement("div");
  grid.className = "portada-grid";
  loginBox.parentNode.insertBefore(grid, loginBox);

  const card = document.createElement("div");
  card.className = "interactive-card";
  card.innerHTML = `
    <span class="interactive-badge">📖 Bienvenidos</span>
    <img src="img/imagenlibro.png" alt="Librería Compra tu Coquito" />
  `;

  grid.appendChild(card);
  grid.appendChild(loginBox);

  const imgElement = card.querySelector("img");

  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
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

// -------------------- Login / Logout (backend real) --------------------
async function iniciarSesion() {
  const usuario = document.getElementById("input-usuario").value.trim();
  const password = document.getElementById("input-password").value;
  const error = document.getElementById("login-error");

  if (!usuario || !password) {
    error.textContent = "Usuario y contraseña son obligatorios.";
    return;
  }

  const formData = new FormData();
  formData.append("usuario", usuario);
  formData.append("password", password);

  try {
    const res = await fetch(`${API_LOGIN}?accion=login`, { method: "POST", body: formData });
    const data = await res.json();

    if (data.ok) {
      error.textContent = "";
      mostrarPanelVentas();
    } else {
      error.textContent = data.mensaje || "Usuario o contraseña incorrectos.";
      document.getElementById("input-password").value = "";
    }
  } catch (e) {
    error.textContent = "No se pudo conectar con el servidor.";
  }
}

async function cerrarSesion() {
  try {
    await fetch(`${API_LOGIN}?accion=logout`, { method: "POST" });
  } finally {
    document.getElementById("pagina-ventas").style.display = "none";
    document.getElementById("pagina-login").style.display = "flex";
    document.getElementById("input-usuario").value = "";
    document.getElementById("input-password").value = "";
    document.getElementById("login-error").textContent = "";
  }
}

function mostrarPanelVentas() {
  document.getElementById("pagina-login").style.display = "none";
  document.getElementById("pagina-ventas").style.display = "block";
  iniciarSistema();
}

// -------------------- Productos --------------------
let carrito = [];
let textoBusqueda = "";
let productosCache = [];

function iniciarSistema() {
  document.getElementById("fecha-hoy").textContent = new Date().toLocaleDateString("es-PE", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });
  cargarProductos();
  cargarHistorial();
}

async function cargarProductos() {
  try {
    const res = await fetch(`${API_PRODUCTO}?accion=listar&busqueda=${encodeURIComponent(textoBusqueda)}`);
    const data = await res.json();
    if (data.ok) {
      productosCache = data.productos;
      renderTabla();
    }
  } catch (e) {
    console.error("Error al cargar productos:", e);
  }
}

function buscar(v) {
  textoBusqueda = v;
  cargarProductos();
}

function renderTabla() {
  const tbody = document.getElementById("tabla-productos");
  tbody.innerHTML = "";
  productosCache.forEach(p => {
    const stock = parseInt(p.stock, 10);
    const precio = parseFloat(p.precio);
    const tr = document.createElement("tr");
    tr.innerHTML = `
    <td>${escaparHtml(p.nombre_producto)}</td>
    <td>${escaparHtml(p.nombre_categoria)}</td>
    <td>S/. ${precio.toFixed(2)}</td>
    <td>${stock > 0 ? stock + " ud." : '<span class="sin-stock">Sin stock</span>'}</td>
    <td>
      <button class="btn-agregar" onclick="agregar(${p.id_producto})" ${stock === 0 ? "disabled" : ""}>
        + Agregar
      </button>
    </td>
  `;
    tbody.appendChild(tr);
  });
}

function escaparHtml(texto) {
  const div = document.createElement("div");
  div.textContent = texto ?? "";
  return div.innerHTML;
}

function agregar(id) {
  const prod = productosCache.find(p => parseInt(p.id_producto, 10) === id);
  if (!prod) return;
  const stock = parseInt(prod.stock, 10);
  const enCarrito = carrito.find(c => c.id_producto === id);

  if (enCarrito) {
    if (enCarrito.qty >= stock) { alert("Stock máximo alcanzado"); return; }
    enCarrito.qty++;
  } else {
    carrito.push({
      id_producto: id,
      nombre: prod.nombre_producto,
      precio: parseFloat(prod.precio),
      qty: 1
    });
  }
  renderCarrito();
}

function cambiarQty(id, delta) {
  const item = carrito.find(c => c.id_producto === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) carrito = carrito.filter(c => c.id_producto !== id);
  renderCarrito();
}

function eliminar(id) {
  carrito = carrito.filter(c => c.id_producto !== id);
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
    <span class="item-nombre">${escaparHtml(item.nombre)}</span>
    <div class="item-qty">
      <button onclick="cambiarQty(${item.id_producto}, -1)">−</button>
      <span>${item.qty}</span>
      <button onclick="cambiarQty(${item.id_producto}, 1)">+</button>
    </div>
    <span class="item-precio">S/. ${(item.precio * item.qty).toFixed(2)}</span>
    <button class="item-del" onclick="eliminar(${item.id_producto})">✕</button>
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

// -------------------- Registrar venta (backend real) --------------------
async function registrar() {
  if (carrito.length === 0) return;

  const cliente = document.getElementById("cliente").value.trim() || "Sin nombre";
  const items = carrito.map(c => ({
    id_producto: c.id_producto,
    cantidad: c.qty,
    precio: c.precio
  }));

  try {
    const res = await fetch(`${API_VENTA}?accion=registrar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cliente, items })
    });
    const data = await res.json();

    if (data.ok) {
      limpiar();
      await cargarProductos();
      await cargarHistorial();
      alert("✅ Venta registrada correctamente");
    } else {
      alert("⚠ " + (data.mensaje || "No se pudo registrar la venta."));
    }
  } catch (e) {
    alert("No se pudo conectar con el servidor.");
  }
}

async function cargarHistorial() {
  try {
    const res = await fetch(`${API_VENTA}?accion=listar`);
    const data = await res.json();
    const tbody = document.getElementById("tabla-historial");

    if (!data.ok || data.ventas.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" class="aviso">Aún no hay ventas registradas</td></tr>';
      return;
    }

    tbody.innerHTML = data.ventas.map(v => {
      const fecha = new Date(v.fecha_venta.replace(" ", "T"));
      const hora = fecha.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
      return `
      <tr>
        <td>#${String(v.id_venta).padStart(3, "0")}</td>
        <td>${hora}</td>
        <td>${escaparHtml(v.nombre_cliente || "Sin nombre")}</td>
        <td>${v.items} item(s)</td>
        <td><strong>S/. ${parseFloat(v.total).toFixed(2)}</strong></td>
      </tr>`;
    }).join("");
  } catch (e) {
    console.error("Error al cargar historial:", e);
  }
}

function limpiar() {
  carrito = [];
  document.getElementById("cliente").value = "";
  renderCarrito();
}
