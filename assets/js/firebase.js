// 🔥 Importar Firebase versión 12.6.0
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

// 🔥 Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDAdZY9XslEGQpanhgfke2cFS_RZyy9GXU",
  authDomain: "prueba-crud-7e48d.firebaseapp.com",
  projectId: "prueba-crud-7e48d",
  storageBucket: "prueba-crud-7e48d.firebasestorage.app",
  messagingSenderId: "1130654644",
  appId: "1:1130654644:web:b7009d5dbaed6aae2d20e1"
};

// Inicializar Firebase y Firestore
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// ---------------------------------------------------------------------------
// CRUD Productos
// ---------------------------------------------------------------------------
const coleccion = "tbl_productos";

// ➕ Crear
export const addProducto = (nombre, descripcion, precio, categoria, stock) =>
  addDoc(collection(db, coleccion), { nombre, descripcion, precio, categoria, stock });

// 📄 Leer todos
export const getProductosCollection = () => getDocs(collection(db, coleccion));

// 📄 Leer uno
export const getProductoCollection = (id) => getDoc(doc(db, coleccion, id));

// ✏️ Actualizar
export const updateProductoCollection = (id, newFields) =>
  updateDoc(doc(db, coleccion, id), newFields);

// ❌ Eliminar
export const deleteProductoCollection = (id) =>
  deleteDoc(doc(db, coleccion, id));

// ---------------------------------------------------------------------------
// Función para abrir modales (Bootstrap 5)
// ---------------------------------------------------------------------------
window.miModal = (idModal) => {
  const modal = new bootstrap.Modal(document.getElementById(idModal));
  modal.show();
};

// ---------------------------------------------------------------------------
// Funciones para agregar y actualizar productos desde los formularios
// ---------------------------------------------------------------------------
const formAdd = document.getElementById("formularioProducto");
const formEdit = document.getElementById("formularioProductoEdit");
const tablaProductos = document.getElementById("tablaProductos").querySelector("tbody");

// ➕ Agregar producto
formAdd.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    nombre: formAdd.nombre.value,
    descripcion: formAdd.descripcion.value,
    precio: Number(formAdd.precio.value),
    categoria: formAdd.categoria.value,
    stock: Number(formAdd.stock.value)
  };
  await addProducto(data.nombre, data.descripcion, data.precio, data.categoria, data.stock);
  iziToast.success({ title: 'Éxito', message: 'Producto agregado' });
  formAdd.reset();
  cargarProductos();
});

// ✏️ Actualizar producto
formEdit.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("idProducto").value;
  const data = {
    nombre: document.getElementById("nombreEdit").value,
    descripcion: document.getElementById("descripcionEdit").value,
    precio: Number(document.getElementById("precioEdit").value),
    categoria: document.getElementById("categoriaEdit").value,
    stock: Number(document.getElementById("stockEdit").value)
  };
  await updateProductoCollection(id, data);
  iziToast.success({ title: 'Éxito', message: 'Producto actualizado' });
  formEdit.reset();
  cargarProductos();
});

// ❌ Eliminar producto
window.eliminarProducto = async (id) => {
  if (confirm("¿Deseas eliminar este producto?")) {
    await deleteProductoCollection(id);
    iziToast.success({ title: 'Éxito', message: 'Producto eliminado' });
    cargarProductos();
  }
};

// 📝 Cargar todos los productos en la tabla
async function cargarProductos() {
  tablaProductos.innerHTML = ""; // limpiar tabla
  const snapshot = await getProductosCollection();
  snapshot.forEach((docSnap) => {
    const producto = docSnap.data();
    const id = docSnap.id;
    tablaProductos.innerHTML += `
      <tr>
        <td>${producto.nombre}</td>
        <td>${producto.descripcion}</td>
        <td>${producto.precio}</td>
        <td>${producto.categoria}</td>
        <td>${producto.stock}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="editarProducto('${id}')">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="eliminarProducto('${id}')">Eliminar</button>
        </td>
      </tr>
    `;
  });
}

// ✏️ Editar producto: llenar modal con datos
window.editarProducto = async (id) => {
  const docSnap = await getProductoCollection(id);
  if (docSnap.exists()) {
    const data = docSnap.data();
    document.getElementById("idProducto").value = id;
    document.getElementById("nombreEdit").value = data.nombre;
    document.getElementById("descripcionEdit").value = data.descripcion;
    document.getElementById("precioEdit").value = data.precio;
    document.getElementById("categoriaEdit").value = data.categoria;
    document.getElementById("stockEdit").value = data.stock;
    window.miModal("editarProductoModal");
  }
};

// ✅ Cargar productos al abrir la página
window.addEventListener("DOMContentLoaded", cargarProductos);
