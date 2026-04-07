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
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-btn');
    header.addEventListener('click', () => {
      // Close all others
      faqItems.forEach(otherItem => {
        if(otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });
      
      // Toggle current
      item.classList.toggle('active');
    });
  });

  /* =====================
     APPLICATIONS SLIDER
     ===================== */
  const appSlider = document.getElementById('appSlider');
  const appPrev = document.getElementById('appPrev');
  const appNext = document.getElementById('appNext');
  
  if (appSlider && appPrev && appNext) {
      appPrev.addEventListener('click', () => {
          appSlider.scrollBy({ left: -360, behavior: 'smooth' });
      });
      appNext.addEventListener('click', () => {
          appSlider.scrollBy({ left: 360, behavior: 'smooth' });
      });
  }

  /* =====================
     MANUFACTURING Tabs (Updated)
     ===================== */
  const mfgSteps = document.querySelectorAll('.mfg-step');
  const mfgPanesArray = document.querySelectorAll('.mfg-pane');
  
  let currentMfgIndex = 0;

  window.changeMfgStep = function(dir) {
      if (!mfgSteps.length) return;
      currentMfgIndex = (currentMfgIndex + dir + mfgSteps.length) % mfgSteps.length;
      updateMfgUI();
  };

  function updateMfgUI() {
      mfgSteps.forEach((step, i) => {
          if (i === currentMfgIndex) step.classList.add('active');
          else step.classList.remove('active');
      });
      mfgPanesArray.forEach((pane, i) => {
          if (i === currentMfgIndex) pane.classList.add('active');
          else pane.classList.remove('active');
      });
  }

  if (mfgSteps.length > 0) {
      mfgSteps.forEach((step, index) => {
          step.addEventListener('click', () => {
              currentMfgIndex = index;
              updateMfgUI();
          });
      });
      updateMfgUI();
  }
});