document.addEventListener('DOMContentLoaded', function() {
  const projectList = document.getElementById('projectList');
  const categorySelect = document.getElementById('category');
  const filterBtn = document.getElementById('filterBtn');

  let projects = {}; // Object to hold projects data categorized by type

  // Function to fetch projects from JSON file
  async function fetchProjects() {
    try {
      const response = await fetch('projects.json');
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      projects = await response.json();
      displayProjects(); // Display projects on initial load
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  }

  // Function to display projects based on current category selection
  function displayProjects() {
    const selectedCategory = categorySelect.value;
    projectList.innerHTML = '';

    if (selectedCategory === 'all') {
      Object.keys(projects).forEach(category => {
        projects[category].forEach(project => {
          createProjectCard(project);
        });
      });
    } else {
      projects[selectedCategory].forEach(project => {
        createProjectCard(project);
      });
    }
  }

  // Function to create project card HTML
  function createProjectCard(project) {
    const card = document.createElement('div');
    card.classList.add('project-card');
    card.innerHTML = `
      <div>
        <h3>${project.name}</h3>
        <p><b>Category:</b> ${categorySelect.value}</p>
      </div>
      <a href="${project.url}" target="_blank">View on GitHub</a>
    `;
    projectList.appendChild(card);
  }

  // Event listener for filter button click
  filterBtn.addEventListener('click', displayProjects);

  // Initial fetch of projects when DOM content is loaded
  fetchProjects();
});
