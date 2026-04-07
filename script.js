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
  const mfgPanes = document.getElementById('mfgPanes');
  
  const mfgData = [
    { title: "High-Grade Raw Material Selection", desc: "Vacuum sizing tanks ensure precise outer diameter while internal pressure maintains perfect roundness and wall thickness uniformity.", checks: ["PE100 grade material", "Optimal molecular weight distribution"] },
    { title: "Precision Extrusion System", desc: "Our advanced extruders melt the raw material evenly, maintaining strict temperature profiles for structurally flawless pipes.", checks: ["Automated gravimetric feeding", "Advanced screw geometry"] },
    { title: "Vacuum Calibration & Cooling", desc: "Intensive spray cooling tanks rapidly bring the extruded pipe down to shape without inducing thermal stress.", checks: ["Multi-stage cooling zones", "Dimensional stability locks"] },
    { title: "Laser Sizing & Measurement", desc: "Real-time laser micrometers continuously scan the pipe circumference to ensure exacting OD and wall density.", checks: ["Inline continuous scanning", "Zero-tolerance variance"] },
    { title: "Stringent Quality Control", desc: "Batch specimens undergo severe hydrostatic, tensile, and melt-flow index tests in our state-of-the-art lab.", checks: ["100% burst pressure tested", "Exceeds IS 4984 standards"] },
    { title: "Laser Marking & Traceability", desc: "Each meter is permanently laser-etched with batch info, sizing, and standards for complete field traceability.", checks: ["Friction-resistant marking", "Lifetime batch tracking"] },
    { title: "Clean Precision Cutting", desc: "Planetary cutting saws seamlessly slice continuous runs into precise custom lengths without dust or burrs.", checks: ["Burr-free clean cuts", "Automated length sensing"] },
    { title: "Coiling & Dispatch Packaging", desc: "Flexible diameters are neatly coiled while straight lengths are bundled securely to prevent transport damage.", checks: ["Automated tight coiling", "UV-protected wrapping"] }
  ];

  let currentMfgIndex = 0;

  function renderMfgPane(index) {
      if(!mfgPanes) return;
      const data = mfgData[index];
      
      const checksHTML = data.checks.map(check => `
         <li>
           <span class="mfg-check-icon">
             <svg viewBox="0 0 24 24" width="12" height="12" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"><polyline points="20 6 9 17 4 12"></polyline></svg>
           </span> 
           ${check}
         </li>
      `).join('');

      mfgPanes.innerHTML = `
        <div class="mfg-pane active">
          <div class="mfg-pane-left">
            <h3>${data.title}</h3>
            <p>${data.desc}</p>
            <ul class="mfg-checks">
              ${checksHTML}
            </ul>
          </div>
          <div class="mfg-pane-right">
            <div class="mfg-img-wrapper">
              <img src="assets/applications-section/image.png" alt="${data.title}" />
              <button class="mfg-img-arrow left" onclick="changeMfgStep(-1)">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"><polyline points="15 18 9 12 15 6"></polyline></svg>
              </button>
              <button class="mfg-img-arrow right" onclick="changeMfgStep(1)">
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            </div>
          </div>
        </div>
      `;
  }

  window.changeMfgStep = function(dir) {
      currentMfgIndex = (currentMfgIndex + dir + mfgData.length) % mfgData.length;
      updateMfgUI();
  };

  function updateMfgUI() {
      mfgSteps.forEach((step, i) => {
          if (i === currentMfgIndex) step.classList.add('active');
          else step.classList.remove('active');
      });
      renderMfgPane(currentMfgIndex);
  }

  if (mfgSteps.length > 0) {
      mfgSteps.forEach((step, index) => {
          step.addEventListener('click', () => {
              currentMfgIndex = index;
              updateMfgUI();
          });
      });
      renderMfgPane(0);
  }
});