/* ============================================================
   JAX LOCKSMITH PRO — script.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── HAMBURGER / MOBILE MENU ── */
  const hamburger     = document.getElementById('hamburger');
  const mobileMenu    = document.getElementById('mobileMenu');
  const mServicesBtn  = document.getElementById('mServicesBtn');
  const mServicesMenu = document.getElementById('mServicesMenu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  mServicesBtn.addEventListener('click', () => {
    mServicesMenu.classList.toggle('open');
  });

  // Close mobile menu when any link is clicked
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });


  /* ── DESKTOP SERVICES DROPDOWN ── */
  const dropdownBtns = document.querySelectorAll('.dropdown-btn');
  
  dropdownBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const dropdown = btn.nextElementSibling;
      const isOpen = dropdown.style.opacity === '1';
      
      // Close all dropdowns and remove open class
      document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.style.opacity = '0';
        menu.style.pointerEvents = 'none';
        menu.style.transform = 'translateX(-50%) translateY(-8px)';
      });
      document.querySelectorAll('.dropdown-btn').forEach(b => b.classList.remove('open'));
      
      // Open clicked dropdown if it was closed
      if (!isOpen) {
        dropdown.style.opacity = '1';
        dropdown.style.pointerEvents = 'all';
        dropdown.style.transform = 'translateX(-50%) translateY(0)';
        btn.classList.add('open');
      }
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown-btn') && !e.target.closest('.dropdown-menu')) {
      document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.style.opacity = '0';
        menu.style.pointerEvents = 'none';
        menu.style.transform = 'translateX(-50%) translateY(-8px)';
      });
      document.querySelectorAll('.dropdown-btn').forEach(b => b.classList.remove('open'));
    }
  });

  // Close dropdown when clicking on dropdown menu items
  document.querySelectorAll('.dropdown-menu a').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.style.opacity = '0';
        menu.style.pointerEvents = 'none';
        menu.style.transform = 'translateX(-50%) translateY(-8px)';
      });
      document.querySelectorAll('.dropdown-btn').forEach(b => b.classList.remove('open'));
    });
  });


  /* ── FAQ ACCORDION ── */
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item   = q.parentElement;
      const isOpen = item.classList.contains('open');
      // Close all
      item.closest('.faq-list').querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      // Open clicked if it was closed
      if (!isOpen) item.classList.add('open');
    });
  });


  /* ── FAQ TABS ── */
  document.querySelectorAll('.faq-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.faq-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.faq-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panelId = 'faq-' + tab.dataset.panel;
      const panel = document.getElementById(panelId);
      if (panel) panel.classList.add('active');
    });
  });


  /* ── SCROLL-TO-TOP BUTTON ── */
  const scrollTopBtn = document.getElementById('scrollTop');

  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* ── ACTIVE NAV LINK ON SCROLL ── */
  const navSections = document.querySelectorAll('section[id]');
  const navLinks    = document.querySelectorAll('.nav-links > li > a[href^="#"]');

  const onScroll = () => {
    let current = '';
    navSections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });


  /* ── CONTACT FORM SUBMIT ── */
  const submitBtn = document.querySelector('.submit-btn');
  if (submitBtn) {
    submitBtn.addEventListener('click', async () => {
      const firstName = document.querySelector('input[placeholder="John"]').value.trim();
      const lastName = document.querySelector('input[placeholder="Smith"]').value.trim();
      const phoneInput = document.querySelector('input[type="tel"]');
      const phone = phoneInput.value.trim();
      const email = document.querySelector('input[type="email"]').value.trim();
      const service = document.querySelector('#service').value;
      const message = document.querySelector('textarea').value.trim();

      if (!firstName || !lastName || !phone) {
        alert('Please fill in your name and phone number so we can reach you.');
        return;
      }

      // Show loading state
      submitBtn.textContent = '⏳ Sending...';
      submitBtn.style.background = 'var(--text-dim)';
      submitBtn.disabled = true;

      try {
        const response = await fetch('send-clicksend.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName,
            lastName,
            phone,
            email,
            service,
            message
          })
        });

        const result = await response.json();

        if (result.success) {
          submitBtn.textContent = '✅ Message Sent!';
          submitBtn.style.background = 'var(--green)';
          
          setTimeout(() => {
            submitBtn.textContent = '📨 SEND MESSAGE';
            submitBtn.style.background = '';
            submitBtn.disabled = false;
            // Reset form fields
            document.querySelectorAll('.contact-form input, .contact-form select, .contact-form textarea')
              .forEach(el => { el.value = ''; });
          }, 3500);
        } else {
          throw new Error(result.message || 'Failed to send message');
        }
      } catch (error) {
        submitBtn.textContent = '❌ Send Failed';
        submitBtn.style.background = 'var(--alert)';
        
        setTimeout(() => {
          submitBtn.textContent = '📨 SEND MESSAGE';
          submitBtn.style.background = '';
          submitBtn.disabled = false;
        }, 3000);
      }
    });
  }


  /* ── SMOOTH SECTION TRANSITIONS (fade-in on scroll) ── */
  const fadeTargets = document.querySelectorAll(
    '.service-card, .res-item, .comm-card, .emerg-feature, .kb-item, .detail-block, .ci-card, .as-card'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  fadeTargets.forEach((el, i) => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.5s ease ${(i % 6) * 0.07}s, transform 0.5s ease ${(i % 6) * 0.07}s, border-color 0.28s, box-shadow 0.28s, background 0.28s`;
    observer.observe(el);
  });


  /* ── NAVBAR SHADOW ON SCROLL ── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.6)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  }, { passive: true });

});
