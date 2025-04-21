
window.loadConnections = async function(role) {
    const userEmail   = window.currentUserEmail;
    const currentPage = window.location.pathname;
  
    if (!currentPage.includes("mytutors.html")) return;
  
    const isTutor = role === "tutor";
    const apiPath = isTutor
      ? "/api/get-students-for-chat"
      : "/api/get-tutors-for-chat";
    const body = isTutor
      ? { tutorEmail: userEmail }
      : { studentEmail: userEmail };
  
    console.log("Calling:", apiPath, "with", body);
  
    let data;
    try {
      const res  = await fetch(apiPath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      data = await res.json();
      console.log("←", apiPath, "returned", data);
    } catch (err) {
      console.error("Error loading connections:", err);
      return;
    }
  
    const list = (isTutor ? data.students : data.tutors || [])
      .filter(item => item.status === "request_accepted");
  
    const currentTitle = document.getElementById("list-title");
        if (currentTitle) currentTitle.textContent = isTutor
        ? "My Students"
        : "My Tutors";
  
    const container = document.getElementById("user-display");
    if (!container) return;
  
    if (list.length === 0) {
      container.innerHTML = `<p style="color:#888">
        No ${titleElem.textContent.toLowerCase()} yet.
      </p>`;
      return;
    }
  
    container.innerHTML = list.map(item => {
      const subText = isTutor
        ? (item.school || "")
        : (Array.isArray(item.courses) ? item.courses.join(", ") : "");
  
      return `
        <div class="chat-student ${isTutor ? "tutor-card" : ""}">
          <div class="student-desc" style="display:flex;justify-content:space-between;align-items:center">
            <p style="color:grey;font-size:small">${item.name}</p>
            <img class="profile-pic" src="images/profile.png" alt="${item.name}">
          </div>
          <p class="user-course">${subText}</p>
        </div>
      `;
    }).join("");
  };
  