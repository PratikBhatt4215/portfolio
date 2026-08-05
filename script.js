/* ==========================================================================
   PRATIK KUMAR PORTFOLIO - INTERACTIVE JAVASCRIPT & GAME ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initBackgroundCanvas();
  initTypingEffect();
  init3DCardTilt();
  initCSSLab();
  initArcadeSnake();
  initContactForm();
  initNumberCounters();
});

/* --------------------------------------------------------------------------
   1. CUSTOM NEON CURSOR TRAIL
   -------------------------------------------------------------------------- */
function initCursor() {
  const cursorDot = document.getElementById('cursorDot');
  const cursorOutline = document.getElementById('cursorOutline');
  
  if (!cursorDot || !cursorOutline) return;

  let mouseX = 0, mouseY = 0;
  let outlineX = 0, outlineY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });

  function animateOutline() {
    outlineX += (mouseX - outlineX) * 0.15;
    outlineY += (mouseY - outlineY) * 0.15;
    cursorOutline.style.left = `${outlineX}px`;
    cursorOutline.style.top = `${outlineY}px`;
    requestAnimationFrame(animateOutline);
  }
  animateOutline();

  // Hover animations on interactive elements
  const hoverables = document.querySelectorAll('a, button, input, select, textarea, .service-card, .preset-btn');
  hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorOutline.style.width = '55px';
      cursorOutline.style.height = '55px';
      cursorOutline.style.borderColor = 'var(--secondary-color)';
    });
    el.addEventListener('mouseleave', () => {
      cursorOutline.style.width = '36px';
      cursorOutline.style.height = '36px';
      cursorOutline.style.borderColor = 'var(--primary-color)';
    });
  });
}

/* --------------------------------------------------------------------------
   2. DYNAMIC PARTICLE BACKGROUND CANVAS
   -------------------------------------------------------------------------- */
function initBackgroundCanvas() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(80, Math.floor(width / 15));

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 2 + 1,
      alpha: Math.random() * 0.5 + 0.2
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      let p = particles[i];
      p.x += p.vx * window.particleSpeedMultiplier;
      p.y += p.vy * window.particleSpeedMultiplier;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${window.currentHue || 280}, 100%, 65%, ${p.alpha})`;
      ctx.fill();

      // Connect near particles
      for (let j = i + 1; j < particles.length; j++) {
        let p2 = particles[j];
        let dist = Math.hypot(p.x - p2.x, p.y - p2.y);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `hsla(${window.currentHue || 280}, 100%, 65%, ${0.15 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  window.particleSpeedMultiplier = 1;
  window.currentHue = 280;
  draw();
}

/* --------------------------------------------------------------------------
   3. TYPING EFFECT IN HERO SECTION
   -------------------------------------------------------------------------- */
function initTypingEffect() {
  const target = document.getElementById('typingText');
  if (!target) return;

  const roles = [
    "Software Engineer",
    "Crazy CSS Developer",
    "E-Commerce Architect",
    "Full-Stack Specialist",
    "Mobile & Web Builder"
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function type() {
    const currentRole = roles[roleIdx];
    
    if (isDeleting) {
      target.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
    } else {
      target.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
    }

    let typeSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && charIdx === currentRole.length) {
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
  }
  type();
}

/* --------------------------------------------------------------------------
   4. 3D CARD TILT PARALLAX
   -------------------------------------------------------------------------- */
function init3DCardTilt() {
  const card = document.getElementById('profileCard');
  if (!card) return;

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = (y / rect.height) * -20;
    const rotY = (x / rect.width) * 20;

    card.querySelector('.glass-card-inner').style.transform = 
      `rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  card.addEventListener('mouseleave', () => {
    card.querySelector('.glass-card-inner').style.transform = 
      'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
}

/* --------------------------------------------------------------------------
   5. CRAZY CSS LAB INTERACTIVE CONTROLS
   -------------------------------------------------------------------------- */
function initCSSLab() {
  const hueSlider = document.getElementById('hueSlider');
  const speedSlider = document.getElementById('speedSlider');
  const blurSlider = document.getElementById('blurSlider');
  const hueVal = document.getElementById('hueVal');
  const speedVal = document.getElementById('speedVal');
  const blurVal = document.getElementById('blurVal');
  const previewCard = document.getElementById('cssPreviewCard');
  const presetBtns = document.querySelectorAll('.preset-btn');
  const pulseBtn = document.getElementById('triggerPulse');

  if (hueSlider) {
    hueSlider.addEventListener('input', (e) => {
      const val = e.target.value;
      window.currentHue = val;
      hueVal.textContent = `${val}°`;
      document.documentElement.style.setProperty('--primary-hue', val);
    });
  }

  if (speedSlider) {
    speedSlider.addEventListener('input', (e) => {
      const val = (e.target.value / 10).toFixed(1);
      window.particleSpeedMultiplier = parseFloat(val);
      speedVal.textContent = `${val}x`;
    });
  }

  if (blurSlider) {
    blurSlider.addEventListener('input', (e) => {
      const val = `${e.target.value}px`;
      blurVal.textContent = val;
      document.documentElement.style.setProperty('--blur-val', val);
    });
  }

  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const theme = btn.dataset.theme;
      let targetHue = 280;
      if (theme === 'matrix') targetHue = 130;
      if (theme === 'sunset') targetHue = 20;
      if (theme === 'neon') targetHue = 320;
      if (theme === 'cyber') targetHue = 280;

      hueSlider.value = targetHue;
      window.currentHue = targetHue;
      hueVal.textContent = `${targetHue}°`;
      document.documentElement.style.setProperty('--primary-hue', targetHue);
    });
  });

  if (pulseBtn && previewCard) {
    pulseBtn.addEventListener('click', () => {
      previewCard.style.transform = 'scale(0.95)';
      setTimeout(() => {
        previewCard.style.transform = 'scale(1.05)';
        previewCard.style.boxShadow = '0 0 80px var(--primary-color)';
      }, 100);
      setTimeout(() => {
        previewCard.style.transform = 'scale(1)';
        previewCard.style.boxShadow = 'none';
      }, 400);
    });
  }
}

/* --------------------------------------------------------------------------
   6. ARCADE CYBER SNAKE GAME
   -------------------------------------------------------------------------- */
function initArcadeSnake() {
  const canvas = document.getElementById('gameCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const overlay = document.getElementById('gameOverlay');
  const startBtn = document.getElementById('startGameBtn');
  const currentScoreEl = document.getElementById('currentScore');
  const highScoreEl = document.getElementById('highScore');
  const overlayTitle = document.getElementById('overlayTitle');
  const overlayDesc = document.getElementById('overlayDesc');

  const gridSize = 20;
  const tileCount = canvas.width / gridSize;

  let snake = [];
  let food = { x: 10, y: 10 };
  let dx = gridSize, dy = 0;
  let score = 0;
  let highScore = localStorage.getItem('pratik_snake_highscore') || 0;
  let gameInterval = null;
  let isRunning = false;

  highScoreEl.textContent = highScore;

  function resetGame() {
    snake = [
      { x: 5 * gridSize, y: 10 * gridSize },
      { x: 4 * gridSize, y: 10 * gridSize },
      { x: 3 * gridSize, y: 10 * gridSize }
    ];
    dx = gridSize;
    dy = 0;
    score = 0;
    currentScoreEl.textContent = score;
    spawnFood();
  }

  function spawnFood() {
    food = {
      x: Math.floor(Math.random() * tileCount) * gridSize,
      y: Math.floor(Math.random() * tileCount) * gridSize
    };
  }

  function gameLoop() {
    // Move snake
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Wall collision wrap
    if (head.x < 0) head.x = canvas.width - gridSize;
    if (head.x >= canvas.width) head.x = 0;
    if (head.y < 0) head.y = canvas.height - gridSize;
    if (head.y >= canvas.height) head.y = 0;

    // Self collision check
    for (let segment of snake) {
      if (head.x === segment.x && head.y === segment.y) {
        gameOver();
        return;
      }
    }

    snake.unshift(head);

    // Food collision check
    if (head.x === food.x && head.y === food.y) {
      score += 10;
      currentScoreEl.textContent = score;
      if (score > highScore) {
        highScore = score;
        highScoreEl.textContent = highScore;
        localStorage.setItem('pratik_snake_highscore', highScore);
      }
      spawnFood();
    } else {
      snake.pop();
    }

    draw();
  }

  function draw() {
    // Clear background
    ctx.fillStyle = '#03050c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Grid Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    for (let i = 0; i < canvas.width; i += gridSize) {
      ctx.beginPath();
      ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
    }

    // Draw Food Orb
    ctx.fillStyle = '#00f0ff';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00f0ff';
    ctx.beginPath();
    ctx.arc(food.x + gridSize / 2, food.y + gridSize / 2, gridSize / 2 - 2, 0, Math.PI * 2);
    ctx.fill();

    // Draw Snake
    snake.forEach((part, index) => {
      ctx.fillStyle = index === 0 ? 'var(--primary-color)' : 'rgba(168, 85, 247, 0.8)';
      ctx.shadowBlur = index === 0 ? 15 : 5;
      ctx.shadowColor = 'var(--primary-color)';
      ctx.fillRect(part.x + 1, part.y + 1, gridSize - 2, gridSize - 2);
    });
    ctx.shadowBlur = 0;
  }

  function startGame() {
    resetGame();
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
    isRunning = true;
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 100);
  }

  function gameOver() {
    clearInterval(gameInterval);
    isRunning = false;
    overlayTitle.textContent = 'GAME OVER';
    overlayDesc.textContent = `Final Score: ${score}`;
    startBtn.textContent = 'Play Again';
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'all';
  }

  startBtn.addEventListener('click', startGame);

  // Key controls
  window.addEventListener('keydown', (e) => {
    if (!isRunning) return;
    if ((e.key === 'ArrowUp' || e.key === 'w') && dy === 0) { dx = 0; dy = -gridSize; }
    if ((e.key === 'ArrowDown' || e.key === 's') && dy === 0) { dx = 0; dy = gridSize; }
    if ((e.key === 'ArrowLeft' || e.key === 'a') && dx === 0) { dx = -gridSize; dy = 0; }
    if ((e.key === 'ArrowRight' || e.key === 'd') && dx === 0) { dx = gridSize; dy = 0; }
  });

  // Mobile buttons
  document.getElementById('btnUp')?.addEventListener('click', () => { if (dy === 0) { dx = 0; dy = -gridSize; } });
  document.getElementById('btnDown')?.addEventListener('click', () => { if (dy === 0) { dx = 0; dy = gridSize; } });
  document.getElementById('btnLeft')?.addEventListener('click', () => { if (dx === 0) { dx = -gridSize; dy = 0; } });
  document.getElementById('btnRight')?.addEventListener('click', () => { if (dx === 0) { dx = gridSize; dy = 0; } });
}

/* --------------------------------------------------------------------------
   7. CONTACT FORM WITH GOOGLE SHEETS INTEGRATION & SCRIPT SETUP
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const responseDiv = document.getElementById('formResponse');
  const submitBtn = document.getElementById('submitBtn');
  const btnText = document.getElementById('btnText');

  if (!form) return;

  // IMPORTANT: User replaces this placeholder URL with their deployed Apps Script Web App URL
  const GOOGLE_SCRIPT_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbwvdNaPIC_rI-xGQbCYkE9bUtKY3XyyYkcNVoH0eBB2HCXYrSSLwHIDS-j1_yFnAKHy/exec";

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    btnText.textContent = "Sending Inquiry...";
    submitBtn.disabled = true;

    const formData = new FormData(form);
    const data = {
      timestamp: new Date().toLocaleString(),
      name: formData.get('name'),
      email: formData.get('email'),
      projectType: formData.get('projectType'),
      message: formData.get('message')
    };

    try {
      // Send data to Google Apps Script / Google Sheets
      if (GOOGLE_SCRIPT_WEBAPP_URL.includes("PLACEHOLDER")) {
        // Fallback demo simulation if Google Script URL not yet replaced
        await new Promise(resolve => setTimeout(resolve, 1200));
        responseDiv.className = 'form-response success';
        responseDiv.innerHTML = `<strong><i class="fa-solid fa-check-circle"></i> Message Sent Successfully!</strong><br>Thank you ${data.name}. Your inquiry has been submitted! (Note: Replace your Apps Script Web App URL in script.js for production sheet logging).`;
      } else {
        await fetch(GOOGLE_SCRIPT_WEBAPP_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        responseDiv.className = 'form-response success';
        responseDiv.innerHTML = `<strong><i class="fa-solid fa-check-circle"></i> Message Sent & Logged to Google Sheet!</strong><br>Thank you ${data.name}, I will respond shortly!`;
      }
      form.reset();
    } catch (err) {
      responseDiv.className = 'form-response error';
      responseDiv.innerHTML = `<strong><i class="fa-solid fa-triangle-exclamation"></i> Error sending message.</strong> Please try again directly via email.`;
    } finally {
      btnText.textContent = "Send Message & Connect";
      submitBtn.disabled = false;
    }
  });
}

/* --------------------------------------------------------------------------
   8. NUMERIC STAT COUNTER ANIMATION
   -------------------------------------------------------------------------- */
function initNumberCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.target, 10);
        let count = 0;
        const step = Math.ceil(target / 40);
        const timer = setInterval(() => {
          count += step;
          if (count >= target) {
            entry.target.textContent = target;
            clearInterval(timer);
          } else {
            entry.target.textContent = count;
          }
        }, 30);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(num => observer.observe(num));
}
