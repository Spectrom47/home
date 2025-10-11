import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase, ref, onChildAdded } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyChe0_K6bjkP_RkakgSf06o0BLGofX4stQ",
  authDomain: "spectrom-9b7ce.firebaseapp.com",
  projectId: "spectrom-9b7ce",
  storageBucket: "spectrom-9b7ce.appspot.com",
  messagingSenderId: "1022687085021",
  appId: "1:1022687085021:web:bf2caba43d913c23963634",
  measurementId: "G-DKSVJKXT00"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase();
const chatRef = ref(db, "chat");

// Chat bubble
const chatBox = document.getElementById("chatBox");

function createReadOnlyChatBox() {
  const box = document.createElement("div");
  box.style.position = "fixed";
  box.style.bottom = "20px";
  box.style.right = "20px";
  box.style.width = "300px";
  box.style.maxHeight = "400px";
  box.style.display = "flex";
  box.style.flexDirection = "column";
  box.style.background = "rgba(0,0,0,0.75)";
  box.style.borderRadius = "12px";
  box.style.overflow = "hidden";
  box.style.fontFamily = "Arial";
  box.style.zIndex = 9999;

  const messages = document.createElement("div");
  messages.id = "chatMessages";
  messages.style.flex = "1";
  messages.style.padding = "10px";
  messages.style.overflowY = "auto";
  messages.style.color = "#fff";
  messages.style.fontSize = "13px";

  box.appendChild(messages);
  document.body.appendChild(box);

  // Listen to chat messages in real-time
  onChildAdded(chatRef, snapshot => {
    const msg = snapshot.val();
    const div = document.createElement("div");
    div.style.marginBottom = "6px";
    div.innerHTML = `<strong>${msg.username}</strong>: ${msg.text}`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  });
}

chatBox.addEventListener("click", () => {
  chatBox.style.display = "none";
  createReadOnlyChatBox();
});
