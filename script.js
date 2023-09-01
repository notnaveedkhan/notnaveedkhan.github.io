// Function to fetch and update GitHub data
function fetchAndUpdateGitHubData() {
  // Check if data is already in local storage and if the cooldown period has not passed
  const storedData = localStorage.getItem("githubData");
  const cooldownExpires = localStorage.getItem("cooldownExpires");

  if (storedData && Date.now() < parseInt(cooldownExpires, 10)) {
    // Data is in local storage and cooldown hasn't expired, use it
    const parsedData = JSON.parse(storedData);
    updateGitHubInfo(parsedData);
  } else {
    // Fetch data from the GitHub API
    fetch("https://api.github.com/users/notnaveedkhan")
      .then((response) => response.json())
      .then((data) => {
        // Save the data in local storage
        localStorage.setItem("githubData", JSON.stringify(data));

        // Set the cooldown period (e.g., 1 hour)
        const cooldownDuration = 60 * 60 * 1000; // 1 hour in milliseconds
        const newCooldownExpires = Date.now() + cooldownDuration;
        localStorage.setItem("cooldownExpires", newCooldownExpires);

        // Update the GitHub information
        updateGitHubInfo(data);
      })
      .catch((error) => {
        console.error("Error fetching GitHub data:", error);
      });
  }
}

// Function to update GitHub information in the HTML
function updateGitHubInfo(data) {
  const githubInfoContainer = document.getElementById("github-info-container");
  githubInfoContainer.innerHTML = `
        <img class="github-avatar" src="${data.avatar_url}" alt="GitHub Avatar">
        <h3>${data.name}</h3>
        <p>${data.bio}</p>
        <div class="github-links">
            <a href="${data.html_url}" target="_blank">GitHub Profile</a>
            <a href="${data.blog}" target="_blank">Blog</a>
        </div>
    `;
}

// Call the fetchAndUpdateGitHubData function when the page loads
document.addEventListener("DOMContentLoaded", fetchAndUpdateGitHubData);

// Function to fetch and update GitHub repository details
function fetchAndUpdateGitHubRepos() {
  // Check if data is already in local storage and if the cooldown period has not passed
  const storedReposData = localStorage.getItem("githubReposData");
  const reposCooldownExpires = localStorage.getItem("reposCooldownExpires");

  if (storedReposData && Date.now() < parseInt(reposCooldownExpires, 10)) {
    // Data is in local storage and cooldown hasn't expired, use it
    const parsedReposData = JSON.parse(storedReposData);
    updateGitHubRepos(parsedReposData);
  } else {
    // Fetch data from the GitHub API
    fetch("https://api.github.com/users/notnaveedkhan/repos")
      .then((response) => response.json())
      .then((data) => {
        // Save the data in local storage
        localStorage.setItem("githubReposData", JSON.stringify(data));

        // Set the cooldown period (e.g., 1 hour)
        const reposCooldownDuration = 60 * 60 * 1000; // 1 hour in milliseconds
        const newReposCooldownExpires = Date.now() + reposCooldownDuration;
        localStorage.setItem("reposCooldownExpires", newReposCooldownExpires);

        // Update the GitHub repository details
        updateGitHubRepos(data);
      })
      .catch((error) => {
        console.error("Error fetching GitHub repository data:", error);
      });
  }
}

function formatDate(dateString) {
  const options = { year: "numeric", month: "short", day: "2-digit" };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Function to update GitHub repository details in the HTML
function updateGitHubRepos(data) {
  const projectsContainer = document.getElementById(
    "personal-projects-timeline"
  );

  // Filter out forked repositories
  const repos = data.filter((repo) => !repo.fork && repo.description);

  repos.forEach((project) => {
    const projectItem = document.createElement("div");
    projectItem.classList.add("timeline-item");
    projectItem.innerHTML = `
                    <h2>${project.name} (${project.language})</h2>
                    <div class="project-dates">
                    <p>Created: ${formatDate(project.created_at)}</p>
                    <p>Last Commit: ${formatDate(project.pushed_at)}</p>
                    </div>
                    <p>${project.description}</p>
                `;
    projectsContainer.appendChild(projectItem);
  });

  // Update the projects container with repository cards
  projectsContainer.innerHTML = reposHTML;
}

// Call the fetchAndUpdateGitHubRepos function when the page loads
document.addEventListener("DOMContentLoaded", fetchAndUpdateGitHubRepos);
