const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Importar datos desde data.js
const data = require('./data.js');
let { supermarkets, categories, offers, changuitos } = data;

// Almacén de pedidos (temporal en memoria)
let orders = [
    { id: 1001, supermarketId: 1, productId: 1, productName: "Filete de Res Premium", address: "Calle Falsa 123", phone: "12345678", paymentMethod: "efectivo", status: "pendiente", timestamp: new Date().toISOString() },
    { id: 1002, supermarketId: 1, productId: 13, productName: "Agua Mineral 500ml x 6", address: "Av. Siempre Viva 742", phone: "87654321", paymentMethod: "tarjeta", status: "entregado", timestamp: new Date().toISOString() }
];

// Rutas API
app.get('/api/supermarkets', (req, res) => {
    res.json(supermarkets);
});

app.get('/api/categories', (req, res) => {
    res.json(categories);
});

app.get('/api/offers', (req, res) => {
    const { supermarketId, categoryId, sort, search } = req.query;
    let result = [...offers];

    if (supermarketId) {
        result = result.filter(o => o.supermarketId === parseInt(supermarketId));
    }

    if (categoryId) {
        result = result.filter(o => o.categoryId === parseInt(categoryId));
    }

    if (search) {
        const query = search.toLowerCase();
        result = result.filter(o => 
            o.product.toLowerCase().includes(query) ||
            supermarkets.find(s => s.id === o.supermarketId).name.toLowerCase().includes(query)
        );
    }

    if (sort) {
        switch (sort) {
            case 'discount':
                result.sort((a, b) => ((b.oldPrice - b.newPrice) / b.oldPrice) - ((a.oldPrice - a.newPrice) / a.oldPrice));
                break;
            case 'price-low':
                result.sort((a, b) => a.newPrice - b.newPrice);
                break;
            case 'price-high':
                result.sort((a, b) => b.newPrice - a.newPrice);
                break;
            case 'name':
                result.sort((a, b) => a.product.localeCompare(b.product));
                break;
        }
    }

    res.json(result);
});

app.get('/api/changuitos', (req, res) => {
    res.json(changuitos);
});

app.get('/api/stats', (req, res) => {
    const totalOffers = offers.length;
    const totalSupermarkets = supermarkets.length;
    const totalDiscount = offers.reduce((acc, o) => acc + Math.round(((o.oldPrice - o.newPrice) / o.oldPrice) * 100), 0);
    const avgDiscount = Math.round(totalDiscount / totalOffers);

    res.json({ totalSupermarkets, totalOffers, avgDiscount });
});

app.post('/api/orders', (req, res) => {
    const { productId, changuitoId, address, phone, paymentMethod } = req.body;
    
    let orderItemName = "Desconocido";
    let supermarketId = 1;

    if (changuitoId) {
        const chan = changuitos.find(c => c.id === parseInt(changuitoId));
        orderItemName = chan ? chan.name : 'Changuito';
        supermarketId = chan ? chan.supermarketId : 1;
    } else if (productId) {
        const product = offers.find(o => o.id === parseInt(productId));
        orderItemName = product ? product.product : 'Producto';
        supermarketId = product ? product.supermarketId : 1;
    }

    const newOrder = {
        id: Math.floor(Math.random() * 1000000),
        supermarketId,
        productId,
        changuitoId,
        productName: orderItemName,
        address,
        phone,
        paymentMethod,
        status: "pendiente",
        timestamp: new Date().toISOString()
    };

    orders.unshift(newOrder); // Agregar al principio

    console.log(`📦 Nuevo pedido de ${changuitoId ? 'CHANGUITO' : 'PRODUCTO'} recibido:
        ID: ${newOrder.id}
        Supermercado ID: ${supermarketId}
        Articulo: ${orderItemName}
        Dirección: ${address}
        Teléfono: ${phone}
        Método de Pago: ${paymentMethod}`);
    
    res.json({ success: true, message: "Pedido enviado con éxito", orderId: newOrder.id });
});

// Admin API
app.get('/api/admin/orders', (req, res) => {
    const { supermarketId } = req.query;
    if (!supermarketId) return res.status(400).json({ error: "Supermarket ID is required" });
    
    const result = orders.filter(o => o.supermarketId === parseInt(supermarketId));
    res.json(result);
});

app.get('/api/admin/offers', (req, res) => {
    const { supermarketId } = req.query;
    if (!supermarketId) return res.status(400).json({ error: "Supermarket ID is required" });
    
    const result = offers.filter(o => o.supermarketId === parseInt(supermarketId));
    res.json(result);
});

app.post('/api/admin/offers', (req, res) => {
    const { product, supermarketId, categoryId, oldPrice, newPrice, description, expiryDate, image } = req.body;
    
    const newOffer = {
        id: offers.length > 0 ? Math.max(...offers.map(o => o.id)) + 1 : 1,
        product,
        supermarketId: parseInt(supermarketId),
        categoryId: parseInt(categoryId),
        oldPrice: parseFloat(oldPrice),
        newPrice: parseFloat(newPrice),
        description,
        expiryDate,
        image: image || "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop"
    };

    offers.push(newOffer);
    res.json({ success: true, offer: newOffer });
});

app.delete('/api/admin/offers/:id', (req, res) => {
    const id = parseInt(req.params.id);
    offers = offers.filter(o => o.id !== id);
    res.json({ success: true });
});

app.patch('/api/admin/orders/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    const order = orders.find(o => o.id === id);
    if (order) {
        order.status = status;
        res.json({ success: true });
    } else {
        res.status(404).json({ error: "Order not found" });
    }
});

// Servir archivos estáticos (el frontend)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`\n🛒 OfertasCiudad corriendo en: http://localhost:${PORT}\n`);
});
