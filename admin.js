// Estado del Admin
let currentSupermarketId = 1;
let currentTab = 'overview';
let supermarkets = [];
let categories = [];
let offers = [];
let orders = [];

// Inicialización
document.addEventListener('DOMContentLoaded', async () => {
    // Cargar datos básicos
    await Promise.all([
        fetchSupermarkets(),
        fetchCategories()
    ]);

    // Llenar selector de supermercados
    const selector = document.getElementById('supermarketSelector');
    supermarkets.forEach(s => {
        const option = document.createElement('option');
        option.value = s.id;
        option.textContent = s.name;
        selector.appendChild(option);
    });

    selector.addEventListener('change', (e) => {
        currentSupermarketId = parseInt(e.target.value);
        refreshDashboard();
    });

    // Llenar selector de categorías en el formulario
    const catSelector = document.getElementById('offerCategory');
    categories.forEach(c => {
        const option = document.createElement('option');
        option.value = c.id;
        option.textContent = c.name;
        catSelector.appendChild(option);
    });

    // Eventos de Navegación
    document.querySelectorAll('.menu-item[data-tab]').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = item.getAttribute('data-tab');
            switchTab(tab);
        });
    });

    // Evento Formulario
    document.getElementById('offerForm').addEventListener('submit', handleAddOffer);
    document.getElementById('btnAddOffer').addEventListener('click', toggleOfferForm);

    // Primera carga
    refreshDashboard();
    
    // Fecha actual
    document.getElementById('currentDateDisplay').textContent = new Date().toLocaleDateString('es-AR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
});

async function fetchSupermarkets() {
    const res = await fetch('/api/supermarkets');
    supermarkets = await res.json();
}

async function fetchCategories() {
    const res = await fetch('/api/categories');
    categories = await res.json();
}

async function refreshDashboard() {
    const superm = supermarkets.find(s => s.id === currentSupermarketId);
    if (superm) {
        document.getElementById('supermarketNameDisplay').textContent = `Panel de ${superm.name}`;
    }

    await Promise.all([
        fetchAdminOrders(),
        fetchAdminOffers()
    ]);

    renderOverview();
    renderOrders();
    renderOffers();
}

async function fetchAdminOrders() {
    const res = await fetch(`/api/admin/orders?supermarketId=${currentSupermarketId}`);
    orders = await res.json();
}

async function fetchAdminOffers() {
    const res = await fetch(`/api/admin/offers?supermarketId=${currentSupermarketId}`);
    offers = await res.json();
}

function switchTab(tab) {
    currentTab = tab;
    // UI Update
    document.querySelectorAll('.menu-item').forEach(i => i.classList.remove('active'));
    document.querySelector(`.menu-item[data-tab="${tab}"]`).classList.add('active');

    document.querySelectorAll('.admin-content').forEach(c => c.classList.remove('active'));
    document.getElementById(`tab-${tab}`).classList.add('active');
}

function renderOverview() {
    document.getElementById('statActiveOffers').textContent = offers.length;
    
    const newOrders = orders.filter(o => o.status === 'pendiente').length;
    document.getElementById('statNewOrders').textContent = newOrders;

    // Calcular "ventas" (total de pedidos entregados o pendientes x precio estimado)
    // Usamos $1000 como base si no hay precio real
    const totalSales = orders.length * 12500; 
    document.getElementById('statTotalSales').textContent = `$${totalSales.toLocaleString()}`;

    // Pedidos recientes (top 5)
    const table = document.getElementById('recentOrdersTable');
    table.innerHTML = '';
    
    orders.slice(0, 5).forEach(o => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>#${o.id.toString().slice(-4)}</td>
            <td>${o.productName}</td>
            <td>Cliente Anónimo</td>
            <td>${o.address}</td>
            <td>$${Math.floor(Math.random() * 5000 + 1000)}</td>
            <td><span class="status-pill status-${o.status}">${o.status}</span></td>
        `;
        table.appendChild(tr);
    });
}

function renderOrders() {
    const table = document.getElementById('allOrdersTable');
    table.innerHTML = '';

    orders.forEach(o => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>#${o.id}</td>
            <td>${new Date(o.timestamp).toLocaleDateString()}</td>
            <td>${o.productName}</td>
            <td>${o.address}</td>
            <td>${o.phone}</td>
            <td>${o.paymentMethod}</td>
            <td>
                <select onchange="updateOrderStatus(${o.id}, this.value)" class="status-pill status-${o.status}">
                    <option value="pendiente" ${o.status === 'pendiente' ? 'selected' : ''}>Pendiente</option>
                    <option value="entregado" ${o.status === 'entregado' ? 'selected' : ''}>Entregado</option>
                    <option value="cancelado" ${o.status === 'cancelado' ? 'selected' : ''}>Cancelado</option>
                </select>
            </td>
            <td>
                <button class="btn-icon btn-delete" onclick="handleDeleteOrder(${o.id})"><i class="fas fa-trash"></i></button>
            </td>
        `;
        table.appendChild(tr);
    });
}

function renderOffers() {
    const table = document.getElementById('offersListTable');
    table.innerHTML = '';

    offers.forEach(o => {
        const cat = categories.find(c => c.id === o.categoryId);
        const tr = document.createElement('tr');
        const discount = Math.round(((o.oldPrice - o.newPrice) / o.oldPrice) * 100);
        
        tr.innerHTML = `
            <td><img src="${o.image}" style="width: 40px; height: 40px; border-radius: 4px; object-fit: cover;"></td>
            <td style="font-weight: 600;">${o.product}</td>
            <td>${cat ? cat.name : 'N/A'}</td>
            <td style="color: var(--gray);">$${o.oldPrice}</td>
            <td style="color: var(--primary); font-weight: 700;">$${o.newPrice}</td>
            <td><span style="color: var(--accent); font-weight: 700;">-${discount}%</span></td>
            <td>
                <div class="action-btns">
                    <button class="btn-icon btn-edit"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon btn-delete" onclick="handleDeleteOffer(${o.id})"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        `;
        table.appendChild(tr);
    });
}

async function handleAddOffer(e) {
    e.preventDefault();
    
    const offerData = {
        product: document.getElementById('offerProduct').value,
        supermarketId: currentSupermarketId,
        categoryId: document.getElementById('offerCategory').value,
        oldPrice: document.getElementById('offerOldPrice').value,
        newPrice: document.getElementById('offerNewPrice').value,
        expiryDate: document.getElementById('offerExpiry').value,
        image: document.getElementById('offerImage').value,
        description: document.getElementById('offerDescription').value
    };

    const res = await fetch('/api/admin/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(offerData)
    });

    if (res.ok) {
        alert('Oferta agregada con éxito');
        document.getElementById('offerForm').reset();
        toggleOfferForm();
        refreshDashboard();
    }
}

async function handleDeleteOffer(id) {
    if (!confirm('¿Estás seguro de eliminar esta oferta?')) return;

    const res = await fetch(`/api/admin/offers/${id}`, { method: 'DELETE' });
    if (res.ok) {
        refreshDashboard();
    }
}

async function updateOrderStatus(id, status) {
    const res = await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    });
    
    if (res.ok) {
        refreshDashboard();
    }
}

function toggleOfferForm() {
    const section = document.getElementById('offerFormSection');
    section.style.display = section.style.display === 'none' ? 'block' : 'none';
    if (section.style.display === 'block') {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}
