// Add this at the top of buyer-profile.js
import { doc, getDoc, updateDoc, collection, query, where, getDocs, orderBy, limit } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { auth, db } from './firebase-config.js';
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

let originalData = {};

// Load profile data
async function loadProfileData() {
    const user = auth.currentUser;
    if (!user) {
        window.location.href = 'buyer-login.html';
        return;
    }

    try {
        // Load user data from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        
        if (userDoc.exists()) {
            const userData = userDoc.data();
            originalData = { ...userData };
            
            // Populate form fields
            document.getElementById('fullName').value = userData.fullName || '';
            document.getElementById('phone').value = userData.phone || '';
            document.getElementById('email').value = userData.email || '';
            document.getElementById('nic').value = userData.nic || '';
            
            await loadProfileStats(user.uid, userData.createdAt);
        }
    } catch (error) {
        console.error("Error loading profile:", error);
        alert('Error loading profile data');
    }
}

// Load profile statistics
async function loadProfileStats(userId, createdAt) {
    try {
        // Load order count (you'll need to implement this query)
        document.getElementById('totalOrdersCount').textContent = '0'; // Placeholder
        
        // Member since
        if (createdAt) {
            const memberDate = new Date(createdAt?.toDate()).toLocaleDateString();
            document.getElementById('memberSince').textContent = memberDate;
        }
        
        // Last order date (you'll need to implement this query)
        document.getElementById('lastOrderDate').textContent = '-'; // Placeholder
        
    } catch (error) {
        console.error("Error loading profile stats:", error);
    }
}

// Update profile
document.getElementById('profileForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const user = auth.currentUser;
    if (!user) return;

    const formData = {
        fullName: document.getElementById('fullName').value,
        phone: document.getElementById('phone').value,
        nic: document.getElementById('nic').value
    };

    try {
        await updateDoc(doc(db, "users", user.uid), formData);
        originalData = { ...originalData, ...formData };
        alert('Profile updated successfully!');
    } catch (error) {
        console.error("Error updating profile:", error);
        alert('Error updating profile: ' + error.message);
    }
});

// Change password
document.getElementById('passwordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const user = auth.currentUser;
    if (!user) return;

    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;

    if (newPassword !== confirmNewPassword) {
        alert("New passwords don't match!");
        return;
    }

    if (newPassword.length < 6) {
        alert("Password must be at least 6 characters long!");
        return;
    }

    try {
        // Re-authenticate user
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        
        // Update password
        await updatePassword(user, newPassword);
        
        alert('Password changed successfully!');
        document.getElementById('passwordForm').reset();
    } catch (error) {
        console.error("Error changing password:", error);
        alert('Error changing password: ' + error.message);
    }
});

// Reset form to original values
function resetForm() {
    document.getElementById('fullName').value = originalData.fullName || '';
    document.getElementById('phone').value = originalData.phone || '';
    document.getElementById('nic').value = originalData.nic || '';
}

// Make resetForm global
window.resetForm = resetForm;

// Initialize profile when page loads
document.addEventListener('DOMContentLoaded', loadProfileData);