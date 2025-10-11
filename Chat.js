// Simple username generator (GuestXXX)
const username = "Guest" + Math.floor(Math.random()*1000);

// DOM refs
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');

// Send a message
async function sendMessage() {
  const msg = chatInput.value.trim();
  if(!msg) return;
  
  await addDoc(chatCol, {
    username,
    message: msg,
    timestamp: serverTimestamp() // Firebase auto-timestamp
  });
  
  chatInput.value = '';
}

// Listen for new messages
const q = query(chatCol, orderBy('timestamp'));
onSnapshot(q, (snapshot) => {
  chatMessages.innerHTML = ''; // clear
  snapshot.docs.forEach(doc => {
    const data = doc.data();
    const div = document.createElement('div');
    const time = data.timestamp?.toDate().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) || '';
    div.innerHTML = `<strong>${data.username}</strong> [${time}]: ${data.message}`;
    chatMessages.appendChild(div);
  });
  chatMessages.scrollTop = chatMessages.scrollHeight; // auto scroll
});

// Event listeners
chatSend.addEventListener('click', sendMessage);
chatInput.addEventListener('keydown', e => { if(e.key==='Enter') sendMessage(); });
