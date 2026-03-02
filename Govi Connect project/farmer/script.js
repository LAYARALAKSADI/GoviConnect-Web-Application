// Farmer Management System JavaScript - Firebase Ready
// All fake data removed - ready for real backend integration

// Image Management
function previewImage(input, previewId) {
    const preview = document.getElementById(previewId);
    const file = input.files[0];
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        }
        reader.readAsDataURL(file);
    }
}

// Modal Management
function openAddFarmerModal() {
    document.getElementById('addFarmerModal').style.display = 'block';
}

function closeAddFarmerModal() {
    document.getElementById('addFarmerModal').style.display = 'none';
}

function closeFarmerModal() {
    document.getElementById('farmerDetailsModal').style.display = 'none';
}

// Close modals when clicking outside
window.addEventListener('click', function(e) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Form Submission Handlers
document.addEventListener('DOMContentLoaded', function() {
    // Add Farmer Form Submission
    const addFarmerForm = document.querySelector('.farmer-form');
    if (addFarmerForm) {
        addFarmerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const farmerData = {
                fullName: document.getElementById('fullName').value,
                nic: document.getElementById('nic').value,
                phone: document.getElementById('phone').value,
                village: document.getElementById('village').value,
                farmerCode: document.getElementById('farmerCode').value,
                landSize: document.getElementById('landSize').value,
                farmingType: document.getElementById('farmingType').value,
                notes: document.getElementById('notes').value,
                bankDetails: document.getElementById('bankDetails').value,
                createdAt: new Date().toISOString(),
                status: 'Active'
            };
            
            // Validate required fields
            if (!farmerData.fullName || !farmerData.nic || !farmerData.phone || !farmerData.village) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // TODO: Replace with Firebase add call
            console.log('Farmer data to save:', farmerData);
            alert('Farmer added successfully! (Firebase integration pending)');
            closeAddFarmerModal();
            this.reset();
        });
    }
});

// Product Management Functions
function addProduct(productData) {
    // TODO: Replace with Firebase call
    // return addDoc(collection(db, 'products'), {
    //     ...productData,
    //     farmerId: currentFarmerId,
    //     createdAt: new Date().toISOString()
    // });
    console.log('Adding product:', productData);
    return Promise.resolve();
}

function getProducts() {
    // TODO: Replace with Firebase call
    // return getDocs(collection(db, 'products'));
    return Promise.resolve({ empty: true });
}

function updateProduct(productId, data) {
    // TODO: Replace with Firebase call
    // return updateDoc(doc(db, 'products', productId), data);
    console.log('Updating product:', productId, data);
    return Promise.resolve();
}

function deleteProduct(productId) {
    // TODO: Replace with Firebase call
    // return deleteDoc(doc(db, 'products', productId));
    console.log('Deleting product:', productId);
    return Promise.resolve();
}

// Order Management Functions
function getOrders() {
    // TODO: Replace with Firebase call
    // return getDocs(collection(db, 'orders'));
    return Promise.resolve({ empty: true });
}

function updateOrderStatus(orderId, status) {
    // TODO: Replace with Firebase call
    // return updateDoc(doc(db, 'orders', orderId), { status });
    console.log('Updating order status:', orderId, status);
    return Promise.resolve();
}

// Authentication Functions
function loginFarmer(email, password) {
    // TODO: Replace with Firebase Auth
    // return signInWithEmailAndPassword(auth, email, password);
    console.log('Logging in:', email);
    return Promise.resolve();
}

function logout() {
    // TODO: Replace with Firebase Auth
    // return signOut(auth);
    console.log('Logging out');
    return Promise.resolve();
}

// Image Management
function uploadImage(file, path) {
    // TODO: Replace with Firebase Storage
    // const storageRef = ref(storage, path);
    // return uploadBytes(storageRef, file);
    console.log('Uploading image to:', path);
    return Promise.resolve({ ref: { fullPath: path } });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Farmer Management System initialized - Ready for Firebase integration');
    
    // TODO: Add Firebase initialization and data loading
    // initializeApp();
});