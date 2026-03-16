// Aplicación de Ofertas de Supermercados
class OfertasApp {
    constructor() {
        this.data = {
            supermarkets: [],
            categories: [],
            offers: [],
            changuitos: []
        };
        this.favorites = this.loadFavorites();
        this.currentSection = 'inicio';
        this.selectedCategory = null;
        
        this.init();
    }

    async init() {
        await this.loadData();
        this.renderStats();
        this.renderCategories();
        this.renderSupermarkets();
        this.renderFeaturedOffers();
        this.renderAllOffers();
        this.renderChanguitos();
        this.renderFavorites();
        this.populateFilters();
        this.bindEvents();
    }

    async loadData() {
        try {
            const ts = Date.now();
            const [smRes, catRes, offRes, chanRes] = await Promise.all([
                fetch(`/api/supermarkets?t=${ts}`),
                fetch(`/api/categories?t=${ts}`),
                fetch(`/api/offers?t=${ts}`),
                fetch(`/api/changuitos?t=${ts}`)
            ]);

            this.data.supermarkets = await smRes.json();
            this.data.categories = await catRes.json();
            this.data.offers = await offRes.json();
            this.data.changuitos = await chanRes.json();
        } catch (error) {
            console.error('Error loading data from API:', error);
            // Fallback to window.appData if available (for dev/local testing)
            if (window.appData) {
                this.data = window.appData;
            }
        }
    }

    // Cargar favoritos del localStorage
    loadFavorites() {
        const saved = localStorage.getItem('ofertasFavoritos');
        return saved ? JSON.parse(saved) : [];
    }

    // Guardar favoritos en localStorage
    saveFavorites() {
        localStorage.setItem('ofertasFavoritos', JSON.stringify(this.favorites));
    }

    // Calcular descuento
    calculateDiscount(oldPrice, newPrice) {
        return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
    }

    // Formatear precio
    formatPrice(price) {
        return '$' + price.toLocaleString('es-AR');
    }

    // Obtener supermercado por ID
    getSupermarket(id) {
        return this.data.supermarkets.find(s => s.id === id);
    }

    // Obtener categoría por ID
    getCategory(id) {
        return this.data.categories.find(c => c.id === id);
    }

    // Renderizar estadísticas
    renderStats() {
        const totalOffers = this.data.offers.length;
        const totalSupermarkets = this.data.supermarkets.length;
        
        // Calcular descuento promedio
        const totalDiscount = this.data.offers.reduce((acc, offer) => {
            return acc + this.calculateDiscount(offer.oldPrice, offer.newPrice);
        }, 0);
        const avgDiscount = Math.round(totalDiscount / totalOffers);

        document.getElementById('totalSupermarkets').textContent = totalSupermarkets;
        document.getElementById('totalOffers').textContent = totalOffers;
        document.getElementById('avgDiscount').textContent = avgDiscount + '%';
    }

    // Renderizar categorías
    renderCategories() {
        const grid = document.getElementById('categoriesGrid');
        grid.innerHTML = this.data.categories.map(cat => `
            <div class="category-card" data-category="${cat.id}">
                <i class="fas ${cat.icon}"></i>
                <span>${cat.name}</span>
            </div>
        `).join('');
    }

    // Renderizar supermercados
    renderSupermarkets() {
        const grid = document.getElementById('supermarketsGrid');
        grid.innerHTML = this.data.supermarkets.map(sm => `
            <div class="supermarket-card" data-supermarket="${sm.id}">
                <div class="supermarket-logo" style="background: ${sm.color}">
                    ${sm.icon}
                </div>
                <div class="supermarket-info">
                    <h3>${sm.name}</h3>
                    <p><i class="fas fa-map-marker-alt"></i> ${sm.address}</p>
                    <span class="supermarket-offers">${sm.offers} ofertas disponibles</span>
                </div>
            </div>
        `).join('');
    }

    // Renderizar tarjeta de oferta
    renderOfferCard(offer) {
        const supermarket = this.getSupermarket(offer.supermarketId);
        const category = this.getCategory(offer.categoryId);
        const discount = this.calculateDiscount(offer.oldPrice, offer.newPrice);
        const isFavorite = this.favorites.includes(offer.id);
        const imageHtml = offer.image 
            ? `<img src="${offer.image}" alt="${offer.product}">` 
            : `<i class="fas fa-box"></i>`;

        return `
            <div class="offer-card" data-offer="${offer.id}">
                <div class="offer-image">
                    ${imageHtml}
                    <span class="discount-badge">-${discount}%</span>
                    <button class="favorite-btn ${isFavorite ? 'active' : ''}" data-offer="${offer.id}">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
                <div class="offer-info">
                    <span class="supermarket-tag" style="background: ${supermarket.color}">${supermarket.name}</span>
                    <h4>${offer.product}</h4>
                    <div class="offer-prices">
                        <span class="old-price">${this.formatPrice(offer.oldPrice)}</span>
                        <span class="new-price">${this.formatPrice(offer.newPrice)}</span>
                    </div>
                    <span class="offer-expiry">
                        <i class="fas fa-clock"></i> Válido hasta ${offer.expiryDate}
                    </span>
                </div>
            </div>
        `;
    }

    // Renderizar ofertas destacadas
    renderFeaturedOffers() {
        const grid = document.getElementById('featuredOffers');
        // Ordenar por descuento y tomar las 4 primeras
        const featured = [...this.data.offers]
            .sort((a, b) => this.calculateDiscount(b.oldPrice, b.newPrice) - this.calculateDiscount(a.oldPrice, a.newPrice))
            .slice(0, 4);
        
        grid.innerHTML = featured.map(offer => this.renderOfferCard(offer)).join('');
    }

    // Renderizar todas las ofertas
    renderAllOffers() {
        const grid = document.getElementById('allOffers');
        let filteredOffers = [...this.data.offers];

        // Aplicar filtro de supermercado
        const filterSm = document.getElementById('filterSupermarket').value;
        if (filterSm !== 'all') {
            filteredOffers = filteredOffers.filter(o => o.supermarketId === parseInt(filterSm));
        }

        // Aplicar filtro de categoría
        const filterCat = document.getElementById('filterCategory').value;
        if (filterCat !== 'all') {
            filteredOffers = filteredOffers.filter(o => o.categoryId === parseInt(filterCat));
        }

        // Aplicar ordenamiento
        const sortBy = document.getElementById('filterSort').value;
        switch (sortBy) {
            case 'discount':
                filteredOffers.sort((a, b) => 
                    this.calculateDiscount(b.oldPrice, b.newPrice) - 
                    this.calculateDiscount(a.oldPrice, a.newPrice)
                );
                break;
            case 'price-low':
                filteredOffers.sort((a, b) => a.newPrice - b.newPrice);
                break;
            case 'price-high':
                filteredOffers.sort((a, b) => b.newPrice - a.newPrice);
                break;
            case 'name':
                filteredOffers.sort((a, b) => a.product.localeCompare(b.product));
                break;
        }

        grid.innerHTML = filteredOffers.map(offer => this.renderOfferCard(offer)).join('');
    }

    // Renderizar favoritos
    renderFavorites() {
        const grid = document.getElementById('favoritesOffers');
        const empty = document.getElementById('favoritesEmpty');

        if (this.favorites.length === 0) {
            grid.innerHTML = '';
            empty.style.display = 'block';
            return;
        }

        empty.style.display = 'none';
        const favoriteOffers = this.data.offers.filter(o => this.favorites.includes(o.id));
        grid.innerHTML = favoriteOffers.map(offer => this.renderOfferCard(offer)).join('');
    }

    // Renderizar changuitos
    renderChanguitos() {
        const grid = document.getElementById('changuitosGrid');
        if (!grid) return;

        grid.innerHTML = this.data.changuitos.map(chan => {
            const supermarket = this.getSupermarket(chan.supermarketId);
            const itemsHtml = chan.items.map(item => `
                <div class="changuito-item">
                    <span>${item.name}</span>
                    <span>${this.formatPrice(item.price)}</span>
                </div>
            `).join('');

            return `
                <div class="changuito-card">
                    <div class="changuito-header" style="background: ${supermarket.color}">
                        <div class="changuito-icon">
                            <i class="fas ${chan.icon}"></i>
                        </div>
                        <div class="changuito-title">
                            <h3>${chan.name}</h3>
                            <span>${supermarket.name}</span>
                        </div>
                    </div>
                    <div class="changuito-body">
                        ${chan.image ? `<div class="changuito-image"><img src="${chan.image}" alt="${chan.name}"></div>` : ''}
                        <p>${chan.description}</p>
                        <div class="changuito-items">
                            ${itemsHtml}
                        </div>
                        <div class="changuito-footer">
                            <div class="changuito-total">
                                <span class="label">Total estimado:</span>
                                <span class="value">${this.formatPrice(chan.totalPrice)}</span>
                            </div>
                            <button class="btn-delivery">
                                <i class="fas fa-truck"></i> Pedir Changuito
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Delegar click en botón de pedir changuito
        grid.querySelectorAll('.btn-delivery').forEach((btn, index) => {
            btn.addEventListener('click', () => {
                const chan = this.data.changuitos[index];
                this.openChanguitoModal(chan.id);
            });
        });
    }

    // Abrir modal para changuito
    openChanguitoModal(changuitoId) {
        const chan = this.data.changuitos.find(c => c.id === changuitoId);
        if (!chan) return;

        const supermarket = this.getSupermarket(chan.supermarketId);

        document.getElementById('modalProductName').textContent = chan.name;
        document.getElementById('modalOldPrice').textContent = '';
        document.getElementById('modalNewPrice').textContent = this.formatPrice(chan.totalPrice);
        document.getElementById('modalDiscount').textContent = 'COMBO';
        document.getElementById('modalSupermarket').textContent = supermarket.name;
        document.getElementById('modalSupermarket').style.background = supermarket.color;
        document.getElementById('modalDescription').textContent = chan.description;
        document.getElementById('modalCategory').textContent = 'Canasta Completa';
        document.getElementById('modalExpiry').textContent = 'Fin de mes';
        
        const modalImg = document.getElementById('modalProductImage');
        const modalIcon = document.querySelector('.modal-image i');
        
        modalImg.style.display = 'none';
        if (modalIcon) {
            modalIcon.className = `fas ${chan.icon}`;
            modalIcon.style.display = 'block';
            modalIcon.style.fontSize = '8rem';
            modalIcon.style.color = supermarket.color;
        }
        
        // Reset delivery form
        document.getElementById('deliveryForm').style.display = 'block'; // Mostrar directo para changuitos
        document.getElementById('modalDeliveryBtn').style.display = 'none';
        document.getElementById('orderAddress').value = '';
        document.getElementById('orderPhone').value = '';

        const modalBtn = document.getElementById('modalFavoriteBtn');
        modalBtn.style.display = 'none'; // No favoritos para changuitos por ahora
        delete modalBtn.dataset.offerId;
        modalBtn.dataset.changuitoId = changuitoId;

        document.getElementById('productModal').classList.add('active');
    }

    // Popular filtros
    populateFilters() {
        // Supermercados
        const smFilter = document.getElementById('filterSupermarket');
        this.data.supermarkets.forEach(sm => {
            const option = document.createElement('option');
            option.value = sm.id;
            option.textContent = sm.name;
            smFilter.appendChild(option);
        });

        // Categorías
        const catFilter = document.getElementById('filterCategory');
        this.data.categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            catFilter.appendChild(option);
        });
    }

    // Bind de eventos
    bindEvents() {
        // Navegación
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.navigateTo(section);
            });
        });

        // Ver todas las ofertas
        document.querySelectorAll('.view-all').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.navigateTo(section);
            });
        });

        // Categorías
        document.getElementById('categoriesGrid').addEventListener('click', (e) => {
            const card = e.target.closest('.category-card');
            if (card) {
                const categoryId = parseInt(card.dataset.category);
                
                // Toggle selección
                document.querySelectorAll('.category-card').forEach(c => c.classList.remove('active'));
                
                if (this.selectedCategory === categoryId) {
                    this.selectedCategory = null;
                    this.navigateTo('ofertas');
                } else {
                    card.classList.add('active');
                    this.selectedCategory = categoryId;
                    document.getElementById('filterCategory').value = categoryId;
                    this.navigateTo('ofertas');
                }
                
                this.renderAllOffers();
            }
        });

        // Filtros
        document.getElementById('filterSupermarket').addEventListener('change', () => this.renderAllOffers());
        document.getElementById('filterCategory').addEventListener('change', () => this.renderAllOffers());
        document.getElementById('filterSort').addEventListener('change', () => this.renderAllOffers());

        // Buscador
        document.getElementById('searchInput').addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            if (query.length < 2) return;

            const results = this.data.offers.filter(o => 
                o.product.toLowerCase().includes(query) ||
                this.getSupermarket(o.supermarketId).name.toLowerCase().includes(query)
            );

            // Mostrar resultados en modal o sección
            if (results.length > 0) {
                this.navigateTo('ofertas');
                const grid = document.getElementById('allOffers');
                grid.innerHTML = results.map(offer => this.renderOfferCard(offer)).join('');
            }
        });

        // Click en ofertas (delegation)
        document.addEventListener('click', (e) => {
            // Botón de favorito
            const favBtn = e.target.closest('.favorite-btn');
            if (favBtn) {
                e.stopPropagation();
                const offerId = parseInt(favBtn.dataset.offer);
                this.toggleFavorite(offerId);
                return;
            }

            // Card de oferta
            const offerCard = e.target.closest('.offer-card');
            if (offerCard) {
                const offerId = parseInt(offerCard.dataset.offer);
                this.openModal(offerId);
            }
        });

        // Modal
        document.getElementById('modalClose').addEventListener('click', () => this.closeModal());
        document.getElementById('productModal').addEventListener('click', (e) => {
            if (e.target.id === 'productModal') this.closeModal();
        });

        // Botón favorito del modal
        document.getElementById('modalFavoriteBtn').addEventListener('click', () => {
            const offerId = parseInt(document.getElementById('modalFavoriteBtn').dataset.offerId);
            this.toggleFavorite(offerId);
        });

        // Delivery
        document.getElementById('modalDeliveryBtn').addEventListener('click', () => {
            document.getElementById('deliveryForm').style.display = 'block';
            document.getElementById('modalDeliveryBtn').style.display = 'none';
        });

        document.getElementById('btnConfirmOrder').addEventListener('click', async () => {
            const productId = document.getElementById('modalFavoriteBtn').dataset.offerId;
            const changuitoId = document.getElementById('modalFavoriteBtn').dataset.changuitoId;
            const address = document.getElementById('orderAddress').value;
            const phone = document.getElementById('orderPhone').value;
            const paymentMethod = document.getElementById('orderPayment').value;

            if (!address || !phone) {
                alert('Por favor, completa los datos de envío.');
                return;
            }

            const body = changuitoId 
                ? { changuitoId: parseInt(changuitoId), address, phone, paymentMethod }
                : { productId: parseInt(productId), address, phone, paymentMethod };

            try {
                const response = await fetch('/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                });

                const result = await response.json();
                if (result.success) {
                    alert(`¡Pedido realizado! Tu número de orden es: ${result.orderId}`);
                    this.closeModal();
                }
            } catch (error) {
                console.error('Error al enviar el pedido:', error);
                alert('Hubo un error al procesar tu pedido. Por favor, intenta de nuevo.');
            }
        });
    }

    // Navegar a sección
    navigateTo(section) {
        this.currentSection = section;
        
        // Actualizar nav
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.dataset.section === section);
        });

        // Actualizar secciones
        document.querySelectorAll('.section').forEach(s => {
            s.classList.toggle('active', s.id === section);
        });

        // Scroll al inicio
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Toggle favorito
    toggleFavorite(offerId) {
        const index = this.favorites.indexOf(offerId);
        
        if (index === -1) {
            this.favorites.push(offerId);
        } else {
            this.favorites.splice(index, 1);
        }

        this.saveFavorites();
        this.renderAllOffers();
        this.renderFeaturedOffers();
        this.renderFavorites();
        
        // Actualizar modal si está abierto
        const modalBtn = document.getElementById('modalFavoriteBtn');
        if (modalBtn.classList.contains('active')) {
            this.updateModalFavoriteBtn();
        }
    }

    // Abrir modal
    openModal(offerId) {
        const offer = this.data.offers.find(o => o.id === offerId);
        if (!offer) return;

        const supermarket = this.getSupermarket(offer.supermarketId);
        const category = this.getCategory(offer.categoryId);
        const discount = this.calculateDiscount(offer.oldPrice, offer.newPrice);
        const isFavorite = this.favorites.includes(offerId);

        document.getElementById('modalProductName').textContent = offer.product;
        document.getElementById('modalOldPrice').textContent = this.formatPrice(offer.oldPrice);
        document.getElementById('modalNewPrice').textContent = this.formatPrice(offer.newPrice);
        document.getElementById('modalDiscount').textContent = `-${discount}%`;
        document.getElementById('modalSupermarket').textContent = supermarket.name;
        document.getElementById('modalSupermarket').style.background = supermarket.color;
        document.getElementById('modalDescription').textContent = offer.description;
        document.getElementById('modalCategory').textContent = category.name;
        document.getElementById('modalExpiry').textContent = offer.expiryDate;
        
        const modalImg = document.getElementById('modalProductImage');
        const modalIcon = document.querySelector('.modal-image i');
        if (offer.image) {
            modalImg.src = offer.image;
            modalImg.style.display = 'block';
            if (modalIcon) modalIcon.style.display = 'none';
        } else {
            modalImg.style.display = 'none';
            if (modalIcon) modalIcon.style.display = 'block';
        }
        
        // Reset delivery form
        document.getElementById('deliveryForm').style.display = 'none';
        document.getElementById('modalDeliveryBtn').style.display = 'flex';
        document.getElementById('orderAddress').value = '';
        document.getElementById('orderPhone').value = '';

        const modalBtn = document.getElementById('modalFavoriteBtn');
        modalBtn.style.display = 'flex';
        delete modalBtn.dataset.changuitoId;
        modalBtn.dataset.offerId = offerId;
        this.updateModalFavoriteBtn();

        document.getElementById('productModal').classList.add('active');
    }

    // Actualizar botón de favorito del modal
    updateModalFavoriteBtn() {
        const offerId = parseInt(document.getElementById('modalFavoriteBtn').dataset.offerId);
        const isFavorite = this.favorites.includes(offerId);
        const btn = document.getElementById('modalFavoriteBtn');
        
        if (isFavorite) {
            btn.innerHTML = '<i class="fas fa-heart"></i> Quitar de Favoritos';
            btn.classList.add('saved');
        } else {
            btn.innerHTML = '<i class="fas fa-heart"></i> Agregar a Favoritos';
            btn.classList.remove('saved');
        }
    }

    // Cerrar modal
    closeModal() {
        document.getElementById('productModal').classList.remove('active');
    }
}

// Inicializar app cuando cargue el DOM
document.addEventListener('DOMContentLoaded', () => {
    new OfertasApp();
});
