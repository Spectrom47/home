import { collection, addDoc, onSnapshot, serverTimestamp, deleteDoc, doc } from "firebase/firestore";

// Firestore refs
const messagesCol = collection(db, "chat_messages");
const usersCol = collection(db, "chat_users");

// Append a new message
async function sendMessage(msg, username) {
  await addDoc(messagesCol, { username, message: msg, timestamp: serverTimestamp() });
}

// Add user
async function addUser(username) {
  const docRef = await addDoc(usersCol, { username, joinedAt: serverTimestamp() });

  // Auto remove after 10 min
  setTimeout(() => {
    deleteDoc(doc(db, "chat_users", docRef.id));
  }, 10*60*1000);
}

// Listen for messages in real-time
onSnapshot(messagesCol, (snapshot) => {
  chatMessages.innerHTML = ''; // clear
  snapshot.docs.sort((a,b)=> a.data().timestamp?.toMillis() - b.data().timestamp?.toMillis())
    .forEach(doc => {
      const data = doc.data();
      const div = document.createElement('div');
      div.textContent = `${data.username}: ${data.message}`;
      chatMessages.appendChild(div);
    });
});

// Listen for users in real-time
onSnapshot(usersCol, (snapshot) => {
  userTableBody.innerHTML = '';
  snapshot.docs.forEach(doc => {
    const data = doc.data();
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${data.username}</td><td>${data.joinedAt?.toDate().toLocaleTimeString()}</td>`;
    userTableBody.appendChild(tr);
  });
});
