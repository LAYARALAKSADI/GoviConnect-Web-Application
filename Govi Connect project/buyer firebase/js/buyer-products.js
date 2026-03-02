import { db, auth } from './firebase-config.js';
import { collection, query, where, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

let allProducts = [];
let cart = JSON.parse(localStorage.getItem('buyerCart')) || [];

// Load approved products
async function loadProducts() {
    try {
        const productsQuery = query(
            collection(db, "products"),
            where("status", "==", "approved")
        );
        
        const querySnapshot = await getDocs(productsQuery);
        allProducts = [];
        
        querySnapshot.forEach((doc) => {
            allProducts.push({ id: doc.id, ...doc.data() });
        });
        
        displayProducts(allProducts);
        updateCartCount();
    } catch (error) {
        console.error("Error loading products:", error);
    }
}

// Display products in grid
function displayProducts(products) {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.imageUrl || 'images/placeholder.jpg'}" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="price">Rs. ${product.price}/kg</p>
                <p class="quantity">Available: ${product.quantity} kg</p>
                <button onclick="showProductDetails('${product.id}')" class="btn-primary">View Details</button>
                <button onclick="addToCart('${product.id}')" class="btn-secondary">Add to Cart</button>
            </div>
        `;
        grid.appendChild(productCard);
    });
}

// Show product details with farmer information
async function showProductDetails(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;

    try {
        // Get farmer details
        const farmerDoc = await getDoc(doc(db, "users", product.farmerId));
        const farmerData = farmerDoc.data();

        const modal = document.getElementById('productModal');
        const modalContent = document.getElementById('modalContent');
        
        modalContent.innerHTML = `
            <h2>${product.name}</h2>
            <img src="${product.imageUrl || 'images/placeholder.jpg'}" alt="${product.name}" class="modal-image">
            <p><strong>Description:</strong> ${product.description}</p>
            <p><strong>Price:</strong> Rs. ${product.price}/kg</p>
            <p><strong>Available Quantity:</strong> ${product.quantity} kg</p>
            <p><strong>Category:</strong> ${product.category}</p>
            
            <h3>Farmer Information</h3>
            <p><strong>Name:</strong> ${farmerData.fullName}</p>
            <p><strong>Contact:</strong> ${farmerData.phone}</p>
            <p><strong>Farm:</strong> ${farmerData.farmName || 'N/A'}</p>
            
            <div class="quantity-selector">
                <label for="orderQuantity">Quantity (kg):</label>
                <input type="number" id="orderQuantity" min="1" max="${product.quantity}" value="1">
            </div>
            <button onclick="addToCart('${product.id}', true)" class="btn-primary">Add to Cart</button>
        `;
        
        modal.classList.remove('hidden');
    } catch (error) {
        console.error("Error loading product details:", error);
    }
}

// Add to cart function
function addToCart(productId, fromModal = false) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;

    let quantity = 1;
    if (fromModal) {
        quantity = parseInt(document.getElementById('orderQuantity').value) || 1;
    }

    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            productId: productId,
            name: product.name,
            price: product.price,
            quantity: quantity,
            imageUrl: product.imageUrl,
            farmerId: product.farmerId
        });
    }

    localStorage.setItem('buyerCart', JSON.stringify(cart));
    updateCartCount();
    alert('Product added to cart!');
}

// Filter and search functions
function applyFilters() {
    const category = document.getElementById('categoryFilter').value;
    const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
    const maxPrice = parseFloat(document.getElementById('maxPrice').value) || Infinity;
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();

    const filteredProducts = allProducts.filter(product => {
        const matchesCategory = !category || product.category === category;
        const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
        const matchesSearch = !searchTerm || 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm);

        return matchesCategory && matchesPrice && matchesSearch;
    });

    displayProducts(filteredProducts);
}

function toggleFilters() {
    const filterSection = document.getElementById('filterSection');
    filterSection.classList.toggle('hidden');
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Modal close functionality
document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('productModal').classList.add('hidden');
});

// Make functions global for HTML onclick
window.showProductDetails = showProductDetails;
window.addToCart = addToCart;
window.applyFilters = applyFilters;
window.toggleFilters = toggleFilters;

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    
    // Add event listeners for real-time filtering
    document.getElementById('searchInput').addEventListener('input', applyFilters);
    document.getElementById('categoryFilter').addEventListener('change', applyFilters);
    document.getElementById('minPrice').addEventListener('change', applyFilters);
    document.getElementById('maxPrice').addEventListener('change', applyFilters);
});