const productListContainer = document.getElementById('products-list');
const addProductForm = document.getElementById('add-product-form');

let products = [];

// Cargar datos iniciales desde un archivo JSON
fetch('products.json')
    .then(response => response.json())
    .then(data => {
        products = data;
        renderProducts();
    })
    .catch(error => console.error('Error al cargar los productos:', error));

// Función para renderizar los productos en el contenedor
function renderProducts() {
    productListContainer.innerHTML = ''; // Limpiar contenedor
    products.forEach((product, index) => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        
        productCard.innerHTML = `
            <img src="${product.imagen}" alt="${product.nombre}">
            <h3>${product.nombre}</h3>
            <p>Precio: $${product.precio}</p>
            <button onclick="removeProduct(${index})" aria-label="Eliminar ${product.nombre}">Eliminar</button>
        `;
        
        productListContainer.appendChild(productCard);
    });
}

// Función para agregar un producto
addProductForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('product-name').value.trim();
    const price = parseFloat(document.getElementById('product-price').value);
    const image = document.getElementById('product-image').value.trim();

    if (!name || !price || !image) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    // Validar la URL de la imagen
    if (!isValidURL(image)) {
        alert('Por favor, ingresa una URL de imagen válida.');
        return;
    }

    const newProduct = {
        id: generateId(),  // Usar función para generar un id único
        nombre: name,
        precio: price,
        imagen: image
    };

    products.push(newProduct);
    renderProducts();
    addProductForm.reset();

    // Guardar en localStorage (si lo quieres)
    saveProductsToLocalStorage();
});

// Función para eliminar un producto
function removeProduct(index) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
        products.splice(index, 1);
        renderProducts();
        saveProductsToLocalStorage(); // Guardar cambios en localStorage
    }
}

// Función para generar un ID único
function generateId() {
    return products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
}

// Función para validar URL
function isValidURL(url) {
    try {
        new URL(url);
        return true;
    } catch (_) {
        return false;
    }
}

// Función para guardar los productos en el localStorage
function saveProductsToLocalStorage() {
    localStorage.setItem('products', JSON.stringify(products));
}

// Cargar productos desde el localStorage al inicio
document.addEventListener('DOMContentLoaded', () => {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
        products = JSON.parse(storedProducts);
        renderProducts();
    }
});
