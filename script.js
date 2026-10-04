document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const header = document.querySelector(".header");
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-links a");
  const revealItems = document.querySelectorAll(".reveal");
  const typedTextElement = document.getElementById("typed-text");
  const animateNumberElements = document.querySelectorAll(".meta-number");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");
  const backToTopButton = document.querySelector(".back-to-top");
  const themeToggle = document.querySelector(".theme-toggle");
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");
  const currentYear = document.getElementById("currentYear");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // Mobile navigation toggling.
  const closeMobileMenu = () => {
    if (!navToggle || !navMenu) return;
    navMenu.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  };

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      document.body.classList.toggle("nav-open", isOpen);
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) {
        closeMobileMenu();
      }
    });
  }

  // Navbar scroll effect and active section styling.
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach((link) => {
            const isActive = link.getAttribute("href") === `#${id}`;
            link.classList.toggle("active", isActive);
          });
        }
      });
    },
    { threshold: 0.55 }
  );

  document.querySelectorAll("main section[id]").forEach((section) => {
    sectionObserver.observe(section);
  });

  const handleHeaderState = () => {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 30);
  };

  handleHeaderState();
  window.addEventListener("scroll", handleHeaderState);

  // Typing animation.
  const typingPhrases = [
    "Full Stack Developer",
    "Web Developer",
    "Engineering Student",
    "Tech Enthusiast"
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const typeLoop = () => {
    if (!typedTextElement) return;

    const currentPhrase = typingPhrases[phraseIndex];

    if (isDeleting) {
      typedTextElement.textContent = currentPhrase.slice(0, charIndex--);
    } else {
      typedTextElement.textContent = currentPhrase.slice(0, ++charIndex);
    }

    let typeSpeed = isDeleting ? 80 : 130;

    if (!isDeleting && charIndex === currentPhrase.length) {
      typeSpeed = 1500;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % typingPhrases.length;
      typeSpeed = 400;
    }

    setTimeout(typeLoop, typeSpeed);
  };

  typeLoop();

  // Scroll reveal animation.
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  // Animated counters.
  const animateCounters = () => {
    animateNumberElements.forEach((element) => {
      const targetValue = Number(element.dataset.target || 0);
      if (!targetValue) return;

      let current = 0;
      const increment = Math.ceil(targetValue / 18);
      const timer = setInterval(() => {
        current += increment;
        if (current >= targetValue) {
          element.textContent = `${targetValue}${targetValue === 100 ? '%' : ''}`;
          clearInterval(timer);
        } else {
          element.textContent = `${current}${targetValue === 100 ? '%' : ''}`;
        }
      }, 35);
    });
  };

  animateCounters();

  // Project filtering.
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedFilter = button.dataset.filter;

      filterButtons.forEach((btn) => btn.classList.toggle("active", btn === button));

      projectCards.forEach((card) => {
        const cardCategory = card.dataset.category;
        const matches = selectedFilter === "all" || cardCategory === selectedFilter;
        card.classList.toggle("hidden", !matches);
      });
    });
  });

  // Back-to-top button.
  const toggleBackToTop = () => {
    if (!backToTopButton) return;
    backToTopButton.classList.toggle("visible", window.scrollY > 500);
  };

  toggleBackToTop();
  window.addEventListener("scroll", toggleBackToTop);

  if (backToTopButton) {
    backToTopButton.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Theme toggle.
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      body.classList.toggle("light-theme");
      const isLight = body.classList.contains("light-theme");
      themeToggle.innerHTML = isLight
        ? '<i class="fa-solid fa-sun"></i>'
        : '<i class="fa-solid fa-moon"></i>';
    });
  }

  // Contact form validation.
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(contactForm);
      const name = (formData.get("name") || "").toString().trim();
      const email = (formData.get("email") || "").toString().trim();
      const subject = (formData.get("subject") || "").toString().trim();
      const message = (formData.get("message") || "").toString().trim();

      formStatus.className = "form-status";

      if (!name || !email || !subject || !message) {
        formStatus.textContent = "Please fill in all fields before sending your message.";
        formStatus.classList.add("error");
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        formStatus.textContent = "Please enter a valid email address.";
        formStatus.classList.add("error");
        return;
      }

      // This frontend-only form cannot securely send emails by itself.
      // Connect it to a backend endpoint or email service later.
      formStatus.textContent = "Form validation passed. Connect this to a backend or email service to send messages.";
      formStatus.classList.add("success");
      contactForm.reset();
    });
  }

  // Prevent page from breaking on unsupported browsers by keeping nav items accessible.
  navLinks.forEach((link) => {
    link.addEventListener("focus", () => {
      navMenu.classList.add("open");
    });
  });
});
