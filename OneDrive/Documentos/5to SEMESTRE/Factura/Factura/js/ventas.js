import { Product } from './products.js';
import { ClienteManager } from './clients.js';
// Clase SaleDetail
class SaleDetail {
    static _line = 0;

    constructor(product, quantity) {
        SaleDetail._line++;
        this._id = SaleDetail._line;
        this.product = product;
        this.precio = product.precio;
        this.quantity = quantity;
    }

    get id() {
        return this._id;
    }

    toString() {
        return `${this.id} ${this.product.descrip} ${this.precio} ${this.quantity}`;
    }
}

// Clase Sale
class Sale {
    static next = 0;
    static FACTOR_IVA = 0.12;

    constructor(client) {
        Sale.next++;
        this._invoice = Sale.next;
        this.date = new Date();
        this.client = client;
        this.subtotal = 0;
        this.percentage_discount = client.discount;
        this.discount = 0;
        this.iva = 0;
        this.total = 0;
        this.sale_detail = [];
    }

    get invoice() {
        return this._invoice;
    }

    toString() {
        return `Factura# ${this.invoice} ${this.date} ${this.client.fullName()} ${this.total}`;
    }

    cal_iva(iva = 0.12, valor = 0) {
        return Math.round(valor * iva * 100) / 100;
    }

    cal_discount(valor = 0, discount = 0) {
        return valor * discount;
    }

    add_detail(prod, qty) {
        const detail = new SaleDetail(prod, qty);
        this.subtotal += Math.round(detail.precio * detail.quantity * 100) / 100;
        this.discount = this.cal_discount(this.subtotal, this.percentage_discount);
        this.iva = this.cal_iva(Sale.FACTOR_IVA, this.subtotal - this.discount);
        this.total = Math.round((this.subtotal + this.iva - this.discount) * 100) / 100;
        this.sale_detail.push(detail);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const inputCedula = document.querySelector('input[name="cedula"]');
    const spanCliente = document.querySelector('span');

    inputCedula.addEventListener('change', function () {
        const dni = inputCedula.value;

        // Obtener clientes del localStorage
        const clientes = JSON.parse(localStorage.getItem('clientes')) || [];

        // Buscar el cliente correspondiente por el DNI
        const clienteEncontrado = clientes.find(cliente => cliente.dni === dni);

        if (clienteEncontrado) {
            // Mostrar el nombre y el apellido del cliente
            spanCliente.textContent = `Hola ${clienteEncontrado.nombre} ${clienteEncontrado.apellido}.`;
        } else {
            // Si no se encuentra el cliente, mostrar un mensaje vacío
            spanCliente.textContent = '';
        }
    });
});


