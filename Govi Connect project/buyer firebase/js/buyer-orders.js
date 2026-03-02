import { db, auth } from './firebase-config.js';
import { collection, query, where, getDocs, orderBy } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Load order history
async function loadOrderHistory() {
    const user = auth.currentUser;
    if (!user) {
        window.location.href = 'buyer-login.html';
        return;
    }

    try {
        const ordersQuery = query(
            collection(db, "orders"),
            where("buyerId", "==", user.uid),
            orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(ordersQuery);
        const ordersList = document.getElementById('ordersList');

        if (querySnapshot.empty) {
            ordersList.innerHTML = '<p class="empty-orders">No orders found</p>';
            return;
        }

        ordersList.innerHTML = querySnapshot.docs.map(doc => {
            const order = doc.data();
            const orderDate = new Date(order.createdAt?.toDate()).toLocaleDateString();
            
            return `
                <div class="order-card">
                    <div class="order-header">
                        <h3>Order #${doc.id.substring(0, 8)}</h3>
                        <span class="order-status ${order.status}">${order.status}</span>
                    </div>
                    <div class="order-details">
                        <p><strong>Date:</strong> ${orderDate}</p>
                        <p><strong>Total Amount:</strong> Rs. ${order.totalAmount.toFixed(2)}</p>
                        <p><strong>Items:</strong> ${order.items.length}</p>
                    </div>
                    <div class="order-items">
                        ${order.items.map(item => `
                            <div class="order-item">
                                <span>${item.name}</span>
                                <span>${item.quantity} kg × Rs. ${item.price}</span>
                                <span>Rs. ${(item.quantity * item.price).toFixed(2)}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');

    } catch (error) {
        console.error("Error loading orders:", error);
        document.getElementById('ordersList').innerHTML = '<p>Error loading orders</p>';
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', loadOrderHistory);