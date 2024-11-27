console.log("loader.js");

let targetFrame = ".loader-frame";
let targetLoader = ".loader";
let targetFrame2 = ".loader-frame-2";
let targetLoader2 = ".loader-2";

document.addEventListener("DOMContentLoaded", function () {
  createLoader(targetLoader, targetFrame);
  createLoader(targetLoader2, targetFrame2);
});

function createLoader(container, frame) {
  const loaderFrame = document.querySelector(frame);
  const loaderBackground = document.querySelector(container);
  loaderBackground.style.display = "flex";
  if (loaderFrame) {
    let divs = loaderFrame.querySelectorAll("div");
    let totalWidth = loaderFrame.offsetWidth;
    const screenWidth = window.innerWidth;

    while (totalWidth < screenWidth * 1.5) {
      divs.forEach((div) => {
        const newDiv = div.cloneNode(true);
        loaderFrame.appendChild(newDiv);
      });
      divs = loaderFrame.querySelectorAll("div");
      totalWidth = loaderFrame.offsetWidth;
    }

    loaderBackground.style.backgroundColor = "transparent";

    divs.forEach((div, index) => {
      div.id = `unique-id-${index + 1}`;
      setTimeout(() => {
        div.style.transition = "opacity 1s linear";
        div.style.opacity = "0";
      }, index * 200);
    });
  }
}
