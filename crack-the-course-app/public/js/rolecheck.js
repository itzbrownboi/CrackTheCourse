;(async function() {
  const userEmail = localStorage.getItem("userEmail");

  if (userEmail) {
    fetch(`/api/profile?email=${userEmail}`)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          console.error(data.error);
          return;
        }

        window.currentUserEmail = userEmail;
        window.currentUserRole  = data.role;
        const fullName = `${data.firstName} ${data.lastName}`;
        const currentPage = window.location.pathname;

        // tutors page
        if (currentPage.includes("mytutors.html") && window.loadConnections) {
          const profileName = document.getElementById("profile-name");
          const subtitle = document.querySelector(".user-welcome p");
          if (profileName) profileName.textContent = `Hello, ${data.firstName}`;
          if (subtitle) {
            subtitle.textContent = data.role === "tutor"
              ? "These are your current students."
              : "These are your current tutors.";
          }      
          loadConnections(data.role);
        }

        // profile page
        if (currentPage.includes("profile.html")) {
          const profileName = document.getElementById("profile-name");
          const profileNameMobile = document.getElementById("profile-name-mobile");
          if (profileName) profileName.textContent = fullName;
          if (profileNameMobile) profileNameMobile.textContent = fullName;
        }

        const genericProfileName = document.getElementById("profile-name");
        if (genericProfileName && !currentPage.includes("profile.html")) {
          genericProfileName.textContent = `Hello, ${data.firstName}`;
        }

        // remove homepage for tutor
        if (data.role === "tutor") {
          const navHome = document.getElementById("nav-home");
          const mobileNavHome = document.getElementById("mobile-nav-home");
          const studentLinkText = document.querySelector(".left-part .student .logo-text");

          if (navHome) navHome.style.display = "none";
          if (mobileNavHome) mobileNavHome.style.display = "none";

          if (studentLinkText) {
            studentLinkText.textContent = data.role === "tutor"
              ? "My Students"
              : "My Tutors";
          }
          const mobileTutorNav = document.querySelector("a[href='mytutors.html'] span");
          if (mobileTutorNav) {
            mobileTutorNav.textContent = "My Students";
          }
        }
      })
      .catch(error => {
        console.error("Error fetching profile data:", error);
      });
  } else {
    console.error("User email not found in localStorage.");
  }
})();
