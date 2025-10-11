// Firebase App
import { initializeApp } from "firebase/app";
// Firestore functions
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, onSnapshot } from "firebase/firestore";
// Cloud Functions
import { getFunctions, httpsCallable } from "firebase/functions";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyChe0_K6bjkP_RkakgSf06o0BLGofX4stQ",
  authDomain: "spectrom-9b7ce.firebaseapp.com",
  projectId: "spectrom-9b7ce",
  storageBucket: "spectrom-9b7ce.appspot.com",
  messagingSenderId: "1022687085021",
  appId: "1:1022687085021:web:bf2caba43d913c23963634",
  measurementId: "G-DKSVJKXT00"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore
const db = getFirestore(app);

// Cloud Functions
const functions = getFunctions(app); // Initialize Cloud Functions SDK

// Reference collections
const eventsCol = collection(db, "events");
const requestsCol = collection(db, "requests");

// --- Events ---
export async function addEvent(eventData) {
  try {
    const docRef = await addDoc(eventsCol, eventData);
    console.log("Event added with ID:", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding event:", e);
  }
}

export async function loadEvents() {
  const snapshot = await getDocs(eventsCol);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function deleteEvent(id) {
  await deleteDoc(doc(db, "events", id));
}

export function onEventsChange(callback) {
  return onSnapshot(eventsCol, callback);
}

// --- Requests ---
export async function addRequest(requestData) {
  try {
    const docRef = await addDoc(requestsCol, requestData);
    console.log("Request submitted with ID:", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error submitting request:", e);
  }
}

export async function loadRequests() {
  const snapshot = await getDocs(requestsCol);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// ** Admin resolves a request → delete it from Firestore **
export async function resolveRequest(id) {
  try {
    await deleteDoc(doc(db, "requests", id));
    console.log("Request resolved & deleted:", id);
  } catch (e) {
    console.error("Error resolving request:", e);
  }
}

// NEW: Function to call the server-side Cloud Function for collection deletion
export async function deleteRequestsCollection() {
  try {
    // Get a reference to the callable function defined on the server
    const deleteCollection = httpsCallable(functions, 'deleteCollection');

    // Call the function, passing the collection name
    const result = await deleteCollection({ collectionPath: 'requests' });
    console.log("Server response for collection deletion:", result.data);
    alert('Requests collection deletion triggered successfully!');
  } catch (e) {
    console.error("Error calling server-side deleteCollection function:", e);
    alert('Failed to trigger collection deletion. Check console for details.');
  }
}

// This function listens for any changes in the "requests" collection
export function onRequestsChange(callback) { // Added export for consistency
  return onSnapshot(requestsCol, callback);
}

onRequestsChange((snapshot) => {
  const requestsContainer = document.getElementById("requests-container");
  if (!requestsContainer) return; // defensive check

  requestsContainer.innerHTML = ""; // clear the list

  if (snapshot.empty) {
    requestsContainer.innerHTML = "<p>No current requests.</p>";
    return;
  }

  snapshot.forEach((doc) => {
    const request = doc.data();
    const id = doc.id;

    const div = document.createElement("div");
    div.id = id; // set id so we can remove it later
    div.innerHTML = `
      <p>${request.message} (from: ${request.email || 'N/A'})</p>
      <button onclick="resolveRequest('${id}')">Resolve</button>
    `;
    requestsContainer.appendChild(div);
  });
});

// Example of how you might add a button to trigger the collection deletion
// (You'd add this to your HTML or directly via JavaScript if dynamically creating UI)
/*
// Assuming you have an HTML button like: <button id="clearAllRequestsBtn">Clear All Requests</button>
document.addEventListener('DOMContentLoaded', () => {
  const clearButton = document.getElementById('clearAllRequestsBtn');
  if (clearButton) {
    clearButton.addEventListener('click', async () => {
      if (confirm('Are you sure you want to delete ALL requests? This cannot be undone.')) {
        await deleteRequestsCollection();
      }
    });
  }
});
*/
