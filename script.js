// carousel

const thumbs = document.querySelectorAll(".thumb");
const mainImage = document.getElementById("mainImage");

thumbs.forEach(thumb => {
  thumb.addEventListener("click", () => {

    document.querySelector(".thumb.active")
      .classList.remove("active");

    thumb.classList.add("active");

    mainImage.src = thumb.src;
  });
});


// sticky header

const header = document.querySelector(".header");
let lastScroll = 0;

window.addEventListener("scroll", () => {
  const currentScroll = window.scrollY;

  if (currentScroll > 80) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }

  lastScroll = currentScroll;
});