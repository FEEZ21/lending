// Cart utilities
const CartUtils = {
    getCart() {
        try {
            const cart = localStorage.getItem('cart');
            const parsedCart = cart ? JSON.parse(cart) : [];
            console.log('Cart fetched from localStorage:', parsedCart); // DEBUG: Log fetched cart
            return parsedCart;
        } catch (error) {
            console.error('Error getting cart from localStorage:', error);
            return [];
        }
    },

    saveCart(cart) {
        // This function is no longer directly used for saving to localStorage from addToCart
        // but might be used elsewhere. Keep it as is.
        try {
            localStorage.setItem('cart', JSON.stringify(cart));
        } catch (error) {
            console.error('Error saving cart to localStorage:', error);
            throw new Error('Failed to save cart');
        }
    },

    async addToCart(product) { // Made async to await fetch
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Пожалуйста, войдите в систему, чтобы добавить товар в корзину.');
                return;
            }

            const response = await fetch('https://lending-juaw.onrender.com/api/cart/items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    productId: product._id,
                    quantity: 1 // Always add 1 for now
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add item to cart');
            }

            alert('Товар добавлен в корзину!');
            // Notify about cart update (this will trigger renderCart in cart.js)
            if (typeof renderCart === 'function') {
                renderCart();
            } else {
                console.warn('renderCart function not available');
            }
        } catch (error) {
            console.error('Error adding item to cart:', error);
            alert(`Ошибка при добавлении товара в корзину: ${error.message}`);
        }
    },

    removeFromCart(productId) {
        try {
            const cart = this.getCart();
            const updatedCart = cart.filter(item => item._id !== productId);
            this.saveCart(updatedCart);
            
            if (typeof renderCart === 'function') {
                renderCart();
            }
        } catch (error) {
            console.error('Error removing item from cart:', error);
            throw new Error('Failed to remove item from cart');
        }
    },

    clearCart() {
        try {
            this.saveCart([]);
            if (typeof renderCart === 'function') {
                renderCart();
            }
        } catch (error) {
            console.error('Error clearing cart:', error);
            throw new Error('Failed to clear cart');
        }
    },

    getTotal() {
        try {
            const cart = this.getCart();
            return cart.reduce((sum, item) => {
                const price = parseInt(item.price.replace(/\D/g, ''));
                return sum + price * item.count;
            }, 0);
        } catch (error) {
            console.error('Error calculating cart total:', error);
            return 0;
        }
    }
};

// Export functions to global scope
window.getCart = CartUtils.getCart.bind(CartUtils);
window.saveCart = CartUtils.saveCart.bind(CartUtils);
window.addToCart = CartUtils.addToCart.bind(CartUtils);
window.removeFromCart = CartUtils.removeFromCart.bind(CartUtils);
window.clearCart = CartUtils.clearCart.bind(CartUtils);
window.getTotal = CartUtils.getTotal.bind(CartUtils); 