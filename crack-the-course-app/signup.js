// Wait until all HTML content is loaded before running this script
document.addEventListener("DOMContentLoaded", () => {
  
    // Get references to form elements
    const roleSelect = document.getElementById("role");                 // Dropdown to select role
    const studentFields = document.getElementById("student-fields");   // Div for student-specific fields
    const tutorFields = document.getElementById("tutor-fields");       // Div for tutor-specific fields
    const adminFields = document.getElementById("admin-fields");       // Div for admin-only field
    const signupButton = document.querySelector(".signup-button");     // Sign-up button
  
    // Read role from the URL (e.g., signup.html?role=tutor)
    const urlParams = new URLSearchParams(window.location.search);
    const initialRole = urlParams.get("role");
  
  
    // Handle "Sign Up" button click
    signupButton.addEventListener("click", async () => {
  
      // Split the full name into first and last name
      const name = document.getElementById("name").value.split(" ");
      const firstName = name[0] || "";
      const lastName = name[1] || "";
  
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const role = roleSelect.value;
  
      // Initialize a profile object
      let profile = {
        strongCourses: [],
        weakCourses: []
      };
  
      // Collect student course selections
      if (role === "student") {
        profile.weakCourses = Array.from(document.getElementById("weak-courses").selectedOptions).map(opt => opt.value);
        profile.strongCourses = Array.from(document.getElementById("strong-courses").selectedOptions).map(opt => opt.value);
      }
  
      // Collect tutor course selections
      if (role === "tutor") {
        profile.strongCourses = Array.from(document.getElementById("tutor-courses").selectedOptions).map(opt => opt.value);
      }
  
      // Check admin access code
      if (role === "admin") {
        const code = document.getElementById("admin-code").value;
        if (code !== "CrackAdmin2025") {
          alert("Invalid admin code.");
          return;
        }
      }
  
      // Create the object to send to the server
      const payload = {
        firstName,
        lastName,
        email,
        password,
        role,
        school: "University of Calgary", // Hardcoded for now
    // Not included when signing up
        educationLevel: "Unknown",       // Could be added as a dropdown later
        profile
      };
  
      // Send the signup data to the server
      try {
        const response = await fetch("/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
  
        const result = await response.json();
  
        if (response.ok) {
          alert("Signup successful!");
          window.location.href = "login.html"; // Redirect after signup
        } else {
          alert(result.message || "Signup failed.");
        }
  
      } catch (err) {
        console.error(err);
        alert("Error during signup.");
      }
    });
  });
  