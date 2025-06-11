// Cart utilities
const CartUtils = {
    getCart() {
        try {
            const cart = localStorage.getItem('cart');
            return cart ? JSON.parse(cart) : [];
        } catch (error) {
            console.error('Error getting cart from localStorage:', error);
            return [];
        }
    },

    saveCart(cart) {
        try {
            localStorage.setItem('cart', JSON.stringify(cart));
        } catch (error) {
            console.error('Error saving cart to localStorage:', error);
            throw new Error('Failed to save cart');
        }
    },

    addToCart(product) {
        try {
            const cart = this.getCart();
            const existingItem = cart.find(item => item.id === product.id);
            
            if (existingItem) {
                existingItem.count += 1;
            } else {
                cart.push({
                    ...product,
                    count: 1
                });
            }
            
            this.saveCart(cart);
            
            // Notify about cart update
            if (typeof renderCart === 'function') {
                renderCart();
            } else {
                console.warn('renderCart function not available');
            }
        } catch (error) {
            console.error('Error adding item to cart:', error);
            throw new Error('Failed to add item to cart');
        }
    },

    removeFromCart(productId) {
        try {
            const cart = this.getCart();
            const updatedCart = cart.filter(item => item.id !== productId);
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