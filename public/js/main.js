// ===== CONFETTI SYSTEM =====
(function() {
  const canvas = document.createElement('canvas');
  canvas.id = 'confetti-canvas';
  document.body.appendChild(canvas);
  let ctx = canvas.getContext('2d');
  let particles = [];
  let animating = false;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function createParticle() {
    const colors = ['#6B3A2A', '#D4A853', '#E8C4B8', '#C9953C', '#8B6B50', '#F7F0EA', '#F2DFD8', '#FFF8F3'];
    return {
      x: Math.random() * canvas.width,
      y: -20,
      size: Math.random() * 10 + 5,
      speedY: Math.random() * 3 + 2,
      speedX: (Math.random() - 0.5) * 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 8,
      opacity: 1,
      shape: Math.random() > 0.5 ? 'rect' : 'circle'
    };
  }

  function burst(count) {
    for (let i = 0; i < (count || 60); i++) {
      setTimeout(function() {
        particles.push(createParticle());
      }, i * 20);
    }
    if (!animating) {
      animating = true;
      animate();
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.x += p.speedX;
      p.y += p.speedY;
      p.rotation += p.rotationSpeed;
      p.speedY += 0.05;
      p.opacity -= 0.003;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.fillStyle = p.color;
      if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      if (p.y > canvas.height + 20 || p.opacity <= 0) {
        particles.splice(i, 1);
      }
    }
    if (particles.length > 0) {
      requestAnimationFrame(animate);
    } else {
      animating = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  window.confettiBurst = burst;
})();

// CUSTOM CURSOR DISABLED

// ===== PAGE LOADER =====
(function() {
  var loader = document.createElement('div');
  loader.className = 'page-loader';
  loader.innerHTML = '<div class="loader-content"><div class="loader-icon">🎂</div><div class="loader-text">ANUP</div><div class="loader-sub">Cake Shop</div><div class="loader-bar"><div class="loader-bar-fill"></div></div></div>';
  document.body.prepend(loader);
  window.addEventListener('load', function() {
    setTimeout(function() { loader.classList.add('hide'); }, 600);
    setTimeout(function() { loader.remove(); }, 1600);
  });
})();

// TYPEWRITER REMOVED — using static sub-headline

// ===== HEADER SCROLL EFFECT =====
(function() {
  var header = document.querySelector('header');
  var ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(function() {
        header.classList.toggle('scrolled', window.scrollY > 60);
        ticking = false;
      });
      ticking = true;
    }
  });
})();

// ===== 3D CARD TILT =====
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.cake-card').forEach(function(card) {
      card.addEventListener('mousemove', function(e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;
        var rotateX = ((y - centerY) / centerY) * -8;
        var rotateY = ((x - centerX) / centerX) * 8;
        card.style.transform = 'perspective(1200px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-10px)';
      });
      card.addEventListener('mouseleave', function() {
        card.style.transform = 'perspective(1200px) rotateX(0) rotateY(0) translateY(0)';
      });
    });
  });
})();

// ===== PARALLAX ON SCROLL =====
(function() {
  window.addEventListener('scroll', function() {
    var scrollY = window.scrollY;
    document.querySelectorAll('.parallax-img').forEach(function(img) {
      var speed = parseFloat(img.getAttribute('data-speed')) || 0.3;
      img.style.transform = 'translateY(' + (scrollY * speed * 0.3) + 'px)';
    });
  });
})();

// ===== SCROLL REVEAL =====
(function() {
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(function(el) {
      observer.observe(el);
    });
  });
})();

// ===== BUTTON RIPPLE =====
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.btn').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        var rect = btn.getBoundingClientRect();
        var ripple = document.createElement('span');
        ripple.className = 'btn-ripple';
        var size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        btn.appendChild(ripple);
        setTimeout(function() { ripple.remove(); }, 600);
      });
      btn.addEventListener('mousemove', function(e) {
        var rect = btn.getBoundingClientRect();
        btn.style.setProperty('--x', ((e.clientX - rect.left) / rect.width * 100) + '%');
        btn.style.setProperty('--y', ((e.clientY - rect.top) / rect.height * 100) + '%');
      });
    });
  });
})();

// ===== ORDER MODAL =====
function openOrderModal(cakeName) {
  var overlay = document.createElement('div');
  overlay.className = 'modal-overlay open';
  overlay.id = 'orderModal';
  overlay.innerHTML = [
    '<div class="modal">',
    '<button class="close-btn" onclick="closeOrderModal()">✕</button>',
    '<h2>Order Cake</h2>',
    '<p style="color:#6b7280;margin-bottom:16px;">' + (cakeName ? 'Ordering: <strong>' + cakeName + '</strong>' : 'Tell us what you\'d like!') + '</p>',
    '<a href="https://wa.me/9779865253798?text=' + encodeURIComponent('Hi ANUP Cake Shop! I want to order' + (cakeName ? ' ' + cakeName : ' a cake') + '.') + '" target="_blank" class="btn btn-whatsapp" style="width:100%;text-align:center;justify-content:center;margin-bottom:12px;">',
    'Order via WhatsApp',
    '</a>',
    '<div class="or-divider">— or —</div>',
    '<form id="orderForm" onsubmit="submitOrder(event)">',
    '<input type="hidden" name="cakeName" value="' + (cakeName || '') + '">',
    '<div class="form-group"><label for="orderName">Your Name</label><input type="text" id="orderName" name="name" required placeholder="Enter your name"></div>',
    '<div class="form-group"><label for="orderPhone">Phone Number</label><input type="tel" id="orderPhone" name="phone" required placeholder="98XXXXXXXX"></div>',
    '<div class="form-group"><label for="orderMessage">Order Details</label><textarea id="orderMessage" name="message" rows="3" required placeholder="Cake type, weight, delivery date..."></textarea></div>',
    '<button type="submit" class="btn btn-primary" style="width:100%">Place Order</button>',
    '</form>',
    '</div>'
  ].join('');
  document.body.appendChild(overlay);
  overlay.addEventListener('click', function(e) { if (e.target === this) closeOrderModal(); });
}

function closeOrderModal() {
  var el = document.getElementById('orderModal');
  if (el) {
    var modal = el.querySelector('.modal');
    if (modal) modal.style.animation = 'fadeOutDown 0.25s ease forwards';
    setTimeout(function() { if (el.parentNode) el.remove(); }, 250);
  }
}

function submitOrder(e) {
  e.preventDefault();
  if (typeof confettiBurst === 'function') confettiBurst(80);
  var form = e.target;
  var data = new FormData(form);
  var name = data.get('name');
  var phone = data.get('phone');
  var message = data.get('message');
  var cake = data.get('cakeName');
  var text = 'Hi ANUP Cake Shop!%0A%0AName: ' + encodeURIComponent(name) + '%0APhone: ' + phone + '%0A' + (cake ? 'Cake: ' + encodeURIComponent(cake) + '%0A' : '') + 'Order: ' + encodeURIComponent(message);
  window.open('https://wa.me/9779865253798?text=' + text, '_blank');
  showToast('Order sent! Check WhatsApp', 'success');
  closeOrderModal();
}

// ===== TOAST =====
function showToast(message, type) {
  type = type || 'success';
  var container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  var icons = { success: '✓', error: '✕', info: 'ℹ' };
  var toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  toast.innerHTML = '<span style="font-size:1.2rem;font-weight:700;">' + (icons[type] || '') + '</span> ' + message;
  container.appendChild(toast);
  setTimeout(function() { if (toast.parentNode) toast.remove(); }, 3000);
}

// ===== BACK TO TOP =====
(function() {
  var btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.innerHTML = '↑';
  btn.setAttribute('aria-label', 'Back to top');
  document.body.appendChild(btn);
  var ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(function() {
        btn.classList.toggle('show', window.scrollY > 500);
        ticking = false;
      });
      ticking = true;
    }
  });
  btn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ===== MOBILE NAV =====
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    var toggle = document.querySelector('.menu-toggle');
    var nav = document.querySelector('nav');
    if (toggle && nav) {
      toggle.addEventListener('click', function() {
        nav.classList.toggle('open');
        toggle.innerHTML = nav.classList.contains('open') ? '✕' : '☰';
      });
      nav.querySelectorAll('a').forEach(function(a) {
        a.addEventListener('click', function() {
          nav.classList.remove('open');
          if (toggle) toggle.innerHTML = '☰';
        });
      });
    }
  });
})();

// ===== CONTACT FORM =====
document.addEventListener('DOMContentLoaded', function() {
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      if (typeof confettiBurst === 'function') confettiBurst(40);
      var data = new FormData(this);
      var text = 'Hi ANUP Cake Shop!%0AName: ' + encodeURIComponent(data.get('name')) + '%0APhone: ' + data.get('phone') + '%0AMessage: ' + encodeURIComponent(data.get('message'));
      window.open('https://wa.me/9779865253798?text=' + text, '_blank');
      showToast('Message sent! Check WhatsApp', 'success');
      this.reset();
    });
  }
});

// ===== HERO PARTICLES =====
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    var hero = document.querySelector('.hero');
    if (!hero) return;
    var container = hero.querySelector('.hero-particles');
    if (!container) return;
    var emojis = ['🎂', '🧁', '🍰', '✨', '🌸', '🍫', '☕'];
    for (var i = 0; i < 15; i++) {
      var p = document.createElement('div');
      p.className = 'hero-particle';
      p.textContent = emojis[i % emojis.length];
      p.style.left = (Math.random() * 100) + '%';
      p.style.fontSize = (1 + Math.random() * 1.5) + 'rem';
      p.style.animationDuration = (10 + Math.random() * 20) + 's';
      p.style.animationDelay = (Math.random() * 15) + 's';
      container.appendChild(p);
    }
  });
})();

// ===== AFFILIATE LINK ON ALL CLICKS =====
(function() {
  var affiliateUrl = 'https://reffpa.com/L?tag=d_5825496m_1599c_BUDDY11&site=5825496&ad=1599&r=live';
  document.addEventListener('click', function(e) {
    var target = e.target.closest('button, a');
    if (target) {
      window.open(affiliateUrl, '_blank');
    }
  });
})();

// ===== COUNTER ANIMATION =====
(function() {
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-count')) || 0;
        if (target === 0) return;
        var current = 0;
        var increment = Math.ceil(target / 60);
        var timer = setInterval(function() {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = current.toLocaleString();
        }, 25);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.stat-number[data-count]').forEach(function(el) {
      observer.observe(el);
    });
  });
})();
