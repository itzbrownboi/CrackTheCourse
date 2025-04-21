const userEmail2 = localStorage.getItem("userEmail");

// Function to fetch tutors from the backend
async function fetchTutors(course = "all", searchTerm = "") {
  try {
    const response = await fetch(`/api/search/tutors?course=${course}`);
    const data = await response.json();

    if (response.ok) {
      // Filter tutors based on the search term
      const filteredTutors = data.tutors.filter((tutor) =>
        tutor.profile.teachCourses.some((course) =>
          course.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );

      // Populate the tutors grid with filtered results
      populateTutorsGrid(filteredTutors);
    } else {
      console.error("Error fetching tutors:", data.error);
    }
  } catch (err) {
    console.error("Error fetching tutors:", err);
  }
}

// Function to populate the tutors grid
function populateTutorsGrid(tutors) {
  const tutorsGrid = document.querySelector(".tutors-grid");
  tutorsGrid.innerHTML = ""; // Clear the existing tutors grid

  if (tutors.length === 0) {
    tutorsGrid.innerHTML = "<p>No tutors found.</p>";
    return;
  }

  tutors.forEach((tutor) => {
    const tutorCard = createTutorCard(tutor);
    tutorsGrid.innerHTML += tutorCard; // Add each tutor card to the grid
  });
}

// Function to create a tutor card
function createTutorCard(tutor) {
  const card = document.createElement("div");
  card.classList.add("tutor-card");

  card.innerHTML = `
    <img src="${tutor.avatar || 'https://placehold.co/60x60'}" alt="${tutor.name}" class="tutor-avatar">
    <div class="tutor-info">
      <div class="tutor-name">${tutor.firstName} ${tutor.lastName}</div>
      <div class="tutor-rate">${tutor.rate || "$20/hr"}</div>
      <div class="tutor-school">School: ${tutor.school}</div>
      <div class="tutor-education">Education: ${tutor.educationLevel}</div>
      <div class="tutor-courses">${tutor.profile.teachCourses.join(', ')}</div>
    </div>
    <div class="tutor-actions">
      <button class="action-btn request-btn">Message</button>
    </div>
  `;

  // Now set the email safely
  const btn = card.querySelector(".request-btn");
  btn.setAttribute("data-email", tutor.email);

  return card.outerHTML;
}


// Handle course filter button clicks
const filterButtons = document.querySelectorAll(".filter-btn");
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Remove active class from all buttons and add to clicked button
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    // Get the selected course from the button data attribute
    const course = button.getAttribute("data-course");

    // Get the current search term
    const searchTerm = document.querySelector(".search-input").value;

    // Fetch and display tutors based on the selected course and search term
    fetchTutors(course, searchTerm);
  });
});

// Handle search input (filter tutors based on the search term)
const searchInput = document.querySelector(".search-input");
searchInput.addEventListener("input", (event) => {
  const searchTerm = event.target.value.toLowerCase();

  // Get the currently active course filter
  const activeButton = document.querySelector(".filter-btn.active");
  const activeCourse = activeButton ? activeButton.getAttribute("data-course") : "all";

  // Fetch and display tutors based on the search term and the active course
  fetchTutors(activeCourse, searchTerm);
});

// Initial fetch: Load all tutors when the page loads
fetchTutors("all");

// Handle mobile menu toggle
const mobileMenu = document.querySelector(".mobile-menu");
const leftPart = document.querySelector(".left-part");

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("requestModal");
  const closeBtn = modal.querySelector(".close-btn");
  const tutorName = document.getElementById("tutorName");
  const requestMessage = document.getElementById("requestMessage");
  let currentTutorEmail = "";

  // Open modal when message button is clicked
  document.body.addEventListener("click", async (e) => {
    // Ensure that the clicked element is a button with the class "request-btn"
    const button = e.target.closest(".request-btn");
  
    if (button) {
      const email = button.dataset.email;  // Fetch the email from the closest button's data attribute
      console.log("this is the email:", email)
      if (!email) {
        console.error("Tutor email not found.");
        return;
      }
  
      try {
        // Fetch tutor info by email
        const res = await fetch(`/api/profile?email=${email}`);
        const data = await res.json();
  
        if (!res.ok) throw new Error(data.error || "Tutor not found");
  
        const name = `${data.firstName} ${data.lastName}`;
        tutorName.textContent = `To: ${name}`;
        currentTutorEmail = email;  // Store the tutor's email
        requestMessage.value = "";  // Clear the message input
        modal.classList.remove("hidden");  // Show the modal
      } catch (err) {
        console.error("Error loading tutor info:", err);
        alert("Failed to load tutor details.");
      }
    }
  });
  

  // Close modal
  closeBtn.onclick = () => modal.classList.add("hidden");

  // Send request
  document.getElementById("sendRequestBtn").onclick = async () => {
    const message = requestMessage.value.trim();
    if (!message) return alert("Please enter a message.");

    try {
      const res = await fetch("/api/sendRequest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tutorEmail: currentTutorEmail, studentEmail: userEmail2, message })
      });

      const data = await res.json();
      if (res.ok) {
        alert("Request sent!");
        modal.classList.add("hidden");  // Close the modal
      } else {
        alert(data.error || "Failed to send request.");
      }
    } catch (err) {
      alert("Something went wrong.");
      console.error(err);
    }
  };
});
