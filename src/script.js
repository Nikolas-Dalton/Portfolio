let darkmode = localStorage.getItem("darkmode");
const themeSwitchBtn = document.getElementById("theme-switch");

const enableDarkMode = () => {
  document.body.classList.add("darkmode");
  localStorage.setItem("darkmode", "active");
  themeSwitchBtn.textContent = "Light Mode";
};

const disableDarkMode = () => {
  document.body.classList.remove("darkmode");
  localStorage.setItem("darkmode", "inactive");
  themeSwitchBtn.textContent = "Dark Mode";
};


if (darkmode === "active") {
  enableDarkMode();
} else {
  disableDarkMode();
}

themeSwitchBtn.addEventListener("click", () => {
  darkmode = localStorage.getItem("darkmode");

  if (darkmode !== "active") {
    enableDarkMode();
  } else {
    disableDarkMode();
  }
});
