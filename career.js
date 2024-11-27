/*
              _                        __                
          ___| |_ ___  _ __ _ __ ___  / _| ___  _ __ ___ 
         / __| __/ _ \| '__| '_ ` _ \| |_ / _ \| '__/ __|
        _\__ \ || (_) | |  | | | | | |  _| (_) | |  \__ \
       (_)___/\__\___/|_|  |_| |_| |_|_|  \___/|_|  |___/
      
       Script created by Stormfors: www.stormfors.com
*/

/*-------------------------------------*/
/*            Fetch URLs               */
/*-------------------------------------*/

let englishURL =
  "https://zinrec.intervieweb.it/annunci.php?lang=en&LAC=erqole&d=miramis.com&k=603e695eadef987e4321536bd158a881&CodP=&format=json_en&utype=0";
let italianURL =
  "https://zinrec.intervieweb.it/annunci.php?lang=it&LAC=erqole&d=miramis.com&k=603e695eadef987e4321536bd158a881&CodP=&format=json_en&utype=0";

/*-------------------------------------*/
/*            Variables                */
/*-------------------------------------*/

// Editable Variables
let sectionID = "jobs-section";
let filterContainerClass = ".career_filters";
let jobContainerID = "job-container";
let jobItem = ".job-item";
let filterIdentifier = "[data-filter]";
let resetIdentifier = "[data-filter='reset']";
let activeIdentifier = "active";

// Functional Variables
let currentPath = window.location.pathname;
let scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
let jobsArray = [];
let language;

/*-------------------------------------*/
/*            Fetch Job                */
/*-------------------------------------*/

function fetchJobs(url) {
  showJobPreLoader();
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const jobList = document.getElementById(jobContainerID);
      jobList.innerHTML = "";
      jobsArray = data;
      data.forEach((job) => {
        let title = job.title;
        let drawerID = "job-drawer-" + job.id;
        let slug = job.slug;
        let fullDescription = formatLongDescription(job.description);
        let shortDescription = formatShortDescription(job.description);
        let date = formatDate(job.published);

        // Create job element
        const jobItem = document.createElement("div");
        jobItem.classList.add("job-item");
        jobItem.id = "job-item-" + job.id;
        jobItem.innerHTML = `
<!--html-->
<div class="job-listing" onclick="openJobDrawer('${drawerID}', '${slug}')">
  <div class="title">
      <div id="job-title" class="heading-style-h3">${title}</div>
  </div>
  <div class="details">
      <div id="job-location" class="text-style-label">${job.project_label}</div>
      <div id="job-date" class="text-style-label text-color-grey">${date}</div>
  </div>
  <div class="description">
      <p id="job-description" class="text-color-dark-grey text-style-3lines">${shortDescription}</p>
  </div>
  <div id="btn-open-drawer" class="button_primary">
      <div class="text-style-label">Read more</div>
  </div>
</div>

<div id="${drawerID}" class="job_drawer" data-slug="${slug}">
  <div class="job_wrapper">
    <div class="drawer_menu">
      <a href="#" class="button_primary w-inline-block" onclick="closeJobDrawer('${drawerID}')">
          <div class="text-style-label">Close</div>
      </a>
      <div class="drawer_logo">
        <div class="navbar_logo">
          <svg width="100%" height="100%" viewBox="0 0 21 48" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M0.663086 48L3.40441 22.7368H6.30698L9.0483 48H0.663086Z" fill="CurrentColor" />
                <path d="M11.9512 48L14.6925 22.7368H17.5951L20.3364 48H11.9512Z" fill="CurrentColor" />
                <path d="M9.0089 22.7368L6.26758 0H14.6528L11.9115 22.7368H9.0089Z" fill="CurrentColor" />
            </svg>
        </div>
      </div>
      <div class="job-preview_button-wrapper"><a href="${job.url}" class="button_primary w-inline-block">
              <div class="text-style-label">Apply now</div>
          </a>
      </div>
    </div>
<div class="padding-global padding-section-large">
  <div class="job_layout">
      <div class="job_title">
          <h2 class="heading-style-h1">${title}</h2>
          <p>
              ${shortDescription}
          </p>
          <div class="job-preview_tags">
              <p class="text-style-label">${job.project_label}</p>
              <p class="text-style-label">${date}</p>
          </div>
      </div>
      <div class="image_wrapper"><img src="${job.coverImage}" alt="" loading="eager" class="image"></div>
      <div class="container-small text-rich-text">
          ${fullDescription}
      </div>
      <div id="job-iframe" class="job-application-iframe w-embed w-iframe"><iframe
              src="${job.registration_iframe_url}" width="100%" height="600" frameborder="0"
              allowfullscreen=""></iframe></div>
  </div>
</div>
<div class="job_apply-footer">
  <div class="job-preview_button-wrapper"><a href="${job.url}"
          class="button_primary is-alternate w-inline-block">
          <div class="text-style-label">Apply now</div>
      </a>
  </div>
</div>
</div>
  <div class="job_close-area" onclick="closeJobDrawer('${drawerID}')"></div>
</div>
<!--!html-->
                `;
        jobList.appendChild(jobItem);
      });
      hideJobPreLoader();
      initFilters(jobsArray);
      checkUrlForDrawer();
    })
    .catch((error) => {
      console.error("Error:", error);
      hideJobPreLoader();
    });
}

/*-------------------------------------*/
/*            Filter Jobs              */
/*-------------------------------------*/

class JobFilter {
  constructor() {
    this.jobList = document.querySelectorAll(jobItem);
    this.filters = {};
  }

  setFilter(filterName, filterFunction) {
    this.filters[filterName] = filterFunction;
    this.applyFilters();
  }

  removeFilter(filterName) {
    delete this.filters[filterName];
    this.applyFilters();
  }

  applyFilters() {
    this.jobList.forEach((item) => {
      const shouldShow = Object.values(this.filters).every((filterFn) =>
        filterFn(item)
      );
      item.style.display = shouldShow ? "" : "none";
    });
  }
}

function initFilters(data) {
  const funcionSet = new Set();
  data.forEach((job) => {
    funcionSet.add(job.function);
  });
  showFilters();
  funcionSet.forEach((functionName) => {
    createButton("function", functionName, functionName);
  });

  createButton("reset", "Show All", "Show All");
  initializeFilterButtons();
}

function showFilters() {
  const target = document.querySelector(filterContainerClass);
  target.innerHTML = "";
  target.classList.remove("hide");
}

function createButton(filterType, filterValue, buttonText) {
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("filter-btn");
  const button = buttonContainer.appendChild(document.createElement("button"));
  button.dataset.filter = filterType;
  button.dataset.value = filterValue;
  button.classList.add("text-style-label");
  button.textContent = buttonText;

  const filterContainer = document.querySelector(filterContainerClass);
  filterContainer.insertBefore(buttonContainer, filterContainer.firstChild);

  return button;
}

function initializeFilterButtons() {
  const jobFilter = new JobFilter();

  const filterButtons = document.querySelectorAll(filterIdentifier);
  const clearButton = document.querySelector(resetIdentifier);
  clearButton.parentElement.classList.add(activeIdentifier);

  const activeFilters = new Set();

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filterType = button.dataset.filter;
      const filterValue = button.dataset.value;
      clearButton.parentElement.classList.remove(activeIdentifier);

      if (activeFilters.has(button)) {
        activeFilters.delete(button);
        button.parentElement.classList.remove(activeIdentifier);
        jobFilter.removeFilter(filterType);
      } else {
        filterButtons.forEach((btn) => {
          if (btn.dataset.filter === filterType && activeFilters.has(btn)) {
            activeFilters.delete(btn);
            btn.parentElement.classList.remove(activeIdentifier);
          }
        });

        activeFilters.add(button);
        button.parentElement.classList.add(activeIdentifier);
        jobFilter.setFilter(filterType, (item) => {
          const jobId = item.id.split("-").pop();
          const matchingJob = jobsArray.find(
            (job) => job.id.toString() === jobId
          );

          return matchingJob && matchingJob[filterType] === filterValue;
        });
      }
    });
  });

  clearButton?.addEventListener("click", () => {
    activeFilters.clear();
    filterButtons.forEach((btn) =>
      btn.parentElement.classList.remove(activeIdentifier)
    );
    Object.keys(jobFilter.filters).forEach((filter) => {
      jobFilter.removeFilter(filter);
    });
    clearButton.parentElement.classList.add(activeIdentifier);
  });
}

/*-------------------------------------*/
/*        Event Listeners              */
/*-------------------------------------*/

document.addEventListener("DOMContentLoaded", () => {
  enableScroll();
  Weglot.on("initialized", () => {
    language = Weglot.getCurrentLang();
    if (language === "it") {
      fetchJobs(italianURL);
    } else {
      fetchJobs(englishURL);
    }
  });
  Weglot.on("languageChanged", function (newLang, prevLang) {
    if (newLang === "it") {
      fetchJobs(italianURL);
    } else {
      fetchJobs(englishURL);
    }
  });
});

window.addEventListener("popstate", (event) => {
  if (event.state && event.state.drawerId) {
    const drawerSlug = document.getElementById(event.state.drawerId)?.dataset
      .slug;
    if (drawerSlug) {
      openJobDrawer(event.state.drawerId, drawerSlug);
    } else {
      console.warn("Drawer slug not found for drawerId:", event.state.drawerId);
      enableScroll();
    }
  } else {
    document.querySelectorAll(".job_drawer.active").forEach((drawer) => {
      drawer.classList.remove(activeIdentifier);
    });
    enableScroll();
  }
});

/*-------------------------------------*/
/*        Job Drawer Functions         */
/*-------------------------------------*/

function openJobDrawer(id, drawerSlug) {
  if (!id || !drawerSlug) {
    console.error("Invalid parameters for openJobDrawer:", id, drawerSlug);
    return;
  }

  let jobDrawer = document.getElementById(id);
  if (jobDrawer) {
    disableScroll();
    jobDrawer.classList.add(activeIdentifier);
    history.pushState({ drawerId: id }, "", `${currentPath}#${drawerSlug}`);

    setTimeout(() => {
      jobDrawer.focus();
      jobDrawer.setAttribute("tabindex", "-1");
    }, 100);
  } else {
    console.warn("Job drawer not found for id:", id);
  }
}

function closeJobDrawer(id) {
  let jobDrawer = document.getElementById(id);
  jobDrawer.classList.remove(activeIdentifier);
  history.pushState({}, "", currentPath);
  enableScroll();
}

function checkUrlForDrawer() {
  const pathParts = window.location.href.split("#");
  const drawerSlug = pathParts[pathParts.length - 1];
  const jobDrawer = document.querySelector(
    `.job_drawer[data-slug="${drawerSlug}"]`
  );

  if (jobDrawer) {
    const drawerId = jobDrawer.id;
    openJobDrawer(drawerId, drawerSlug);
    document.getElementById(sectionID).scrollIntoView();
  }
}

/*-------------------------------------*/
/*        Utility Functions            */
/*-------------------------------------*/

function disableScroll() {
  document.body.classList.add("disable-scroll");
  document.body.style.paddingRight = scrollbarWidth + "px";
}

function enableScroll() {
  document.body.classList.remove("disable-scroll");
  document.body.style.paddingRight = "0";
}

function hideJobPreLoader() {
  document.getElementById("job-loader").classList.add("hidden");
}

function showJobPreLoader() {
  document.getElementById("job-loader").classList.remove("hidden");
}

function formatLongDescription(description) {
  description = description.replace(/<br \/>/g, "");
  description = description.replace(/<br\/>/g, "");
  description = description.replace(/<p><\/p>/g, "");
  description = description.replace(/<h2>/g, "<h3>");
  description = description.replace(/<\/h2>/g, "</h3>");
  return description;
}

function formatShortDescription(description) {
  let tempDiv = document.createElement("div");
  tempDiv.innerHTML = description;
  let firstPTag = tempDiv.querySelector("p");
  let shortDescription = firstPTag ? firstPTag.textContent : "";
  return shortDescription;
}

function formatDate(date) {
  let tempDiv2 = document.createElement("div");
  tempDiv2.innerHTML = date;
  let dateParts = tempDiv2.textContent.split(" ")[0].split("-");
  let dateObject = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
  let options = { year: "numeric", month: "long", day: "numeric" };
  let formattedDate = dateObject.toLocaleDateString("en-US", options);
  return formattedDate;
}
