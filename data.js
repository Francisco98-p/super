// Datos de Supermercados
const supermarkets = [
    {
        id: 1,
        name: "Carrefour",
        color: "#0044cc",
        icon: "C",
        address: "Av. Principal 123",
        coords: { lat: -34.6037, lng: -58.3816 },
        offers: 45
    },
    {
        id: 2,
        name: "Coto",
        color: "#e74c3c",
        icon: "C",
        address: "Av. Central 456",
        coords: { lat: -34.6100, lng: -58.4000 },
        offers: 38
    },
    {
        id: 3,
        name: "Jumbo",
        color: "#27ae60",
        icon: "J",
        address: "Shopping Local",
        coords: { lat: -34.5400, lng: -58.4500 },
        offers: 52
    },
    {
        id: 4,
        name: "Walmart",
        color: "#f39c12",
        icon: "W",
        address: "Av. Norte 789",
        coords: { lat: -34.5800, lng: -58.4200 },
        offers: 41
    },
    {
        id: 5,
        name: "Disco",
        color: "#9b59b6",
        icon: "D",
        address: "Av. Sur 321",
        coords: { lat: -34.6200, lng: -58.3900 },
        offers: 35
    },
    {
        id: 6,
        name: "ChangoMas",
        color: "#1abc9c",
        icon: "CM",
        address: "Av. Oeste 654",
        coords: { lat: -34.6300, lng: -58.4100 },
        offers: 48
    }
];

// Categorías
const categories = [
    { id: 1, name: "Carnes", icon: "fa-drumstick-bite" },
    { id: 2, name: "Lácteos", icon: "fa-cheese" },
    { id: 3, name: "Bebidas", icon: "fa-wine-bottle" },
    { id: 4, name: "Frutas y Verduras", icon: "fa-carrot" },
    { id: 5, name: "Panadería", icon: "fa-bread-slice" },
    { id: 6, name: "Limpieza", icon: "fa-spray-can-sparkles" },
    { id: 7, name: "Congelados", icon: "fa-snowflake" },
    { id: 8, name: "Snacks", icon: "fa-cookie" },
    { id: 9, name: "Cuidado Personal", icon: "fa-pump-soap" },
    { id: 10, name: "Almacén", icon: "fa-jar" }
];

// Ofertas
const offers = [
    { id: 1, product: "Filete de Res Premium", supermarketId: 1, categoryId: 1, oldPrice: 1899, newPrice: 1299, description: "Filete de res de primera calidad, corte americano.", expiryDate: "20/03/2026", image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=800&auto=format&fit=crop" },
    { id: 2, product: "Leche Entera x 6 unidades", supermarketId: 2, categoryId: 2, oldPrice: 960, newPrice: 699, description: "Leche entera pasteurizada. Pack de 6 litros.", expiryDate: "25/03/2026", image: "https://images.unsplash.com/photo-1563636619-e910f6f219ee?q=80&w=800&auto=format&fit=crop" },
    { id: 3, product: "Coca-Cola 2.25L x 3", supermarketId: 3, categoryId: 3, oldPrice: 1350, newPrice: 999, description: "Pack de 3 botellas de Coca-Cola de 2.25 litros.", expiryDate: "30/06/2026", image: "https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?q=80&w=800&auto=format&fit=crop" },
    { id: 4, product: "Banana Ecuador x kg", supermarketId: 4, categoryId: 4, oldPrice: 590, newPrice: 349, description: "Bananas de Ecuador, frescas y ripeadas.", expiryDate: "18/03/2026", image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?q=80&w=800&auto=format&fit=crop" },
    { id: 5, product: "Pan Lactal Integral", supermarketId: 5, categoryId: 5, oldPrice: 420, newPrice: 299, description: "Pan lactal integral, ideal para sandwiches.", expiryDate: "22/03/2026", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop" },
    { id: 6, product: "Jabón Líquido para Ropa 3L", supermarketId: 6, categoryId: 6, oldPrice: 1890, newPrice: 1299, description: "Jabón líquido para ropa, aroma fresco.", expiryDate: "15/09/2026", image: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?q=80&w=800&auto=format&fit=crop" },
    { id: 7, product: "Hamburguesas x 4 unidades", supermarketId: 1, categoryId: 7, oldPrice: 1250, newPrice: 899, description: "Hamburguesas listas para cook, 4 unidades.", expiryDate: "10/04/2026", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop" },
    { id: 8, product: "Papas Fritas Churrasqueras", supermarketId: 2, categoryId: 8, oldPrice: 380, newPrice: 249, description: "Papas fritas crujientes ideales para la parrilla.", expiryDate: "28/02/2026", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=800&auto=format&fit=crop" },
    { id: 9, product: "Shampoo Anticaspa 400ml", supermarketId: 3, categoryId: 9, oldPrice: 890, newPrice: 599, description: "Shampoo anticaspa con tecnología de doble acción.", expiryDate: "12/08/2026", image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800&auto=format&fit=crop" },
    { id: 10, product: "Arroz Largo Fino 5kg", supermarketId: 4, categoryId: 10, oldPrice: 1890, newPrice: 1499, description: "Arroz largo fino de primera calidad.", expiryDate: "15/12/2026", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=800&auto=format&fit=crop" },
    { id: 11, product: "Pechuga de Pollo x kg", supermarketId: 5, categoryId: 1, oldPrice: 1590, newPrice: 1199, description: "Pechuga de pollo fresca, sin hueso ni piel.", expiryDate: "17/03/2026", image: "https://images.unsplash.com/photo-1587593810167-a84920ea0781?q=80&w=800&auto=format&fit=crop" },
    { id: 12, product: "Queso Crema", supermarketId: 6, categoryId: 2, oldPrice: 650, newPrice: 449, description: "Queso crema para untar, textura suave.", expiryDate: "20/04/2026", image: "https://images.unsplash.com/photo-1626200419199-391ae4be7a41?q=80&w=800&auto=format&fit=crop" },
    { id: 13, product: "Agua Mineral 500ml x 6", supermarketId: 1, categoryId: 3, oldPrice: 780, newPrice: 549, description: "Pack de 6 botellas de agua mineral.", expiryDate: "30/11/2026", image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?q=80&w=800&auto=format&fit=crop" },
    { id: 14, product: "Manzana Roja x kg", supermarketId: 2, categoryId: 4, oldPrice: 790, newPrice: 499, description: "Manzanas rojas frescas, dulces y crujientes.", expiryDate: "25/03/2026", image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?q=80&w=800&auto=format&fit=crop" },
    { id: 15, product: "Baguette Francesa", supermarketId: 3, categoryId: 5, oldPrice: 320, newPrice: 199, description: "Baguette fresca de panadería.", expiryDate: "15/03/2026", image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=800&auto=format&fit=crop" },
    { id: 16, product: "Detergente Líquido 500ml", supermarketId: 4, categoryId: 6, oldPrice: 490, newPrice: 349, description: "Detergente líquido multidósito.", expiryDate: "18/07/2026", image: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?q=80&w=800&auto=format&fit=crop" },
    { id: 17, product: "Helado Vainilla 1L", supermarketId: 5, categoryId: 7, oldPrice: 1250, newPrice: 899, description: "Helado artesanal de vainilla.", expiryDate: "05/05/2026", image: "https://images.unsplash.com/photo-1571875257727-256c39da42af?q=80&w=800&auto=format&fit=crop" },
    { id: 18, product: "Pochoclos para Microondas", supermarketId: 6, categoryId: 8, oldPrice: 450, newPrice: 299, description: "Pochoclos listos para microondas.", expiryDate: "10/10/2026", image: "https://images.unsplash.com/photo-1578849278619-e73505e9610f?q=80&w=800&auto=format&fit=crop" },
    { id: 19, product: "Desodorante Roll-On 50ml", supermarketId: 1, categoryId: 9, oldPrice: 590, newPrice: 399, description: "Desodorante roll-on 48hs de protección.", expiryDate: "22/08/2026", image: "https://images.unsplash.com/photo-1529243856184-4f86dabe2d98?q=80&w=800&auto=format&fit=crop" },
    { id: 20, product: "Fideos Spaghetti 500g", supermarketId: 2, categoryId: 10, oldPrice: 380, newPrice: 249, description: "Fideos longos tipo spaghetti.", expiryDate: "15/11/2026", image: "https://images.unsplash.com/photo-1551462147-37885acc36f1?q=80&w=800&auto=format&fit=crop" },
    { id: 21, product: "Salmon Fresco x kg", supermarketId: 3, categoryId: 1, oldPrice: 4590, newPrice: 3299, description: "Salmón fresco de criadero.", expiryDate: "16/03/2026", image: "https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?q=80&w=800&auto=format&fit=crop" },
    { id: 22, product: "Yogur Bebible x 6", supermarketId: 4, categoryId: 2, oldPrice: 890, newPrice: 649, description: "Yogur bebible sabor Vainilla.", expiryDate: "28/03/2026", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=800&auto=format&fit=crop" },
    { id: 23, product: "Jugo de Naranja 1L", supermarketId: 5, categoryId: 3, oldPrice: 590, newPrice: 399, description: "Jugo de naranja natural.", expiryDate: "20/03/2026", image: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?q=80&w=800&auto=format&fit=crop" },
    { id: 24, product: "Zanahoria x kg", supermarketId: 6, categoryId: 4, oldPrice: 290, newPrice: 179, description: "Zanahorias frescas.", expiryDate: "22/03/2026", image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=800&auto=format&fit=crop" },
    { id: 25, product: "Galletas Chocolate x 6", supermarketId: 1, categoryId: 8, oldPrice: 720, newPrice: 499, description: "Galletas con chips de chocolate.", expiryDate: "15/06/2026", image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?q=80&w=800&auto=format&fit=crop" },
    { id: 26, product: "Crema Dental 150g", supermarketId: 2, categoryId: 9, oldPrice: 690, newPrice: 449, description: "Crema dental con fluor.", expiryDate: "30/09/2026", image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?q=80&w=800&auto=format&fit=crop" },
    { id: 27, product: "Aceite de Oliva 500ml", supermarketId: 3, categoryId: 10, oldPrice: 1890, newPrice: 1399, description: "Aceite de oliva extra virgen.", expiryDate: "18/11/2026", image: "https://images.unsplash.com/photo-1474979266404-7eaacabc8805?q=80&w=800&auto=format&fit=crop" },
    { id: 28, product: "Pavita de Cerdo x kg", supermarketId: 4, categoryId: 1, oldPrice: 2190, newPrice: 1699, description: "Pavita de cerdo fresca.", expiryDate: "19/03/2026", image: "https://images.unsplash.com/photo-1602491673980-73aa38de027a?q=80&w=800&auto=format&fit=crop" },
    { id: 29, product: "Manteca 200g", supermarketId: 5, categoryId: 2, oldPrice: 490, newPrice: 349, description: "Manteca clarificada.", expiryDate: "25/04/2026", image: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?q=80&w=800&auto=format&fit=crop" },
    { id: 30, product: "Gaseosa Sprite 2.25L", supermarketId: 6, categoryId: 3, oldPrice: 590, newPrice: 399, description: "Gaseosa Sprite, lima-limón.", expiryDate: "20/08/2026", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=800&auto=format&fit=crop" }
];

// Changuitos (Canastas pre-armadas)
const changuitos = [
    { id: 1, name: "Canasta Básica Ahorro", description: "Los productos esenciales para la semana al mejor precio.", supermarketId: 1, image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop", items: [
        { name: "Leche Entera 1L", price: 120 },
        { name: "Pan Francés 500g", price: 150 },
        { name: "Arroz 1kg", price: 180 },
        { name: "Fideos 500g", price: 130 },
        { name: "Aceite de Girasol 900ml", price: 450 }
    ],
    totalPrice: 1030,
    icon: "fa-shopping-basket"
    },
    { id: 2, name: "Combo Asado Dominguero", description: "Todo lo necesario para un asado completo para 4 personas.", supermarketId: 2, image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?q=80&w=800&auto=format&fit=crop", items: [
        { name: "Asado de Tira 2kg", price: 4500 },
        { name: "Chorizo (4 unidades)", price: 1200 },
        { name: "Carbón 4kg", price: 800 },
        { name: "Pan de Campo", price: 500 },
        { name: "Vino Tinto 750ml", price: 1500 }
    ],
    totalPrice: 8500,
    icon: "fa-fire"
    },
    { id: 3, name: "Kit Limpieza Total", description: "Mantene tu casa impecable con este kit de ofertas.", supermarketId: 3, image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?q=80&w=800&auto=format&fit=crop", items: [
        { name: "Detergente 500ml", price: 350 },
        { name: "Lavandina 1L", price: 250 },
        { name: "Limpiador de Pisos 1L", price: 400 },
        { name: "Jabón en Polvo 800g", price: 900 }
    ],
    totalPrice: 1900,
    icon: "fa-broom"
    }
];

// Exportar datos
const appData = {
    supermarkets,
    categories,
    offers,
    changuitos
};

// Para el navegador
if (typeof window !== 'undefined') {
    window.appData = appData;
}

// Para Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = appData;
}
