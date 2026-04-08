document.addEventListener("DOMContentLoaded", () => {
  /* Sticky header- Handles the appearance of the mini-header after the first fold.*/
  const header = document.querySelector(".header");
  const stickyHeader = document.querySelector(".sticky-header");
  const heroSection = document.querySelector(".hero");

  window.addEventListener("scroll", () => {
    // Dynamic background change for main header
    if (window.scrollY > 10) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    // Toggle mini-sticky-header visibility based on fold position
    if (window.scrollY > (heroSection.offsetHeight || 600) * 0.8) {
      stickyHeader.classList.add("visible");
    } else {
      stickyHeader.classList.remove("visible");
    }
  });

  /* Hero Carousel & Zoom - Manages thumbnail switching and the high-fidelity magnifying zoom.*/
  const mainImage = document.getElementById("mainImage");
  const thumbs = document.querySelectorAll(".thumb");
  const prevBtn = document.getElementById("prevHeroImage");
  const nextBtn = document.getElementById("nextHeroImage");
  
  let currentImageIdx = 0;
  const imageUrls = Array.from(thumbs).map(t => t.src);

  function updateImage(idx) {
    if (idx < 0) idx = imageUrls.length - 1;
    if (idx >= imageUrls.length) idx = 0;
    currentImageIdx = idx;
    
    mainImage.src = imageUrls[currentImageIdx];
    thumbs.forEach((t, i) => t.classList.toggle("active", i === currentImageIdx));
    // Update the zoom background source to match new image
    if (typeof setZoom === 'function') setZoom();
  }

  thumbs.forEach((thumb, index) => {
    thumb.addEventListener("click", () => updateImage(index));
  });

  if (prevBtn && nextBtn) {
      prevBtn.addEventListener("click", () => updateImage(currentImageIdx - 1));
      nextBtn.addEventListener("click", () => updateImage(currentImageIdx + 1));
  }

  // Zoom Functionality
  const container = document.getElementById('zoomContainer');
  const lens = document.getElementById('lens');
  const result = document.getElementById('result');

  let cx, cy;

  // Calculates zoom ratios based on lens and result box dimensions.
  // Updates background image and sizing of the preview box.
  function setZoom() {
    if (!result || !lens || !mainImage) return;
    cx = result.offsetWidth / lens.offsetWidth;
    cy = result.offsetHeight / lens.offsetHeight;
    
    result.style.backgroundImage = `url(${mainImage.src})`;
    result.style.backgroundSize = `${mainImage.width * cx}px ${mainImage.height * cy}px`;
  }

  container.addEventListener("mouseenter", () => {
    lens.style.visibility = "visible";
    result.style.visibility = "visible";
    setZoom();
  });

  container.addEventListener("mouseleave", () => {    
    lens.style.visibility = "hidden";
    result.style.visibility = "hidden";
  });

  container.addEventListener("mousemove", moveLens);
  container.addEventListener("touchmove", (e) => moveLens(e), { passive: false });

  // Positions the lens over the cursor and shifts the background offset 
  // of the preview box accordingly.
  function moveLens(e) {
    if (e.type === 'touchmove') e.preventDefault();
    const pos = getCursorPos(e);
    let x = pos.x - (lens.offsetWidth / 2);
    let y = pos.y - (lens.offsetHeight / 2);

    // Boundary constraints
    if (x > mainImage.width - lens.offsetWidth) x = mainImage.width - lens.offsetWidth;
    if (x < 0) x = 0;
    if (y > mainImage.height - lens.offsetHeight) y = mainImage.height - lens.offsetHeight;
    if (y < 0) y = 0;

    lens.style.left = x + "px";
    lens.style.top = y + "px";

    // Synchronize zoomed preview background position
    result.style.backgroundPosition = "-" + (x * cx) + "px -" + (y * cy) + "px";
  }

  function getCursorPos(e) {
    const a = mainImage.getBoundingClientRect();
    const event = e.touches ? e.touches[0] : e;
    const x = event.clientX - a.left;
    const y = event.clientY - a.top;
    return { x, y };
  }

  /* FAQ Accordion - Toggles content visibility for the frequently asked questions.*/
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-btn');
    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });

  /* Application Slider - Simple horizontal scroll slide for application cards.*/
  const appSlider = document.querySelector('.app-grid');
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

  /* Manufacturing Stepper - Synchronizes visual tabs with content panes and mobile badges.*/
  const mfgSteps = document.querySelectorAll('.mfg-step');
  const mfgPanesArray = document.querySelectorAll('.mfg-pane');
  let currentMfgIndex = 0;
  const stepLabels = ['Raw Material', 'Extrusion', 'Cooling', 'Sizing', 'Quality Control', 'Marking', 'Cutting', 'Packaging'];

  window.changeMfgStep = function(dir) {
      if (!mfgSteps.length) return;
      currentMfgIndex = (currentMfgIndex + dir + mfgSteps.length) % mfgSteps.length;
      updateMfgUI();
  };

  // Updates the active state of manufacturing tabs and content panes.
  function updateMfgUI(skipScroll = false) {
      mfgSteps.forEach((step, i) => {
          if (i === currentMfgIndex) {
            step.classList.add('active');
            if (!skipScroll) {
              step.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
            }
          } else step.classList.remove('active');
      });
      mfgPanesArray.forEach((pane, i) => {
          if (i === currentMfgIndex) {
            pane.classList.add('active');
            const badge = pane.querySelector('.mfg-step-badge');
            if (badge) badge.textContent = `Step ${i + 1}/${mfgPanesArray.length}: ${stepLabels[i] || ''}`;
          } else pane.classList.remove('active');
      });
  }

  if (mfgSteps.length > 0) {
      mfgSteps.forEach((step, index) => {
          step.addEventListener('click', () => {
              currentMfgIndex = index;
              updateMfgUI();
          });
      });
      updateMfgUI(true); 
  }

  /* Modal Management - Centralized logic for opening/closing Request Quote & Download portals.*/
  const downloadModal = document.getElementById('downloadModal');
  const quoteModal = document.getElementById('quoteModal');
  const downloadTriggers = document.querySelectorAll('.open-download-modal');
  const quoteTriggers = document.querySelectorAll('.open-quote-modal');
  const closeDownload = document.getElementById('closeModal');
  const closeQuote = document.getElementById('closeQuoteModal');

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; 
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  downloadTriggers.forEach(btn => btn.addEventListener('click', () => openModal(downloadModal)));
  quoteTriggers.forEach(btn => btn.addEventListener('click', () => openModal(quoteModal)));

  if (closeDownload) closeDownload.addEventListener('click', () => closeModal(downloadModal));
  if (closeQuote) closeQuote.addEventListener('click', () => closeModal(quoteModal));

  // Global exit listener for clicking outside modal content
  window.addEventListener('click', (e) => {
    if (e.target === downloadModal) closeModal(downloadModal);
    if (e.target === quoteModal) closeModal(quoteModal);
  });
});