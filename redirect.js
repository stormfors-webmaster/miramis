console.log("Hello World");

// Check for the query parameter
if (new URLSearchParams(window.location.search).get("from") === "erqole") {
  console.log("Query parameter found: Erqole");

  document.addEventListener("DOMContentLoaded", () => {
    showPopup();
    document.getElementById("popup-btn").addEventListener("click", hidePopup);
    startProgressbar();
    setTimeout(() => {
      hidePopup();
    }, 5000);
  });
}

function startProgressbar() {
  const progressbar = document.getElementById("progress-bar");
  progressbar.style.transition = "width 5s ease-in-out";
  progressbar.style.width = "0";
  requestAnimationFrame(() => {
    progressbar.style.width = "100%";
  });
}

function showPopup() {
  document.body.classList.add("disable-scroll");
  const popup = document.getElementById("erqolepopup");
  popup.style.display = "flex";
}

function hidePopup() {
  document.body.classList.remove("disable-scroll");
  const popup = document.getElementById("erqolepopup");

  createLoader();
  popup.style.backgroundColor = "transparent";
  /* popup.style.transition = "opacity 1s ease-out";
  popup.style.opacity = "0"; */

  setTimeout(() => {
    popup.style.display = "none";
    popup.remove();
  }, 3000);

  const url = new URL(window.location.href);
  url.searchParams.delete("from");
  window.history.replaceState({}, "", url);
}
