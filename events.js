// Firebase App
import { initializeApp } from "firebase/app";
// Firestore functions
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, onSnapshot } from "firebase/firestore";

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

export function onRequestsChange(callback) {
  return onSnapshot(requestsCol, callback);
}
