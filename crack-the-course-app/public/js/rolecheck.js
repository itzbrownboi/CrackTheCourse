const userEmail = localStorage.getItem("userEmail");

if (userEmail) {
  fetch(`/api/profile?email=${userEmail}`)
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        console.error(data.error);
        return;
      }

      const fullName = `${data.firstName} ${data.lastName}`;
      const currentPage = window.location.pathname;

      // tutors page
      if (currentPage.includes("mytutors.html")) {
        const profileName = document.getElementById("profile-name");
        if (profileName) profileName.textContent = `Hello, ${data.firstName}`;
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
        hideNavSection("home");
      }else if(data.role === "admin"){
        const idSuffixes = ["home", "chat"];
        idSuffixes.forEach(hideNavSection);
        document.getElementById("nav-mytutors-link").textContent = "Manage Tutors";
        document.getElementById('nav-mytutors-link').href = 'admintutors.html';
        document.getElementById('mobile-nav-mytutors-link').textContent = "Manage Tutors";
        document.getElementById('mobile-nav-mytutors').href = 'admintutors.html';
      }
    })
    .catch(error => {
      console.error("Error fetching profile data:", error);
    });
} else {
  console.error("User email not found in localStorage.");
}


function hideNavSection(idSuffix) {
  const nav = document.getElementById(`nav-${idSuffix}`);
  const mobileNav = document.getElementById(`mobile-nav-${idSuffix}`);
  if (nav) nav.style.display = "none";
  if (mobileNav) mobileNav.style.display = "none";
}