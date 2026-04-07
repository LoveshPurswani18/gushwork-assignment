document.addEventListener("DOMContentLoaded", () => {
  /* =====================
     STICKY HEADER
     ===================== */
  const stickyHeader = document.querySelector(".sticky-header");
  const heroSection = document.querySelector(".hero");

  window.addEventListener("scroll", () => {
    // Show sticky header when scrolled past the first fold (hero section)
    if (window.scrollY > (heroSection.offsetHeight || 600) * 0.8) {
      stickyHeader.classList.add("show");
    } else {
      stickyHeader.classList.remove("show");
    }
  });

  /* =====================
     CAROUSEL & ZOOM
     ===================== */
  const mainImage = document.getElementById("mainImage");
  const thumbs = document.querySelectorAll(".thumb");
  const prevBtn = document.getElementById("prevHeroImage");
  const nextBtn = document.getElementById("nextHeroImage");
  let currentImageIdx = 0;

  function updateImage(idx) {
    if(idx < 0) idx = thumbs.length - 1;
    if(idx >= thumbs.length) idx = 0;
    currentImageIdx = idx;

    thumbs.forEach(t => t.classList.remove("active"));
    thumbs[currentImageIdx].classList.add("active");
    mainImage.src = thumbs[currentImageIdx].src;
    
    // reset zoom result bg
    result.style.backgroundImage = `url(${mainImage.src})`;
  }

  thumbs.forEach((thumb, index) => {
    thumb.addEventListener("click", () => updateImage(index));
  });

  if(prevBtn && nextBtn){
      prevBtn.addEventListener("click", () => updateImage(currentImageIdx - 1));
      nextBtn.addEventListener("click", () => updateImage(currentImageIdx + 1));
  }

  // Zoom Functionality
  const container = document.getElementById('zoomContainer');
  const lens = document.getElementById('lens');
  const result = document.getElementById('result');

  // We set initial background for result
  result.style.backgroundImage = `url(${mainImage.src})`;
  // Zoom ratio. You can adjust this. 2x or 3x
  const cx = 2.5; 
  const cy = 2.5;

  container.addEventListener("mouseenter", () => {
    lens.style.visibility = "visible";
    result.style.visibility = "visible";
    result.style.backgroundImage = `url(${mainImage.src})`;
    result.style.backgroundSize = `${mainImage.width * cx}px ${mainImage.height * cy}px`;
  });

  container.addEventListener("mouseleave", () => {    
    lens.style.visibility = "hidden";
    result.style.visibility = "hidden";
  });

  container.addEventListener("mousemove", moveLens);
  // for mobile
  container.addEventListener("touchmove", moveLens);

  function moveLens(e) {
    e.preventDefault();
    const pos = getCursorPos(e);
    let x = pos.x - (lens.offsetWidth / 2);
    let y = pos.y - (offsetHeight = lens.offsetHeight / 2);

    // Prevent lens from going outside the image
    if (x > mainImage.width - lens.offsetWidth) { x = mainImage.width - lens.offsetWidth; }
    if (x < 0) { x = 0; }
    if (y > mainImage.height - lens.offsetHeight) { y = mainImage.height - lens.offsetHeight; }
    if (y < 0) { y = 0; }

    lens.style.left = x + "px";
    lens.style.top = y + "px";

    // Set background position in the result div
    result.style.backgroundPosition = "-" + (x * cx) + "px -" + (y * cy) + "px";
  }

  function getCursorPos(e) {
    let a, x = 0, y = 0;
    e = e || window.event;
    a = mainImage.getBoundingClientRect();
    // Calculate cursor's X and Y, relative to image
    x = e.pageX - a.left;
    y = e.pageY - a.top;
    // Consider any page scrolling
    x = x - window.pageXOffset;
    y = y - window.pageYOffset;
    return {x : x, y : y};
  }

  /* =====================
     FAQ ACCORDION
     ===================== */
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    header.addEventListener('click', () => {
      // Close all others
      accordionItems.forEach(otherItem => {
        if(otherItem !== item) {
          otherItem.classList.remove('active');
          const otherBody = otherItem.querySelector('.accordion-body');
          if(otherBody) otherBody.style.display = 'none';
          const icon = otherItem.querySelector('.icon');
          if(icon) icon.textContent = '+';
        }
      });
      
      // Toggle current
      item.classList.toggle('active');
      const body = item.querySelector('.accordion-body');
      const icon = item.querySelector('.icon');
      if (item.classList.contains('active')) {
        body.style.display = 'block';
        icon.textContent = '-';
      } else {
        body.style.display = 'none';
        icon.textContent = '+';
      }
    });
  });

  /* =====================
     MANUFACTURING Tabs
     ===================== */
  const tabs = document.querySelectorAll('.process-tab');
  const panes = document.querySelectorAll('.process-pane');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-tab');
      
      // Reset active on tabs & panes
      tabs.forEach(t => t.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));

      // set active
      tab.classList.add('active');
      document.getElementById(`tab-${targetId}`).classList.add('active');
    });
  });
});