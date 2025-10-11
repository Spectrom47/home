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

// --- Initialize Firebase ---
const app = initializeApp(firebaseConfig);
const db = getDatabase();
const chatRef = ref(db, "globalChat");

// --- Chat state ---
let username = null;
let inactiveTimer = null;
const LOGOUT_TIME = 600_000; // 10 minutes
const chatBox = document.getElementById("chatBox");

// --- Inactivity handler ---
function resetInactivity() {
  if (inactiveTimer) clearTimeout(inactiveTimer);
  inactiveTimer = setTimeout(() => {
    alert("Logged out due to inactivity.");
    location.reload();
  }, LOGOUT_TIME);
}

// --- Prompt user for username and age ---
function initUser() {
  do {
    username = prompt("Enter a username (3-12 chars):", "Guest" + Math.floor(Math.random()*1000));
  } while (!username || username.length < 3 || username.length > 12);

  let isOldEnough = false;
  do {
    isOldEnough = confirm("Are you 13 years or older?");
    if (!isOldEnough) alert("You must be 13+ to chat.");
  } while (!isOldEnough);

  resetInactivity();
}

// --- Create the chat UI ---
function createChat() {
  const box = document.createElement("div");
  box.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 300px;
    max-height: 400px;
    display: flex;
    flex-direction: column;
    background: rgba(0,0,0,0.75);
    border-radius: 12px;
    overflow: hidden;
    font-family: Arial;
    z-index: 9999;
  `;

  const messages = document.createElement("div");
  messages.id = "chatMessages";
  messages.style.cssText = `
    flex:1; padding:10px; overflow-y:auto; color:#fff; font-size:13px;
  `;

  const inputDiv = document.createElement("div");
  inputDiv.style.cssText = `display:flex; border-top:1px solid rgba(255,255,255,0.2);`;

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
  button.style.cssText = `padding: 8px; background:#60a5fa; border:none; color:#fff; cursor:pointer;`;

  inputDiv.appendChild(input);
  inputDiv.appendChild(button);
  box.appendChild(messages);
  box.appendChild(inputDiv);
  document.body.appendChild(box);

  // --- Send message function ---
  function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    push(chatRef, { username, text, timestamp: serverTimestamp() });
    input.value = "";
    resetInactivity();
  }

  // --- Event listeners ---
  button.addEventListener("click", sendMessage);
  input.addEventListener("keydown", e => { if(e.key==="Enter") sendMessage(); resetInactivity(); });

  // --- Listen for new messages (live) ---
  onChildAdded(chatRef, snapshot => {
    const msg = snapshot.val();
    const div = document.createElement("div");
    div.style.marginBottom = "6px";
    div.innerHTML = `<strong>${msg.username}</strong>: ${msg.text}`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  });
}

// --- Show chat on bubble click ---
chatBox.addEventListener("click", () => {
  if (!username) initUser();
  chatBox.style.display = "none";
  createChat();
});
