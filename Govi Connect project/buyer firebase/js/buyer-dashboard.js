// buyer-dashboard.js
import { auth, db } from './firebase-config.js';
import { 
    collection, 
    query, 
    where, 
    getDocs, 
    orderBy, 
    limit,
    doc,
    getDoc 
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

// Load dashboard data
async function loadDashboardData() {
    const user = auth.currentUser;
    if (!user) {
        window.location.href = 'buyer-login.html';
        return;
    }

    try {
        await loadUserInfo(user);
        await loadCartCount();
        await loadOrderStats(user.uid);
        await loadRecentOrders(user.uid);
        await loadRecommendedProducts();
    } catch (error) {
        console.error("Error loading dashboard:", error);
    }
}

// Load user information
async function loadUserInfo(user) {
    try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            document.getElementById('userName').textContent = userData.fullName || user.email.split('@')[0];
        } else {
            document.getElementById('userName').textContent = user.email.split('@')[0];
        }
    } catch (error) {
        console.error("Error loading user info:", error);
        document.getElementById('userName').textContent = user.email.split('@')[0];
    }
}

// Load cart count
function loadCartCount() {
    try {
        const cart = JSON.parse(localStorage.getItem('buyerCart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById('cartItemsCount').textContent = totalItems;
    } catch (error) {
        console.error("Error loading cart count:", error);
        document.getElementById('cartItemsCount').textContent = '0';
    }
}

// Load order statistics
async function loadOrderStats(userId) {
    try {
        const ordersQuery = query(
            collection(db, "orders"),
            where("buyerId", "==", userId)
        );
        
        const querySnapshot = await getDocs(ordersQuery);
        const totalOrders = querySnapshot.size;
        const pendingOrders = querySnapshot.docs.filter(doc => 
            doc.data().status === 'placed' || doc.data().status === 'processing'
        ).length;

        document.getElementById('pendingOrders').textContent = pendingOrders;
        document.getElementById('totalOrders').textContent = totalOrders;
    } catch (error) {
        console.error("Error loading order stats:", error);
        document.getElementById('pendingOrders').textContent = '0';
        document.getElementById('totalOrders').textContent = '0';
    }
}

// Load recent orders
async function loadRecentOrders(userId) {
    try {
        const ordersQuery = query(
            collection(db, "orders"),
            where("buyerId", "==", userId),
            orderBy("createdAt", "desc"),
            limit(5)
        );

        const querySnapshot = await getDocs(ordersQuery);
        const recentOrdersContainer = document.getElementById('recentOrders');
        
        if (querySnapshot.empty) {
            recentOrdersContainer.innerHTML = '<p class="loading">No recent orders found</p>';
            return;
        }

        recentOrdersContainer.innerHTML = querySnapshot.docs.map(doc => {
            const order = doc.data();
            const orderDate = order.createdAt?.toDate ? 
                new Date(order.createdAt.toDate()).toLocaleDateString() : 
                new Date().toLocaleDateString();
            
            return `
                <div class="recent-order-item">
                    <div>
                        <div class="order-id">Order #${doc.id.substring(0, 8)}</div>
                        <div class="order-date">${orderDate}</div>
                    </div>
                    <div class="order-amount">Rs. ${order.totalAmount?.toFixed(2) || '0.00'}</div>
                    <span class="order-status ${order.status}">${order.status || 'placed'}</span>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error("Error loading recent orders:", error);
        document.getElementById('recentOrders').innerHTML = '<p class="loading">Error loading orders</p>';
    }
}

// Load recommended products
async function loadRecommendedProducts() {
    try {
        const productsQuery = query(
            collection(db, "products"),
            where("status", "==", "approved"),
            limit(4)
        );

        const querySnapshot = await getDocs(productsQuery);
        const recommendedContainer = document.getElementById('recommendedProducts');
        
        if (querySnapshot.empty) {
            recommendedContainer.innerHTML = '<p class="loading">No products available</p>';
            return;
        }

        recommendedContainer.innerHTML = querySnapshot.docs.map(doc => {
            const product = doc.data();
            
            return `
                <div class="product-card">
                    <img src="${product.imageUrl || 'images/placeholder.jpg'}" alt="${product.name}" onerror="this.src='images/placeholder.jpg'">
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <p class="price">Rs. ${product.price}/kg</p>
                        <p class="quantity">Available: ${product.quantity} kg</p>
                        <button onclick="viewProduct('${doc.id}')" class="btn-primary">View Details</button>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error("Error loading recommended products:", error);
        document.getElementById('recommendedProducts').innerHTML = '<p class="loading">Error loading products</p>';
    }
}

// View product details
function viewProduct(productId) {
    window.location.href = `products-browse.html#product-${productId}`;
}

// Logout function
async function logout() {
    try {
        if (confirm('Are you sure you want to logout?')) {
            await signOut(auth);
            localStorage.removeItem('buyerCart');
            window.location.href = 'buyer-login.html';
        }
    } catch (error) {
        console.error("Error signing out:", error);
        alert('Error signing out: ' + error.message);
    }
}

// Make functions global
window.viewProduct = viewProduct;
window.logout = logout;

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', loadDashboardData);