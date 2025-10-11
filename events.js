// Firebase App (already imported)
import { initializeApp } from "firebase/app";
// Firestore functions
import { getFirestore, collection, addDoc, getDocs, doc, setDoc, deleteDoc, onSnapshot, query, where, orderBy } from "firebase/firestore";

// Your Firebase config
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
// Analytics (optional)
import { getAnalytics } from "firebase/analytics";
const analytics = getAnalytics(app);

// Initialize Firestore
const db = getFirestore(app);

// Reference your events collection
const eventsCol = collection(db, "events");

// Example: Add a new event
async function addEvent(eventData) {
  try {
    const docRef = await addDoc(eventsCol, eventData);
    console.log("Event added with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding event: ", e);
  }
}

// Example: Get all events
async function loadEvents() {
  const snapshot = await getDocs(eventsCol);
  const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  console.log(events);
  return events;
}

// Example: Delete an event
async function deleteEvent(id) {
  await deleteDoc(doc(db, "events", id));
}
