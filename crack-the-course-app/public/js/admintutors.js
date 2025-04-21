// const userEmail = localStorage.getItem("userEmail");

// // Fetch profile data based on email
// if (userEmail) {
//   fetch(`/api/profile?email=${userEmail}`)
//     .then((response) => response.json())
//     .then((data) => {
//       if (data.error) {
//         console.error(data.error);
//         return;
//       }

//       // Update the profile information based on the returned data
//       const profileName = document.getElementById("profile-name");
//       if (data.role === "student") {
//         profileName.textContent = `Hello, ${data.firstName}`;
//       } else if (data.role === "tutor") {
//         profileName.textContent = `Hello, ${data.firstName}`;

//         const navHome = document.getElementById("nav-home");
//         const mobileNavHome = document.getElementById("mobile-nav-home");

//         if (navHome) navHome.style.display = "none";
//         if (mobileNavHome) mobileNavHome.style.display = "none";
//       }

//     })
//     .catch((error) => {
//       console.error("Error fetching profile data:", error);
//     });
// } else {
//   console.error("User email not found in localStorage.");
// }

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
    <img src="${tutor.avatar || "https://placehold.co/60x60"}" alt="${
    tutor.name
  }" class="tutor-avatar">
    <div class="tutor-info">
      <div class="tutor-name">${tutor.firstName} ${tutor.lastName}</div>
      <div class="tutor-rate">${tutor.rate || "$20/hr"}</div>
    </div>
    <div class="tutor-actions">
      <button class="action-btn request-btn">Review</button>
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
  const activeCourse = activeButton
    ? activeButton.getAttribute("data-course")
    : "all";

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

  // Global variable to store the tutor's data
  let selectedTutor = {
    firstName: "",
    lastName: "",
    email: "",
  };

  // Open modal when message button is clicked
  document.body.addEventListener("click", async (e) => {
    const button = e.target.closest(".request-btn");

    if (button) {
      const email = button.dataset.email;
      console.log("this is the email:", email);
      if (!email) {
        console.error("Tutor email not found.");
        return;
      }

      try {
        const res = await fetch(`/api/profile?email=${email}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Tutor not found");

        // Populate review section
        document.getElementById(
          "reviewName"
        ).textContent = `${data.firstName} ${data.lastName}`;
        document.getElementById("reviewSchool").textContent =
          data.school || "N/A";
        document.getElementById("reviewEducation").textContent =
          data.educationLevel || "N/A";
        document.getElementById("reviewCourses").textContent =
          data.profile?.teachCourses?.join(", ") || "None";

        // Store for delete use
        selectedTutor = {
          email,
          firstName: data.firstName,
          lastName: data.lastName,
        };

        modal.classList.remove("hidden"); // Show the modal
      } catch (err) {
        console.error("Error loading tutor info:", err);
        alert("Failed to load tutor details.");
      }
    }
  });

  // Close modal
  closeBtn.onclick = () => modal.classList.add("hidden");

  // Delete tutor
  document.getElementById("deleteTutorBtn").onclick = async () => {
    const { firstName, lastName, email } = selectedTutor;
  
    if (!firstName || !lastName || !email) {
      return alert("Tutor info missing. Cannot delete.");
    }
  
    if (!confirm(`Are you sure you want to delete tutor: ${firstName} ${lastName}?`)) {
      return;
    }
  
    try {
      const res = await fetch("/api/delete-tutor", { 
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email })
      });
  
      const data = await res.json();
      if (res.ok) {
        alert("Tutor deleted successfully.");
        modal.classList.add("hidden");
        // Optionally remove the tutor from UI here
      } else {
        alert(data.error || "Failed to delete tutor.");
      }
    } catch (err) {
      alert("Something went wrong.");
      console.error(err);
    }
  };
  
});
