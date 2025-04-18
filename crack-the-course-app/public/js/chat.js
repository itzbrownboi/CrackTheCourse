const userEmail = localStorage.getItem("userEmail");
const senderEmail = userEmail;
let receiverEmail = null;

const messagesContainer = document.querySelector(".messages");
const messageInput = document.getElementById("messageInput");

if (userEmail) {
  fetch(`/api/profile?email=${userEmail}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        console.error(data.error);
        return;
      }

      if (data.role === "student") {
        const studentEmail = userEmail;

        function loadTutorsForChat() {
          fetch("/api/get-tutors-for-chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ studentEmail }),
          })
            .then((res) => res.json())
            .then((data) => {
              const tutorList = document.getElementById("tutorList");
              tutorList.innerHTML = "";

              data.tutors.forEach((tutor) => {
                const card = document.createElement("div");
                card.className = "tutor-card";

                const topRow = document.createElement("div");
                topRow.className = "tutor-top-row";

                const name = document.createElement("h3");
                name.textContent = tutor.name;
                name.className = "tutor-name";

                const coursesSection = document.createElement("div");
                coursesSection.textContent = tutor.courses.join(", ");
                coursesSection.className = "tutor-courses";

                topRow.appendChild(name);
                topRow.appendChild(coursesSection);

                const btn = document.createElement("button");
                btn.className = "tutor-chat-btn";

                if (tutor.status === "request_pending") {
                  btn.textContent = "Request Pending";
                  btn.disabled = true;
                  btn.classList.add("btn-disabled");
                } else {
                  btn.textContent = "Chat";
                  btn.classList.add("btn-active");
                  btn.addEventListener("click", () => {
                    receiverEmail = tutor.email;
                    document.getElementById('profileSection').style.display = 'flex';

                    // Set chat header
                    document.getElementById("chattingWith").textContent = tutor.name;
                    document.getElementById("chattingWithCourses").textContent = tutor.courses.join(", ");

                    loadChatHistory();
                  });
                }

                card.appendChild(topRow);
                card.appendChild(btn);
                tutorList.appendChild(card);
              });
            })
            .catch((err) => console.error("Error loading tutors:", err));
        }

        loadTutorsForChat();

      } else if (data.role === "tutor") {
        const tutorEmail = userEmail;

        function loadStudentsForChat() {
          fetch("/api/get-students-for-chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tutorEmail }),
          })
            .then((res) => res.json())
            .then((data) => {
              const tutorList = document.getElementById("tutorList");
              tutorList.innerHTML = "";

              data.students.forEach((student) => {
                const card = document.createElement("div");
                card.className = "tutor-card";

                const topRow = document.createElement("div");
                topRow.className = "tutor-top-row";

                const name = document.createElement("h3");
                name.textContent = student.name;
                name.className = "tutor-name";

                const schoolSection = document.createElement("div");
                schoolSection.textContent = student.school;
                schoolSection.className = "tutor-courses";

                topRow.appendChild(name);
                topRow.appendChild(schoolSection);

                const btn = document.createElement("button");
                btn.className = "tutor-chat-btn";

                if (student.status === "request_pending") {
                  btn.textContent = "Accept Request";
                  btn.classList.add("btn-accept");
                  btn.addEventListener("click", () => {
                    fetch("/api/accept-student-request", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        tutorEmail,
                        studentEmail: student.email,
                      }),
                    })
                      .then((res) => res.json())
                      .then((data) => {
                        console.log("Request accepted:", data);
                        loadStudentsForChat();
                      })
                      .catch((err) => console.error("Accept request failed:", err));
                  });
                } else {
                  btn.textContent = "Chat";
                  btn.classList.add("btn-active");
                  btn.addEventListener("click", () => {
                    document.getElementById('profileSection').style.display = 'flex';

                    receiverEmail = student.email;

                    document.getElementById("chattingWith").textContent = student.name;
                    const currCourses = document.getElementById("chattingWithCourses");
                    currCourses.style.display = "none";

                    loadChatHistory();
                  });
                }

                card.appendChild(topRow);
                card.appendChild(btn);
                tutorList.appendChild(card);
              });
            })
            .catch((err) => console.error("Error loading students:", err));
        }

        loadStudentsForChat();
      }
    })
    .catch((error) => {
      console.error("Error fetching profile data:", error);
    });
} else {
  console.error("User email not found in localStorage.");
}

// Send message on Enter
messageInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    const message = messageInput.value.trim();
    if (!message || !receiverEmail) return;

    fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: senderEmail,
        chat_body: {
          to: receiverEmail,
          message: message,
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        messageInput.value = "";
        // appendSentMessage(message);
      })
      .catch((err) => console.error("Send error:", err));
  }
});

// Load chat history
function loadChatHistory() {
  if (!receiverEmail || !senderEmail) return;

  fetch("/api/chat-get", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: receiverEmail,
      to: senderEmail,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      messagesContainer.innerHTML = "";

      const sent = data.chats_sent || [];
      const received = data.chats_received || [];

      const allMessages = [
        ...sent.map((m) => ({ ...m, type: "sent" })),
        ...received.map((m) => ({ ...m, type: "rec" })),
      ];

      allMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      allMessages.forEach((m) => {
        if (m.type === "sent") {
          appendSentMessage(m.message);
        } else {
          appendReceivedMessage(m.message);
        }
      });
    })
    .catch((err) => {
      console.error("Load error:", err);
      messagesContainer.innerHTML =
        '<p style="text-align: center; color: red;">Error loading chat</p>';
    });
}

function appendSentMessage(message) {
  const div = document.createElement("div");
  div.className = "sent-messages";
  div.innerHTML = `<div class="message-bubble sent">${message}</div>`;
  messagesContainer.appendChild(div);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function appendReceivedMessage(message) {
  const div = document.createElement("div");
  div.className = "rec-messages";
  div.innerHTML = `<div class="message-bubble received">${message}</div>`;
  messagesContainer.appendChild(div);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Auto-refresh chat every 5 seconds
setInterval(() => {
  if (receiverEmail) loadChatHistory();
}, 5000);
