import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js";

// --- Firebase config ---
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
const chatRef = ref(db, "globalChat");

// --- Chat state ---
let username = null;
let inactiveTimer = null;
const LOGOUT_TIME = 600000; // 10 minutes

// --- Chat bubble ---
const chatBox = document.getElementById("chatBox");

// --- Inactivity functions ---
function startInactivityTimer() {
  if (inactiveTimer) clearTimeout(inactiveTimer);
  inactiveTimer = setTimeout(() => {
    alert("Logged out due to inactivity.");
    location.reload();
  }, LOGOUT_TIME);
}
function resetInactivityTimer() { startInactivityTimer(); }

// --- Initialize user ---
function initUser() {
  do {
    username = prompt("Enter a username (3-12 chars):", "Guest" + Math.floor(Math.random()*1000));
    if (!username || username.length < 3 || username.length > 12) alert("Username must be 3-12 characters.");
  } while (!username || username.length < 3 || username.length > 12);

  let isOldEnough = false;
  do {
    isOldEnough = confirm("Are you 13 years or older?");
    if (!isOldEnough) alert("You must be 13+ to chat.");
  } while (!isOldEnough);

  startInactivityTimer();
}

// --- Create expanded chat box ---
function createChatBox() {
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

  const inputDiv = document.createElement("div");
  inputDiv.style.display = "flex";
  inputDiv.style.borderTop = "1px solid rgba(255,255,255,0.2)";

  const input = document.createElement("input");
  input.id = "chatInput";
  input.type = "text";
  input.placeholder = "Type a message...";
  input.style.flex = "1";
  input.style.padding = "8px";
  input.style.border = "none";
  input.style.outline = "none";

  const button = document.createElement("button");
  button.id = "chatSend";
  button.textContent = "Send";
  button.style.padding = "8px";
  button.style.background = "#60a5fa";
  button.style.border = "none";
  button.style.color = "#fff";
  button.style.cursor = "pointer";

  inputDiv.appendChild(input);
  inputDiv.appendChild(button);
  box.appendChild(messages);
  box.appendChild(inputDiv);
  document.body.appendChild(box);

  // --- Send message ---
  button.addEventListener("click", () => {
    const text = input.value.trim();
    if (!text) return;
    push(chatRef, { username, text, timestamp: serverTimestamp() });
    input.value = "";
    resetInactivityTimer();
  });

  input.addEventListener("keydown", e => {
    if (e.key === "Enter") button.click();
    resetInactivityTimer();
  });

  // --- Listen for new messages ---
  onChildAdded(chatRef, snapshot => {
    const msg = snapshot.val();
    const div = document.createElement("div");
    div.style.marginBottom = "6px";
    div.innerHTML = `<strong>${msg.username}</strong>: ${msg.text}`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  });
}

// --- Chat bubble click ---
chatBox.addEventListener("click", () => {
  if (!username) initUser();
  chatBox.style.display = "none"; // hide minimal bubble
  createChatBox();
});
