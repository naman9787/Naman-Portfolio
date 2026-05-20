/* ==========================================================================
   PORTFOLIO FUNCTIONAL CONTROLLER - NAMAN GUPTA PORTFOLIO
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initCursorSpotlight();
  initThemeManager();
  initCanvasParticles();
  initSkillsFilter();
  initProjectModals();
  initScrollReveals();
  initContactUtils();
  initMobileMenu();
});

/* ==========================================================================
   DYNAMIC SPOTLIGHT CURSOR GLOW
   ========================================================================== */
function initCursorSpotlight() {
  const cursorGlow = document.getElementById("cursor-glow");
  if (!cursorGlow) return;

  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;
  
  // Dynamic lerp smoothing factor
  const smoothing = 0.12;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    // Smooth trailing effect using Linear Interpolation
    currentX += (mouseX - currentX) * smoothing;
    currentY += (mouseY - currentY) * smoothing;

    cursorGlow.style.left = `${currentX}px`;
    cursorGlow.style.top = `${currentY}px`;

    requestAnimationFrame(animateCursor);
  }

  animateCursor();
}

/* ==========================================================================
   DYNAMIC ACCENT THEME MANAGER
   ========================================================================== */
function initThemeManager() {
  const themeBtns = document.querySelectorAll(".theme-btn");
  const body = document.body;

  // Themes corresponding classes
  const themeClasses = ["theme-purple", "theme-emerald", "theme-gold"];

  // Fetch saved theme on load
  const savedTheme = localStorage.getItem("portfolio-accent-theme");
  if (savedTheme && savedTheme !== "cyan") {
    body.className = `theme-${savedTheme}`;
    updateActiveBtn(savedTheme);
  }

  themeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const selectedTheme = btn.dataset.theme;

      // Remove existing custom theme classes
      themeClasses.forEach((cls) => body.classList.remove(cls));

      // Add selected theme class if not default (cyan)
      if (selectedTheme !== "cyan") {
        body.classList.add(`theme-${selectedTheme}`);
      }

      // Store in localStorage
      localStorage.setItem("portfolio-accent-theme", selectedTheme);

      updateActiveBtn(selectedTheme);
      showToast(
        "Theme Updated", 
        `Successfully loaded the ${selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)} accent palette.`,
        false
      );
    });
  });

  function updateActiveBtn(theme) {
    themeBtns.forEach((b) => {
      if (b.dataset.theme === theme) {
        b.classList.add("active");
      } else {
        b.classList.remove("active");
      }
    });
  }
}

/* ==========================================================================
   HIGH-PERFORMANCE CANVAS VECTOR PARTICLES
   ========================================================================== */
function initCanvasParticles() {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let particles = [];
  let w = (canvas.width = window.innerWidth);
  let h = (canvas.height = window.innerHeight);

  // Responsive particle density
  const isMobile = window.innerWidth < 768;
  const particleCount = isMobile ? 30 : 85;

  window.addEventListener("resize", () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  });

  class Particle {
    constructor() {
      this.reset();
      this.y = Math.random() * h; // Start at random height initially
    }

    reset() {
      this.x = Math.random() * w;
      this.y = h + Math.random() * 20;
      this.size = Math.random() * 2.2 + 0.8;
      this.speedY = -(Math.random() * 0.45 + 0.15);
      this.speedX = Math.random() * 0.3 - 0.15;
      this.alpha = Math.random() * 0.45 + 0.15;
      this.fadeSpeed = 0.003;
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;

      // Wrap-around borders horizontally
      if (this.x < 0) this.x = w;
      if (this.x > w) this.x = 0;

      // Reset when particle drifts off screen
      if (this.y < -10) {
        this.reset();
      }
    }

    draw() {
      // Dynamic primary color fetch matching body style properties
      const primaryColor = getComputedStyle(document.body).getPropertyValue('--primary').trim() || '#06b6d4';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = primaryColor;
      ctx.globalAlpha = this.alpha;
      ctx.shadowBlur = 8;
      ctx.shadowColor = primaryColor;
      ctx.fill();
    }
  }

  // Populate particle list
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function loop() {
    ctx.clearRect(0, 0, w, h);
    ctx.shadowBlur = 0; // Clear shadow properties for performance
    
    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    requestAnimationFrame(loop);
  }

  loop();
}

/* ==========================================================================
   INTERACTIVE TECH STACK FILTERING
   ========================================================================== */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const skillCards = document.querySelectorAll(".skill-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const activeFilter = btn.dataset.filter;

      // Toggle active status in filtering navigation
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      skillCards.forEach((card) => {
        const category = card.dataset.category;

        if (activeFilter === "all" || category === activeFilter) {
          card.style.display = "block";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "scale(1)";
          }, 50);
        } else {
          card.style.opacity = "0";
          card.style.transform = "scale(0.92)";
          setTimeout(() => {
            card.style.display = "none";
          }, 350);
        }
      });
    });
  });
}

/* ==========================================================================
   DYNAMIC PROJECT DETAIL OVERLAY MODALS
   ========================================================================== */
const projectDatabase = {
  "1": {
    title: "Aura Ledger - Web3 Financial Hub",
    description: "Aura Ledger is an elite decentralized crypto accounting platform designed for modern cryptocurrency traders. It integrates multi-chain smart contracts to compile unified balances, asset metrics, dynamic chart visual layouts, and blockchain network operational stats in one beautiful, glassmorphic layout.",
    role: "Lead Frontend Architect",
    timeline: "April 2026 (3 Weeks)",
    tags: ["React", "CSS Modules", "ApexCharts", "Web3 API"],
    image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?q=80&w=1200",
    features: [
      "Dynamic data queries aggregating balances from Ethereum, Solana, Polygon, and BSC.",
      "Custom ApexCharts integrations detailing historical transaction volumes and yield curves.",
      "Real-time smart contract gas fee estimators powered by modular async triggers.",
      "High contrast visual architecture supporting fluid viewport scaling and themes."
    ],
    live: "https://github.com/naman200811"
  },
  "2": {
    title: "DevSync - Real-time Workspace",
    description: "DevSync is a high-fidelity collaborative SaaS workspace allowing distributed developers to pair-program, chat, and structure workspace folders synchronously. Built on lightning-fast WebSocket pathways, it provides immediate collaborative editing triggers with absolute state alignment.",
    role: "Fullstack & WebSocket Engineer",
    timeline: "March 2026 (4 Weeks)",
    tags: ["Socket.io", "HTML5 Canvas", "Vanilla JS", "Node.js"],
    image: "https://images.unsplash.com/photo-1618401471353-b98aedd07871?q=80&w=1200",
    features: [
      "Operational Transform code editor enabling conflict-free concurrent code editing.",
      "Canvas-rendered cursor pointers detailing teammate active positions on screen.",
      "Virtual folder tree structure with support for directory exports and imports.",
      "Integrates fully validated WebRTC channels for audio/video communication sessions."
    ],
    live: "https://github.com/naman200811"
  },
  "3": {
    title: "Synapse - AI Console & Latency Logger",
    description: "Synapse is a sophisticated developer operations dashboard visualizing prompt executions, semantic caches, system models latency ratios, and API expenditures. It enables AI-focused teams to monitor overheads, query timings, and output efficiencies through high contrast graphics.",
    role: "Visual Designer & Logic Developer",
    timeline: "January 2026 (2 Weeks)",
    tags: ["HTML5", "Figma Prototyping", "CSS Variables", "LocalCache"],
    image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?q=80&w=1200",
    features: [
      "High fidelity dashboard panels featuring customized metrics and diagnostic grids.",
      "Visual query latency paths using animated responsive SVGs and smooth linear flows.",
      "Integrates dynamic prompt repository caching enabling immediate mock test runs.",
      "Highly responsive vector structures adjusting gracefully to desktop and tablet sizes."
    ],
    live: "https://github.com/naman200811"
  }
};

function initProjectModals() {
  const modal = document.getElementById("project-detail-modal");
  const closeBtn = document.getElementById("modal-close-btn");
  const modalTriggers = document.querySelectorAll(".modal-trigger");
  
  const mTitle = document.getElementById("modal-title");
  const mDesc = document.getElementById("modal-desc");
  const mImage = document.getElementById("modal-image");
  const mRole = document.getElementById("modal-role");
  const mTimeline = document.getElementById("modal-timeline");
  const mTags = document.getElementById("modal-tags");
  const mFeatures = document.getElementById("modal-features");
  const mLiveLink = document.getElementById("modal-live-link");

  modalTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const card = trigger.closest(".project-card");
      if (!card) return;

      const projId = card.dataset.projId;
      const data = projectDatabase[projId];
      if (!data) return;

      // Populate Modal Fields
      mTitle.textContent = data.title;
      mDesc.textContent = data.description;
      mImage.src = data.image;
      mRole.textContent = data.role;
      mTimeline.textContent = data.timeline;
      mLiveLink.href = data.live;

      // Clear & Populate Tags
      mTags.innerHTML = "";
      data.tags.forEach((t) => {
        const tagSpan = document.createElement("span");
        tagSpan.className = "modal-meta-tag";
        tagSpan.textContent = t;
        mTags.appendChild(tagSpan);
      });

      // Clear & Populate Features List
      mFeatures.innerHTML = "";
      data.features.forEach((f) => {
        const li = document.createElement("li");
        li.innerHTML = `<i class="fa-solid fa-square-check"></i> <span>${f}</span>`;
        mFeatures.appendChild(li);
      });

      // Open Modal Overlay
      modal.classList.add("open");
      document.body.style.overflow = "hidden"; // Prevent body scrolling
    });
  });

  // Close triggers
  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  function closeModal() {
    modal.classList.remove("open");
    document.body.style.overflow = ""; // Re-enable scrolling
  }
}

/* ==========================================================================
   VIEWPORT ENTRANCE ANIMATIONS (REVEALS) & NUMBERS INCREMENTING
   ========================================================================== */
function initScrollReveals() {
  const revealElements = document.querySelectorAll(".reveal-element");
  const statsNums = document.querySelectorAll(".stat-num");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active-reveal");
          
          // Trigger counters when stats section comes in
          if (entry.target.classList.contains("bio-card")) {
            triggerStatsCounters();
          }
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  let countersStarted = false;
  function triggerStatsCounters() {
    if (countersStarted) return;
    countersStarted = true;

    statsNums.forEach((item) => {
      const targetVal = parseInt(item.dataset.val);
      let currentVal = 0;
      const duration = 1200; // Counter timing in milliseconds
      const steps = 40;
      const increment = Math.ceil(targetVal / steps);
      const stepTime = duration / steps;

      const timer = setInterval(() => {
        currentVal += increment;
        if (currentVal >= targetVal) {
          item.textContent = `${targetVal}+`;
          clearInterval(timer);
        } else {
          item.textContent = `${currentVal}+`;
        }
      }, stepTime);
    });
  }

  // Active Link navigation tracker on scrolling
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll(".nav-links a, .mobile-nav-panel a");

  window.addEventListener("scroll", () => {
    let currentSectionId = "";
    sections.forEach((sec) => {
      const sectionTop = sec.offsetTop;
      const sectionHeight = sec.clientHeight;
      if (window.scrollY >= sectionTop - 150) {
        currentSectionId = sec.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentSectionId}`) {
        link.classList.add("active");
      }
    });
  });
}

/* ==========================================================================
   DYNAMIC DUST TOASTS & CONTACT UTILS
   ========================================================================== */
function initContactUtils() {
  const emailBox = document.getElementById("email-copy-box");
  const contactForm = document.getElementById("contact-feedback-form");
  const submitBtn = document.getElementById("submit-btn");

  // Copy Email Clipboard Event
  if (emailBox) {
    emailBox.addEventListener("click", () => {
      const email = "naman200811@gmail.com";
      navigator.clipboard.writeText(email)
        .then(() => {
          const copyIcon = emailBox.querySelector(".copy-action-btn i");
          copyIcon.className = "fa-solid fa-check";
          copyIcon.style.color = "#10b981";
          
          showToast(
            "Copied Address!",
            "Naman's email (naman200811@gmail.com) successfully copied to your clipboard.",
            true
          );

          setTimeout(() => {
            copyIcon.className = "fa-regular fa-clone";
            copyIcon.style.color = "";
          }, 2000);
        })
        .catch(() => {
          showToast("Copy Failed", "Unable to copy address automatically. Please highlight and copy manually.", false);
        });
    });
  }

  // Form Submit Loading / Checking simulation
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const name = document.getElementById("form-name").value;
      const subject = document.getElementById("form-subject").value;

      submitBtn.classList.add("loading");
      submitBtn.disabled = true;

      // Simulate network request delay (1.8s)
      setTimeout(() => {
        submitBtn.classList.remove("loading");
        submitBtn.classList.add("success");
        submitBtn.querySelector("span").textContent = "Message Sent!";
        submitBtn.querySelector("i").className = "fa-solid fa-circle-check";

        showToast(
          "Message Transmitted!",
          `Thank you ${name}. Your message regarding "${subject}" is delivered successfully. Naman will respond shortly!`,
          true
        );

        setTimeout(() => {
          // Reset Form & Button
          contactForm.reset();
          submitBtn.classList.remove("success");
          submitBtn.disabled = false;
          submitBtn.querySelector("span").textContent = "Send Message";
          submitBtn.querySelector("i").className = "fa-solid fa-paper-plane";
        }, 3000);

      }, 1800);
    });
  }
}

/* ==========================================================================
   DYNAMIC TOAST CREATION UTILITIES
   ========================================================================== */
function showToast(title, body, isSuccess) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const card = document.createElement("div");
  card.className = `toast-alert-card ${isSuccess ? "success-toast" : ""}`;
  
  const icon = isSuccess ? "fa-solid fa-circle-check" : "fa-solid fa-bolt-lightning";
  
  card.innerHTML = `
    <div class="toast-status-icon"><i class="${icon}"></i></div>
    <div class="toast-info-text">
      <h5>${title}</h5>
      <p>${body}</p>
    </div>
  `;

  container.appendChild(card);

  // Trigger entering animation
  setTimeout(() => card.classList.add("show"), 50);

  // Auto remove toast card after 4.5s
  setTimeout(() => {
    card.classList.remove("show");
    setTimeout(() => card.remove(), 500);
  }, 4500);
}

/* ==========================================================================
   RESPONSIVE MOBILE DRAPE MENU
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById("menu-toggle-btn");
  const mobileMenu = document.getElementById("mobile-nav-menu");
  const menuLinks = document.querySelectorAll("#mobile-nav-menu a");

  if (!toggleBtn || !mobileMenu) return;

  toggleBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("open");
    const icon = toggleBtn.querySelector("i");
    
    if (mobileMenu.classList.contains("open")) {
      icon.className = "fa-solid fa-xmark";
    } else {
      icon.className = "fa-solid fa-bars-staggered";
    }
  });

  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      toggleBtn.querySelector("i").className = "fa-solid fa-bars-staggered";
    });
  });
}
