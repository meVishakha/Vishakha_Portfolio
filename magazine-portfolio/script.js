(function() {
  'use strict';

  // Mobile navigation toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
    });
  }

  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Close mobile menu if open
        if (navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          navToggle.classList.remove('active');
        }
      }
    });
  });

  // Portfolio filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  
  console.log('Filter buttons found:', filterBtns.length);
  console.log('Portfolio items found:', portfolioItems.length);
  
  // Function to get random items from an array
  function getRandomItems(array, count) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      console.log('Filter button clicked:', btn.textContent, 'with filter:', btn.getAttribute('data-filter'));
      
      // Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');
      
      const filter = btn.getAttribute('data-filter');
      
      if (filter === 'all') {
        // Show random 6 projects for "All" button
        const randomItems = getRandomItems(portfolioItems, 6);
        console.log('Showing random 6 items:', randomItems.length);
        
        portfolioItems.forEach(item => {
          if (randomItems.includes(item)) {
            item.style.display = 'block';
            item.style.animation = 'fadeInUp 0.6s ease-out';
          } else {
            item.style.display = 'none';
          }
        });
      } else {
        // Show all items for specific category
        let visibleCount = 0;
        portfolioItems.forEach(item => {
          const itemCategory = item.getAttribute('data-category');
          console.log('Item category:', itemCategory, 'Filter:', filter, 'Match:', itemCategory === filter);
          
          if (itemCategory === filter) {
            item.style.display = 'block';
            item.style.animation = 'fadeInUp 0.6s ease-out';
            visibleCount++;
          } else {
            item.style.display = 'none';
          }
        });
        console.log('Items visible for', filter + ':', visibleCount);
      }
    });
  });

  // Portfolio Modal Functionality
  const portfolioModal = document.getElementById('portfolioModal');
  const modalClose = document.getElementById('modalClose');
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalCategory = document.getElementById('modalCategory');
  const modalTools = document.getElementById('modalTools');
  const portfolioImages = document.querySelectorAll('.portfolio-image img');

  // Open modal when portfolio image is clicked
  portfolioImages.forEach(img => {
    img.addEventListener('click', () => {
      const title = img.getAttribute('data-title');
      const category = img.getAttribute('data-category');
      const tools = img.getAttribute('data-tools');
      const src = img.getAttribute('src');
      const alt = img.getAttribute('alt');

      // Set modal content
      modalImage.src = src;
      modalImage.alt = alt;
      modalTitle.textContent = title;
      modalCategory.textContent = category;
      
      // Create tool tags
      const toolArray = tools.split(', ');
      modalTools.innerHTML = toolArray.map(tool => `<span>${tool}</span>`).join('');

      // Show modal
      portfolioModal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    });
  });

  // Close modal when close button is clicked
  modalClose.addEventListener('click', () => {
    portfolioModal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
  });

  // Close modal when clicking on overlay
  portfolioModal.addEventListener('click', (e) => {
    if (e.target === portfolioModal) {
      portfolioModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && portfolioModal.classList.contains('active')) {
      portfolioModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // Navbar background on scroll
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      navbar.style.background = 'rgba(255, 255, 255, 0.98)';
      navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
      navbar.style.background = 'rgba(255, 255, 255, 0.95)';
      navbar.style.boxShadow = 'none';
    }
  });

  // Animate skill bars on scroll
  const skillBars = document.querySelectorAll('.skill-progress');
  const observerOption = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
  };

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const skillBar = entry.target;
        const width = skillBar.style.width;
        skillBar.style.width = '0%';
        
        setTimeout(() => {
          skillBar.style.width = width;
        }, 200);
      }
    });
  }, observerOption);

  skillBars.forEach(bar => {
    skillObserver.observe(bar);
  });

  // Form submission
  const contactForm = document.querySelector('.form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const name = (formData.get('name') || '').toString().trim();
      const email = (formData.get('email') || '').toString().trim();
      const subject = (formData.get('subject') || '').toString().trim();
      const message = (formData.get('message') || '').toString().trim();

      if (!name || !email || !subject || !message) {
        alert('Please fill in all fields');
        return;
      }

      // Send using Web3Forms API (works on static sites)
      // 1) Create a free access key at: https://web3forms.com/
      // 2) Replace the placeholder below so messages route to your email
      formData.append('access_key', 'REPLACE_WITH_YOUR_WEB3FORMS_ACCESS_KEY');
      formData.append('subject', `New message from ${name} — Portfolio site`);
      formData.append('from_name', name);
      formData.append('replyto', email);

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });
        const result = await response.json();

        if (result.success) {
          alert('Thank you! Your message has been sent.');
          contactForm.reset();
        } else {
          alert('Sorry, there was a problem sending your message. Please try again later.');
        }
      } catch (error) {
        alert('Network error. Please try again later.');
      }
    });
  }

  // Resume download button
  const resumeBtn = document.querySelector('.resume-btn');
  if (resumeBtn) {
    resumeBtn.addEventListener('click', () => {
      // You can replace this with an actual resume file
      alert('Resume download feature coming soon!');
    });
  }

  // Add scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe all sections for scroll animations
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    scrollObserver.observe(section);
  });

  // Initialize portfolio with fade-in effect and show random 6 items by default
  const initialRandomItems = getRandomItems(portfolioItems, 6);
  
  portfolioItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    
    // Set initial display state
    if (initialRandomItems.includes(item)) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
    
    setTimeout(() => {
      item.style.opacity = '1';
      item.style.transform = 'translateY(0)';
    }, 100 + (index * 100));
  });
  
  console.log('Initial random items shown:', initialRandomItems.length);

})();


