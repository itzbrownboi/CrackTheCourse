const userEmail = localStorage.getItem("userEmail");

// Fetch profile data based on email
if (userEmail) {
  fetch(`/api/profile?email=${userEmail}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        console.error(data.error);
        return;
      }

      // Update the profile information based on the returned data
      const profileName = document.getElementById("profile-name");
      //   const profilePhoto = document.getElementById("profile-info");
      if (data.role === "student") {
        profileName.textContent = `Hello, ${data.firstName}`;
      }
    })
    .catch((error) => {
      console.error("Error fetching profile data:", error);
    });
} else {
  console.error("User email not found in localStorage.");
}


// Function to fetch tutors from the backend based on the course
// Function to fetch tutors from the backend based on the course

// Function to fetch tutors from the backend based on the course or search term
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
    return `
      <div class="tutor-card">
        <img src="${tutor.avatar || 'https://placehold.co/60x60'}" alt="${tutor.name}" class="tutor-avatar">
        <div class="tutor-info">
          <div class="tutor-name">${tutor.firstName} ${tutor.lastName}</div>
          <div class="tutor-rate">${tutor.rate || "$20/hr"}</div>
          <div class="tutor-school">School: ${tutor.school}</div>
            <div class="tutor-education">Education: ${tutor.educationLevel}</div>
            <div class="tutor-courses">${tutor.profile.teachCourses.join(', ')}</div>
          <div class="tutor-rating">
            <span>★</span>
            <span>${tutor.rating || "4.5"}</span>
          </div>
        </div>
        <div class="tutor-actions">
          <button class="action-btn">Message</button>
        </div>
      </div>
    `;
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

mobileMenu.addEventListener("click", () => {
  leftPart.style.display = leftPart.style.display === "none" ? "flex" : "none";
});

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  // Set initial state for mobile menu
  if (window.innerWidth <= 768) {
    leftPart.style.display = "none";
  }
});

// Handle mobile navigation active state
const mobileNavItems = document.querySelectorAll(".mobile-nav-item");
mobileNavItems.forEach((item) => {
  if (window.location.pathname.includes(item.getAttribute("href"))) {
    item.classList.add("active");
  }
});
