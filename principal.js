document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. LÓGICA DO CARROSSEL
    // ==========================================
    const carouselInner = document.getElementById('carousel-inner');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const carouselItems = document.querySelectorAll('.carousel-item');
    const dots = document.querySelectorAll('.dot');

    let currentIndex = 0;
    const totalItems = carouselItems.length;

    function updateCarousel() {
        if (!carouselInner) return;
        carouselInner.style.transform = `translateX(${-currentIndex * 100}%)`;
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex === totalItems - 1) ? 0 : currentIndex + 1;
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex === 0) ? totalItems - 1 : currentIndex - 1;
            updateCarousel();
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
        });
    });

    setInterval(() => {
        currentIndex = (currentIndex === totalItems - 1) ? 0 : currentIndex + 1;
        updateCarousel();
    }, 5000);

    // ==========================================
    // 2. LÓGICA DO CARRINHO (SISTEMA COMPLETO)
    // ==========================================
    let cart = [];
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    const cartButton = document.getElementById('cart-button');
    const closeCart = document.getElementById('close-cart');

    // Funções de Abrir/Fechar
    const openCart = () => {
        sidebar.classList.add('open');
        overlay.style.display = 'block';
    };

    const toggleCart = () => {
        sidebar.classList.remove('open');
        overlay.style.display = 'none';
    };

    if (cartButton) cartButton.onclick = openCart;
    if (closeCart) closeCart.onclick = toggleCart;
    if (overlay) overlay.onclick = toggleCart;

    // Função global para adicionar (usada no HTML)
    window.addToCart = (id, name, price, img) => {
        const existingItem = cart.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.qty += 1;
        } else {
            cart.push({ id, name, price, img, qty: 1 });
        }

        renderCart();
        openCart(); // Abre o carrinho automaticamente ao adicionar
    };

    // Função para mudar quantidade ou remover
    window.changeQty = (id, delta) => {
        const item = cart.find(i => i.id === id);
        if (item) {
            item.qty += delta;
            if (item.qty <= 0) {
                cart = cart.filter(i => i.id !== id);
            }
        }
        renderCart();
    };

    // Atualiza o visual do Carrinho
    function renderCart() {
        const list = document.getElementById('cart-items-list');
        const badge = document.getElementById('cart-count');
        const totalValue = document.getElementById('cart-total-value');
        
        // Atualiza o Ícone (Badge)
        const totalItemsCount = cart.reduce((sum, item) => sum + item.qty, 0);
        badge.innerText = totalItemsCount;
        badge.classList.add('bump');
        setTimeout(() => badge.classList.remove('bump'), 300);

        // Se estiver vazio
        if (cart.length === 0) {
            list.innerHTML = `<p style="text-align:center; color:#777; margin-top:50px;">Seu carrinho está vazio.</p>`;
            totalValue.innerText = "R$ 0,00";
            return;
        }

        // Gera a lista de produtos no HTML
        let totalCash = 0;
        list.innerHTML = cart.map(item => {
            totalCash += item.price * item.qty;
            return `
                <div class="cart-item-ui" style="display: flex; gap: 10px; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
                    <img src="${item.img}" width="60" style="border-radius: 5px;">
                    <div style="flex: 1;">
                        <h4 style="font-size: 0.9rem;">${item.name}</h4>
                        <p style="color: rgb(113, 16, 204); font-weight: bold;">R$ ${item.price.toFixed(2)}</p>
                        <div style="display: flex; align-items: center; gap: 10px; margin-top: 5px;">
                            <button onclick="changeQty(${item.id}, -1)" style="cursor:pointer; width: 25px;">-</button>
                            <span>${item.qty}</span>
                            <button onclick="changeQty(${item.id}, 1)" style="cursor:pointer; width: 25px;">+</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        totalValue.innerText = `R$ ${totalCash.toFixed(2)}`;
    }

    // Inicializa
    updateCarousel();
});

