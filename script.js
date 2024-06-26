document.addEventListener('DOMContentLoaded', function() {
  const projectList = document.getElementById('projectList');
  const categorySelect = document.getElementById('category');
  const filterBtn = document.getElementById('filterBtn');
  const itemsPerPageSelect = document.getElementById('itemsPerPage');
  const currentPageSpan = document.getElementById('currentPage');
  const totalPagesSpan = document.getElementById('totalPages');

  let projects = {}; // Object to hold projects data categorized by type
  let currentPage = 1;
  let itemsPerPage = parseInt(itemsPerPageSelect.value);

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

  // Function to display projects based on current page and category selection
  function displayProjects() {
    const selectedCategory = categorySelect.value;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const projectsToDisplay = selectedCategory === 'all' ? getAllProjects() : projects[selectedCategory];

    const paginatedProjects = projectsToDisplay.slice(startIndex, endIndex);
    renderProjects(paginatedProjects);

    updatePaginationInfo(projectsToDisplay.length);
  }

  // Function to get all projects from all categories
  function getAllProjects() {
    let allProjects = [];
    Object.keys(projects).forEach(category => {
      allProjects = allProjects.concat(projects[category]);
    });
    return allProjects;
  }

  // Function to render project cards
  function renderProjects(projectsData) {
    projectList.innerHTML = '';
    projectsData.forEach(project => {
      const card = document.createElement('div');
      card.classList.add('project-card');
      card.innerHTML = `
        <div>
          <h3>${project.name}</h3>
          <p>Category: ${categorySelect.value}</p>
        </div>
        <a href="${project.url}" target="_blank">View on GitHub</a>
      `;
      projectList.appendChild(card);
    });
  }

  // Function to update pagination information (current page, total pages)
  function updatePaginationInfo(totalProjectsCount) {
    const totalPages = Math.ceil(totalProjectsCount / itemsPerPage);
    totalPagesSpan.textContent = totalPages;
    currentPageSpan.textContent = currentPage;
  }

  // Event listener for filter button click
  filterBtn.addEventListener('click', () => {
    currentPage = 1; // Reset to first page when filter changes
    displayProjects();
  });

  // Event listener for items per page change
  itemsPerPageSelect.addEventListener('change', () => {
    itemsPerPage = parseInt(itemsPerPageSelect.value);
    currentPage = 1; // Reset to first page when items per page changes
    displayProjects();
  });

  // Event listener for previous page button click
  document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      displayProjects();
    }
  });

  // Event listener for next page button click
  document.getElementById('nextPage').addEventListener('click', () => {
    const selectedCategory = categorySelect.value;
    const projectsToDisplay = selectedCategory === 'all' ? getAllProjects() : projects[selectedCategory];
    const totalPages = Math.ceil(projectsToDisplay.length / itemsPerPage);

    if (currentPage < totalPages) {
      currentPage++;
      displayProjects();
    }
  });

  // Initial fetch of projects when DOM content is loaded
  fetchProjects();
});
