// Simple Firebase Functions for GoviConnect

// Login function
async function loginFarmer(email, password) {
    try {
        const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
        return { success: true, user: userCredential.user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Logout function
async function logoutFarmer() {
    try {
        await firebase.auth().signOut();
        window.location.href = 'farmer-login.html';
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// Register new farmer
async function registerFarmer(email, password, farmerData) {
    try {
        // Create user account
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Save farmer data to database
        await firebase.firestore().collection('farmers').doc(user.uid).set({
            ...farmerData,
            email: email,
            createdAt: new Date(),
            status: 'pending',
            role: 'farmer'
        });

        return { success: true, user: user };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Check if user is logged in
function checkAuth() {
    return new Promise((resolve) => {
        firebase.auth().onAuthStateChanged((user) => {
            resolve(user);
        });
    });
}

// Get farmer profile data
async function getFarmerProfile(uid) {
    try {
        const doc = await firebase.firestore().collection('farmers').doc(uid).get();
        if (doc.exists) {
            return doc.data();
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error getting farmer profile:', error);
        return null;
    }
}

// Update farmer profile
async function updateFarmerProfile(uid, data) {
    try {
        await firebase.firestore().collection('farmers').doc(uid).update({
            ...data,
            updatedAt: new Date()
        });
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Add new product
async function addProduct(productData) {
    try {
        const user = firebase.auth().currentUser;
        if (!user) return { success: false, error: 'Not logged in' };
        
        const productRef = await firebase.firestore().collection('products').add({
            ...productData,
            farmerId: user.uid,
            status: 'pending',
            createdAt: new Date()
        });
        return { success: true, id: productRef.id };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Get farmer's products
async function getFarmerProducts() {
    try {
        const user = firebase.auth().currentUser;
        if (!user) return [];
        
        const snapshot = await firebase.firestore().collection('products')
            .where('farmerId', '==', user.uid)
            .get();
            
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error('Error getting products:', error);
        return [];
    }
}

console.log('Firebase auth functions loaded!');