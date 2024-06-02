class Product {
    constructor(descripcion = "Ninguno", precio = 0, cantidad = 0) {
        this.id = Product.getNextId();
        this.descripcion = descripcion;
        this.precio = parseFloat(precio);
        this.cantidad = parseInt(cantidad);
    }
    static getNextId() {
        let nextId = parseInt(localStorage.getItem('nextProductId')) || 1;
        localStorage.setItem('nextProductId', nextId + 1);
        return nextId;
    }
}

function handleFormSubmit(event) {
    event.preventDefault();

    const descripcion = document.querySelector('#form-ingresar-producto input[name="descripcion"]').value.trim();
    const precio = document.querySelector('#form-ingresar-producto input[name="precio"]').value.trim();
    const cantidad = document.querySelector('#form-ingresar-producto input[name="cantidad"]').value.trim();

    if (!/^[a-zA-Z\s]+$/.test(descripcion)) {
        alert('Por favor ingrese correctamente la descripción (solo texto).');
        return;
    }

    if (isNaN(parseFloat(precio))) {
        alert('Por favor solo ingrese números válidos en el campo Precio.');
        return;
    }

    if (isNaN(parseInt(cantidad))) {
        alert('Por favor solo ingrese números válidos en el campo Cantidad.');
        return;
    }

    const nuevoProducto = new Product(descripcion, parseFloat(precio), parseInt(cantidad));
    guardarProductoEnLocalStorage(nuevoProducto);

    document.querySelector('#form-ingresar-producto').reset();

    actualizarListaDeProductos();
}


function guardarProductoEnLocalStorage(producto) {
    let productos = JSON.parse(localStorage.getItem('productos')) || [];
    productos.push(producto);
    localStorage.setItem('productos', JSON.stringify(productos));
}

function actualizarListaDeProductos() {
    const productosContainer = document.querySelector('.div-producto');
    productosContainer.innerHTML = '';

    const productos = JSON.parse(localStorage.getItem('productos')) || [];

    productos.forEach(producto => {
        const productoElement = document.createElement('div');
        productoElement.classList.add('producto-item');
        productoElement.innerHTML = `
            <span>ID: ${producto.id} - ${producto.descripcion} - Precio: $${producto.precio} - Stock: ${producto.cantidad}</span>
            <div class="botones-container">
                <button style= "text-decoration: none "class="Editar">Editar</button>
                <button style= "text-decoration: none "class="Eliminar">Eliminar</button>
            </div>
        `;
        productosContainer.appendChild(productoElement);
    });
    agregarEventosEliminar();
}

function mostrarConfirmacionEliminar(producto) {
    const confirmacionContainer = document.getElementById('confirmacion')
    confirmacionContainer.style.display = 'block';

    const confirmYesBtn = document.getElementById('confirmYes')
    const confirmNoBtn = document.getElementById('confirmNo')

    confirmYesBtn.addEventListener('click', () => {
        eliminarProducto(producto);
        confirmacionContainer.style.display = 'none'
    });

    confirmNoBtn.addEventListener('click', () => {
        confirmacionContainer.style.display = 'none'
    });
}

function eliminarProducto(producto) {
    let productos = JSON.parse(localStorage.getItem('productos')) || []
    productos = productos.filter(p => p.id !== producto.id)
    localStorage.setItem('productos', JSON.stringify(productos))
    actualizarListaDeProductos()
}

function agregarEventosEliminar() {
    const botonesEliminar = document.querySelectorAll('.Eliminar');

    botonesEliminar.forEach(boton => {
        boton.addEventListener('click', () => {
            const productos = JSON.parse(localStorage.getItem('productos')) || [];
            const productoId = parseInt(boton.parentElement.previousElementSibling.textContent.split(' ')[1]); // Obtener el ID del producto
            const producto = productos.find(p => p.id === productoId);

            if (producto) {
                mostrarConfirmacionEliminar(producto);
            }
        });
    });
}

agregarEventosEliminar();

actualizarListaDeProductos();

const formIngresarProducto = document.getElementById('form-ingresar-producto');
formIngresarProducto.addEventListener('submit', handleFormSubmit);

actualizarListaDeProductos();

function mostrarModalEditar(producto, index) {
    const modal = document.getElementById('modal');
    const modalContent = modal.querySelector('.modal-content');
    const editForm = modalContent.querySelector('#form-editar-producto');

    editForm.querySelector('input[name="descripcion"]').value = producto.descripcion;
    editForm.querySelector('input[name="precio"]').value = producto.precio;
    editForm.querySelector('input[name="cantidad"]').value = producto.cantidad;

    modal.style.display = 'block';

    editForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Obtener los valores actualizados del formulario
        const nuevaDescripcion = editForm.querySelector('input[name="descripcion"]').value;
        const nuevoPrecio = editForm.querySelector('input[name="precio"]').value;
        const nuevaCantidad = editForm.querySelector('input[name="cantidad"]').value;

        // Realizar validaciones antes de actualizar el producto
        if (!/^[a-zA-Z\s]+$/.test(nuevaDescripcion)) {
            alert('Por favor ingrese una descripción válida (solo texto).');
            return;
        }

        if (!/^[0-9]+(\.[0-9]+)?$/.test(nuevoPrecio)) {
            alert('Por favor ingrese un precio válido (números).');
            return;
        }

        if (!/^[0-9]+$/.test(nuevaCantidad)) {
            alert('Por favor ingrese una cantidad válida (números enteros).');
            return;
        }

        // Si las validaciones pasan, actualizamos el producto
        producto.descripcion = nuevaDescripcion;
        producto.precio = parseFloat(nuevoPrecio);
        producto.cantidad = parseInt(nuevaCantidad);

        let productos = JSON.parse(localStorage.getItem('productos')) || [];
        productos[index] = producto;
        localStorage.setItem('productos', JSON.stringify(productos));

        actualizarListaDeProductos();
        modal.style.display = 'none';
    });
}

function agregarEventosEditar() {
    const botonesEditar = document.querySelectorAll('.Editar');

    botonesEditar.forEach((boton, index) => {
        boton.addEventListener('click', () => {
            const productos = JSON.parse(localStorage.getItem('productos')) || [];
            const producto = productos[index];

            if (producto) {
                mostrarModalEditar(producto, index);
            }
        });
    });
}

// Obtener el modal y el botón de cierre
const modal = document.getElementById('modal');
const closeButton = modal.querySelector('.close');
closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
});


// Llamar a la función para agregar event listeners a los botones "Editar"
agregarEventosEditar();