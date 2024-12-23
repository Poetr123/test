// ID Gist dan token GitHub
const gistId = '8d0bfc1f8b525d24c32ebd6d5962887b';  // Gist ID kamu
const token = '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'; // Ganti dengan token GitHub kamu

// URL Gist yang berisi data chat
const gistUrl = `https://api.github.com/gists/${gistID}`;

// Fungsi untuk mengambil data chat dari Gist
function fetchMessages() {
    fetch(gistUrl)
        .then(response => response.json())
        .then(data => {
            const messages = JSON.parse(data.files['chatMessages.json'].content);
            displayMessages(messages);
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
}

// Fungsi untuk menampilkan pesan-pesan yang ada
function displayMessages(messages) {
    const chatContainer = document.getElementById("chat-container");
    chatContainer.innerHTML = ''; // Kosongkan isi chat sebelum menampilkan yang baru

    messages.forEach(message => {
        const messageDiv = document.createElement("div");
        messageDiv.className = "message";
        messageDiv.innerHTML = `<strong>${message.username}</strong>: ${message.text}`;
        chatContainer.appendChild(messageDiv);
    });
}

// Fungsi untuk mengirim pesan baru
function sendMessage() {
    const username = document.getElementById("username").value;
    const message = document.getElementById("message").value;

    if (!username || !message) {
        alert("Harap masukkan username dan pesan.");
        return;
    }

    const newMessage = { username, text: message };

    // Ambil data chat yang ada saat ini
    fetch(gistUrl, {
        headers: {
            'Authorization': `token ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        // Ambil konten file Gist dan tambahkan pesan baru
        const currentMessages = JSON.parse(data.files['chatMessages.json'].content);
        currentMessages.push(newMessage);

        // Kirim ulang data yang sudah diperbarui ke Gist
        fetch(gistUrl, {
            method: 'PATCH',
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                files: {
                    'chatMessages.json': {
                        content: JSON.stringify(currentMessages, null, 2)
                    }
                }
            })
        })
        .then(() => {
            // Setelah pesan terkirim, tampilkan pesan terbaru
            displayMessages(currentMessages);
            document.getElementById("username").value = '';
            document.getElementById("message").value = '';
        })
        .catch(error => {
            console.error("Error sending message:", error);
        });
    })
    .catch(error => {
        console.error("Error fetching Gist:", error);
    });
}

// Muat pesan ketika halaman dimuat
fetchMessages();
