// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";

// Firebase config (replace with your actual config)
const firebaseConfig = {
  apiKey: "AIzaSyAeZ3uYSYDwZZW2b059Ed3xadeFv7ipBn4",
  authDomain: "studentrewardsystem-1584e.firebaseapp.com",
  projectId: "studentrewardsystem-1584e",
  storageBucket: "studentrewardsystem-1584e.appspot.com",
  messagingSenderId: "538904572355",
  appId: "1:538904572355:web:aa7f682cac53d769ffcd76"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Fetch and display user data
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      document.getElementById("name").textContent = docSnap.data().name || user.displayName;
      document.getElementById("tokens").textContent = docSnap.data().tokens;
    }
  } else {
    window.location.href = "index.html";
  }
});

// Redeem reward
async function redeemReward(cost) {
  const user = auth.currentUser;
  const docRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    let currentTokens = docSnap.data().tokens;
    if (currentTokens >= cost) {
      await updateDoc(docRef, {
        tokens: currentTokens - cost
      });
      alert(`Reward redeemed! You spent ${cost} tokens.`);
      document.getElementById("tokens").textContent = currentTokens - cost;
    } else {
      alert("Not enough tokens!");
    }
  }
}

// Logout
function logout() {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
}

// Expose functions globally for HTML
window.redeemReward = redeemReward;
window.logout = logout;
