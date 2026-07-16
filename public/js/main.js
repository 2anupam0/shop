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
  loader.innerHTML = '<div class="loader-content"><img src="/images/logo.png" alt="" class="logo-img"><div class="loader-text">ANUPAMA</div><div class="loader-sub">Made with Love, Shared with Joy</div><div class="loader-divider"></div></div>';
  document.body.prepend(loader);
  window.addEventListener('load', function() {
    setTimeout(function() { loader.classList.add('hide'); }, 800);
    setTimeout(function() { loader.remove(); }, 1800);
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
function openOrderModal(cakeName, cakeImage) {
  var origin = window.location.origin;
  var imgUrl = cakeImage ? origin + cakeImage : '';
  var overlay = document.createElement('div');
  overlay.className = 'modal-overlay open';
  overlay.id = 'orderModal';
  var waText = 'Hi ANUPAMA Cake Shop! I want to order' + (cakeName ? ' ' + cakeName : ' a cake') + '.';
  if (imgUrl) waText += '%0A%0A📸 Photo: ' + encodeURIComponent(imgUrl);
  overlay.innerHTML = [
    '<div class="modal">',
    '<button class="close-btn" onclick="closeOrderModal()">✕</button>',
    '<h2>Order Cake</h2>',
    '<p style="color:#6b7280;margin-bottom:16px;">' + (cakeName ? 'Ordering: <strong>' + cakeName + '</strong>' : 'Tell us what you\'d like!') + '</p>',
    '<a href="https://wa.me/9779763624678?text=' + waText + '" target="_blank" class="btn btn-whatsapp" style="width:100%;text-align:center;justify-content:center;margin-bottom:12px;">',
    '📱 Order via WhatsApp',
    '</a>',
    '<div class="or-divider">— or —</div>',
    '<form id="orderForm" onsubmit="submitOrder(event)">',
    '<input type="hidden" name="cakeName" value="' + (cakeName || '') + '">',
    '<input type="hidden" name="cakeImage" value="' + (imgUrl || '') + '">',
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
  var cakeImage = data.get('cakeImage') || '';
  var text = 'Hi ANUPAMA Cake Shop!%0A%0AName: ' + encodeURIComponent(name) + '%0APhone: ' + phone + '%0A' + (cake ? 'Cake: ' + encodeURIComponent(cake) + '%0A' : '') + 'Order: ' + encodeURIComponent(message);
  if (cakeImage) text += '%0A%0A📸 Cake Photo: ' + encodeURIComponent(cakeImage);
  window.open('https://wa.me/9779763624678?text=' + text, '_blank');
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
      var text = 'Hi ANUPAMA Cake Shop!%0AName: ' + encodeURIComponent(data.get('name')) + '%0APhone: ' + data.get('phone') + '%0AMessage: ' + encodeURIComponent(data.get('message'));
      window.open('https://wa.me/9779763624678?text=' + text, '_blank');
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

// ===== CART SYSTEM =====

var cart = JSON.parse(localStorage.getItem('cakeCart') || '[]');

function saveCart() {
  localStorage.setItem('cakeCart', JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  var count = cart.reduce(function(sum, item) { return sum + item.qty; }, 0);
  var badge = document.getElementById('cartBadge');
  if (badge) {
    badge.textContent = count;
    badge.classList.toggle('show', count > 0);
  }
}

function addToCart(id, name, price, image) {
  var existing = cart.find(function(item) { return item.id === id; });
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id: id, name: name, price: price, image: image, qty: 1 });
  }
  saveCart();
  renderCart();
  openCart();
  showToast(name + ' added to cart!', 'success');
}

function removeFromCart(id) {
  cart = cart.filter(function(item) { return item.id !== id; });
  saveCart();
  renderCart();
  if (cart.length === 0) closeCart();
}

function updateQty(id, delta) {
  var item = cart.find(function(i) { return i.id === id; });
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(id);
    return;
  }
  saveCart();
  renderCart();
}

function renderCart() {
  var container = document.getElementById('cartItems');
  var footer = document.getElementById('cartFooter');
  if (!container) return;
  if (cart.length === 0) {
    container.innerHTML = '<div class="cart-empty">Your cart is empty</div>';
    if (footer) footer.style.display = 'none';
    return;
  }
  var html = '';
  var subtotal = 0;
  cart.forEach(function(item) {
    var total = item.price * item.qty;
    subtotal += total;
    html += '<div class="cart-item">';
    html += '<img src="' + (item.image || '') + '" alt="" class="cart-item-img" onerror="this.style.display=\'none\'">';
    html += '<div class="cart-item-info">';
    html += '<h4>' + item.name + '</h4>';
    html += '<div class="cart-item-price">रू ' + Number(item.price).toLocaleString() + ' each</div>';
    html += '<div class="cart-item-qty">';
    html += '<button onclick="updateQty(' + item.id + ',-1)">−</button>';
    html += '<span>' + item.qty + '</span>';
    html += '<button onclick="updateQty(' + item.id + ',1)">+</button>';
    html += '</div></div>';
    html += '<button class="cart-item-remove" onclick="removeFromCart(' + item.id + ')">✕</button>';
    html += '</div>';
  });
  container.innerHTML = html;
  if (footer) {
    footer.style.display = 'block';
    var total = subtotal;
    document.getElementById('cartSubtotal').textContent = 'रू ' + subtotal.toLocaleString();
    document.getElementById('cartTotal').textContent = 'रू ' + total.toLocaleString();
    document.getElementById('cartSavings').textContent = 'रू 0';
  }
}

function openCart() {
  document.getElementById('cartSidebar').classList.add('open');
  document.getElementById('cartOverlay').classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cartSidebar').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('show');
  document.body.style.overflow = '';
}

function checkoutCart() {
  if (cart.length === 0) return;
  var text = 'Hi ANUPAMA Cake Shop!%0A%0A🛒 *New Order:*%0A';
  cart.forEach(function(item) {
    text += '• ' + item.name + ' x' + item.qty + ' = रू ' + (item.price * item.qty) + '%0A';
  });
  var total = cart.reduce(function(sum, item) { return sum + item.price * item.qty; }, 0);
  text += '%0A*Total: रू ' + total + '*%0A%0APlease confirm my order.';
  window.open('https://wa.me/9779763624678?text=' + encodeURIComponent(text), '_blank');
}

document.addEventListener('DOMContentLoaded', function() {
  updateCartBadge();
  renderCart();
  document.getElementById('cartToggle').addEventListener('click', function(e) {
    e.preventDefault();
    if (cart.length === 0) { showToast('Your cart is empty', 'info'); return; }
    openCart();
  });
  document.getElementById('cartClose').addEventListener('click', closeCart);
  document.getElementById('cartOverlay').addEventListener('click', closeCart);
  document.getElementById('cartCheckout').addEventListener('click', checkoutCart);
  document.querySelectorAll('.add-to-cart').forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      var id = parseInt(this.getAttribute('data-id'));
      var name = this.getAttribute('data-name');
      var price = parseFloat(this.getAttribute('data-price'));
      var image = this.getAttribute('data-image');
      addToCart(id, name, price, image);
    });
  });
});
