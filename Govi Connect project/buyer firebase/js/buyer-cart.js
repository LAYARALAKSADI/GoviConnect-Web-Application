import { db, auth } from './firebase-config.js';
import { collection, addDoc, updateDoc, doc, runTransaction } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

let cart = JSON.parse(localStorage.getItem('buyerCart')) || [];

// Display cart items
function displayCart() {
    const cartContainer = document.getElementById('cartItems');
    const totalItemsEl = document.getElementById('totalItems');
    const totalAmountEl = document.getElementById('totalAmount');
    
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        totalItemsEl.textContent = '0';
        totalAmountEl.textContent = '0.00';
        return;
    }

    let totalItems = 0;
    let totalAmount = 0;

    cartContainer.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        totalItems += item.quantity;
        totalAmount += itemTotal;

        return `
            <div class="cart-item">
                <img src="${item.imageUrl || 'images/placeholder.jpg'}" alt="${item.name}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p class="price">Rs. ${item.price}/kg</p>
                </div>
                <div class="quantity-controls">
                    <button onclick="updateQuantity('${item.productId}', -1)">-</button>
                    <span>${item.quantity} kg</span>
                    <button onclick="updateQuantity('${item.productId}', 1)">+</button>
                </div>
                <div class="item-total">
                    Rs. ${itemTotal.toFixed(2)}
                </div>
                <button onclick="removeFromCart('${item.productId}')" class="btn-secondary">Remove</button>
            </div>
        `;
    }).join('');

    totalItemsEl.textContent = totalItems;
    totalAmountEl.textContent = totalAmount.toFixed(2);
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.productId === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            localStorage.setItem('buyerCart', JSON.stringify(cart));
            displayCart();
        }
    }
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.productId !== productId);
    localStorage.setItem('buyerCart', JSON.stringify(cart));
    displayCart();
}

// Place order
async function placeOrder() {
    const user = auth.currentUser;
    if (!user) {
        alert('Please login to place an order');
        window.location.href = 'buyer-login.html';
        return;
    }

    if (cart.length === 0) {
        alert('Your cart is empty');
        return;
    }

    try {
        // Calculate total amount
        const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Create order in Firestore
        const orderData = {
            buyerId: user.uid,
            items: cart.map(item => ({
                productId: item.productId,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                farmerId: item.farmerId
            })),
            totalAmount: totalAmount,
            status: 'placed',
            createdAt: new Date(),
            orderDate: new Date().toISOString().split('T')[0]
        };

        // Use transaction to ensure data consistency
        await runTransaction(db, async (transaction) => {
            // Create order document
            const orderRef = doc(collection(db, "orders"));
            transaction.set(orderRef, orderData);

            // Update product quantities
            for (const item of cart) {
                const productRef = doc(db, "products", item.productId);
                const productDoc = await transaction.get(productRef);
                
                if (!productDoc.exists()) {
                    throw new Error("Product not found");
                }

                const currentQuantity = productDoc.data().quantity;
                if (currentQuantity < item.quantity) {
                    throw new Error(`Insufficient quantity for ${item.name}`);
                }

                transaction.update(productRef, {
                    quantity: currentQuantity - item.quantity
                });
            }
        });

        // Clear cart and redirect
        localStorage.removeItem('buyerCart');
        alert('Order placed successfully!');
        window.location.href = 'order-history.html';

    } catch (error) {
        console.error("Error placing order:", error);
        alert('Error placing order: ' + error.message);
    }
}

// Make functions global
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.placeOrder = placeOrder;

// Initialize cart display
document.addEventListener('DOMContentLoaded', displayCart);