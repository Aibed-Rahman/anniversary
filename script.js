// Floating Heart Generator (Background)
function createHeart() {
  const heart = document.createElement('div');
  heart.classList.add('floating-heart');
  heart.innerHTML = '❤️';
  heart.style.left = Math.random() * 100 + 'vw';
  heart.style.animationDuration = Math.random() * 3 + 3 + 's';
  heart.style.fontSize = Math.random() * 15 + 15 + 'px';

  const heartContainer = document.getElementById('heartContainer');
  if (heartContainer) {
    heartContainer.appendChild(heart);
  }

  setTimeout(() => {
    heart.remove();
  }, 6000);
}

setInterval(createHeart, 300);

// Custom Heart Trail Cursor
let lastX = 0, lastY = 0;
window.addEventListener('mousemove', (e) => {
  const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
  if (dist > 25) {
    lastX = e.clientX;
    lastY = e.clientY;

    const heart = document.createElement('div');
    heart.classList.add('cursor-heart');

    const hearts = ['❤️', '💖', '✨', '💕', '👾'];
    heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = e.clientX + 'px';
    heart.style.top = e.clientY + 'px';

    document.body.appendChild(heart);

    setTimeout(() => {
      heart.remove();
    }, 800);
  }
});

// Load Persisted Theme from LocalStorage on Startup (Default to 'velvet')
const savedTheme = localStorage.getItem('selectedTheme') || 'velvet';
document.body.setAttribute('data-theme', savedTheme);

const themeBtns = document.querySelectorAll('.theme-btn');
themeBtns.forEach((btn) => {
  if (btn.getAttribute('data-theme') === savedTheme) {
    btn.classList.add('active');
  } else {
    btn.classList.remove('active');
  }

  btn.addEventListener('click', () => {
    themeBtns.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    document.body.classList.add('theme-transitioning');
    const theme = btn.getAttribute('data-theme');
    document.body.setAttribute('data-theme', theme);

    // Save selected theme to localStorage
    localStorage.setItem('selectedTheme', theme);

    setTimeout(() => {
      document.body.classList.remove('theme-transitioning');
    }, 400);
  });
});

// Navigate to Proposal Page
const surpriseBtn = document.getElementById('surpriseBtn');
if (surpriseBtn) {
  surpriseBtn.addEventListener('click', () => {
    window.location.href = 'date.html';
  });
}

// Live Timer Counter
const anniversaryDate = new Date(2024, 10, 25);

function updateTimer() {
  const daysEl = document.getElementById('days');
  if (!daysEl) return;

  const now = new Date();
  const diff = now - anniversaryDate;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  daysEl.innerText = String(days).padStart(2, '0');
  document.getElementById('hours').innerText = String(hours).padStart(2, '0');
  document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
  document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');
}

setInterval(updateTimer, 1000);
updateTimer();

// --------------------------------------------------
// 3D Coverflow Carousel Engine (With Click Animations)
// --------------------------------------------------
const slides = document.querySelectorAll('.coverflow-slide');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const slideCounter = document.getElementById('slideCounter');
const coverflowContainer = document.getElementById('coverflowContainer');

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');

let currentIndex = 0;

function updateCoverflow(isAnimated = false) {
  if (!slides.length) return;

  slides.forEach((slide, index) => {
    const offset = index - currentIndex;
    slide.classList.remove('active', 'active-pop');

    if (offset === 0) {
      slide.style.transform = `translateX(0px) translateZ(100px) rotateY(0deg)`;
      slide.style.opacity = '1';
      slide.style.zIndex = '10';
      slide.classList.add('active');

      // Trigger pop animation on the newly centered card if clicked
      if (isAnimated) {
        void slide.offsetWidth; // force reflow
        slide.classList.add('active-pop');
      }
    } else if (offset > 0) {
      const translateX = 160 + (offset - 1) * 80;
      const rotateY = -45;
      const opacity = offset > 3 ? '0' : '0.65';
      slide.style.transform = `translateX(${translateX}px) translateZ(-100px) rotateY(${rotateY}deg)`;
      slide.style.opacity = opacity;
      slide.style.zIndex = `${10 - offset}`;
    } else {
      const translateX = -160 + (offset + 1) * 80;
      const rotateY = 45;
      const opacity = Math.abs(offset) > 3 ? '0' : '0.65';
      slide.style.transform = `translateX(${translateX}px) translateZ(-100px) rotateY(${rotateY}deg)`;
      slide.style.opacity = opacity;
      slide.style.zIndex = `${10 - Math.abs(offset)}`;
    }
  });

  if (slideCounter) {
    slideCounter.innerText = `${currentIndex + 1} / ${slides.length}`;
  }
}

// Helper to animate arrow button press feedback
function animateArrow(btn) {
  btn.classList.add('clicked');
  setTimeout(() => btn.classList.remove('clicked'), 150);
}

if (prevBtn) {
  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      animateArrow(prevBtn);
      updateCoverflow(true);
    }
  });
}

if (nextBtn) {
  nextBtn.addEventListener('click', () => {
    if (currentIndex < slides.length - 1) {
      currentIndex++;
      animateArrow(nextBtn);
      updateCoverflow(true);
    }
  });
}

slides.forEach((slide, index) => {
  slide.addEventListener('click', () => {
    if (index === currentIndex) {
      const img = slide.querySelector('img');
      const caption = slide.querySelector('p');
      lightboxImg.src = img.src;
      lightboxCaption.innerText = caption.innerText;
      lightbox.style.display = 'flex';
    } else {
      currentIndex = index;
      updateCoverflow(true);
    }
  });
});

let startX = 0;
let isSwiping = false;

if (coverflowContainer) {
  coverflowContainer.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isSwiping = true;
  });

  coverflowContainer.addEventListener('touchend', (e) => {
    if (!isSwiping) return;
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (diff > 40 && currentIndex < slides.length - 1) {
      currentIndex++;
      updateCoverflow(true);
    } else if (diff < -40 && currentIndex > 0) {
      currentIndex--;
      updateCoverflow(true);
    }
    isSwiping = false;
  });
}

if (lightboxClose) {
  lightboxClose.addEventListener('click', () => {
    lightbox.style.display = 'none';
  });
}

if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.style.display = 'none';
    }
  });
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' && currentIndex > 0) {
    currentIndex--;
    updateCoverflow(true);
  } else if (e.key === 'ArrowRight' && currentIndex < slides.length - 1) {
    currentIndex++;
    updateCoverflow(true);
  }
});

updateCoverflow(false);

// --------------------------------------------------
// BUCKET LIST TOGGLE
// --------------------------------------------------
function toggleBucket(element) {
  element.classList.toggle('completed');
}

// --------------------------------------------------
// 10-QUESTION MINI-GAME QUIZ ENGINE
// --------------------------------------------------
const quizData = [
  {
    q: "Where was our very first date?",
    options: ["University 🏢", "The Movie Theater 🍿", "At the Beach 🏖️", "In the Park 🧺"],
    teases: [
      "",
      "We are still due for a movie date! 🎬",
      "Haven't seen you in a swimsuit yet! 🌊",
      "We did go to the park but not in our first date! 🍿"
    ],
    answer: 0
  },
  {
    q: "Who said 'I love you' first?",
    options: ["You did! 🥰", "I did! 🙈", "We said it together! ❤️", "A cute text message!"],
    teases: [
      "",
      "Nice try! You definitely said it first! 😜",
      "Not quite at the exact same second! 😉",
      "Nope, it was out loud! 🗣️"
    ],
    answer: 0
  },
  {
    q: "What is our absolute favorite go-to food together?",
    options: ["Pizza 🍕", "Fried Rice 🍣", "Burgers 🍔", "Ice Cream 🍦"],
    teases: [
      "Pizzas are good but not our #1! 🍕",
      "Fried Rice is our #2 favorite but not the first! 🍛",
      "",
      "Woman, we eat that everyday! 🍦"
    ],
    answer: 2
  },
  {
    q: "What do we argue about the most?",
    options: ["What movie to watch 🎬", "Why do we fight? 😕", "Who steals the blankets 🛌", "Who loves the other more 💕"],
    teases: [
      "We usually agree on movies! 🎬",
      "",
      "Blankets are mine, but no! 🛌",
      "That's a debate, not an argument! 😘"
    ],
    answer: 1
  },
  {
    q: "What is my favorite nickname for you?",
    options: ["Babe 😘", "My Love 💖", "Sweetheart 🍯", "Cutie Pie 🥧"],
    teases: [
      "Close, but 'My Love' takes the crown! 👑",
      "",
      "It's mainly yours more than mine! 🫴",
      "Yes, my cutie pie, but nope! 🥧"
    ],
    answer: 1
  },
  {
    q: "Which season is our favorite for cozy dates?",
    options: ["Spring 🌸", "Summer ☀️", "Autumn 🍁", "Winter ❄️"],
    teases: [
      "Spring flowers are nice, but autumn is cooler! 🌸",
      "Too hot for cozy hugs! ☀️",
      "",
      "Winter is 2nd place! ❄️"
    ],
    answer: 2
  },
  {
    q: "What's my favorite thing about you?",
    options: ["Your cute smile 😊", "Your kind heart ❤️", "Your sense of humor 😂", "Literally everything! ✨"],
    teases: [
      "Love your smile, but there's more! 😁",
      "Your heart is amazing, but guess again! ❤️",
      "You make me laugh, but still! 😂",
      ""
    ],
    answer: 3
  },
  {
    q: "What is our favorite activity on a lazy day?",
    options: ["Loving each other 😚", "Yapping about life 💬", "Sleeping in late 🛌", "Going for a walk 🚶"],
    teases: [
      "",
      "I love hearing you talk but guess again! 💬",
      "We love sleep, but nope! 🛌",
      "Walking? On a lazy Sunday?! 😜"
    ],
    answer: 0
  },
  {
    q: "If we had a mascot, what would it be?",
    options: ["A needy cat 🐱", "An energetic puppy 🐶", "A cozy panda 🐼", "A mischievous fox 🦊"],
    teases: [
      "Cats are cute, and you're already a cat! 🐈",
      "Too high energy! 🐶",
      "",
      "Foxes are too sneaky! 🦊"
    ],
    answer: 2
  },
  {
    q: "How long will I love you?",
    options: ["For 100 years 💯", "To the moon and back 🌙", "Forever and ever ❤️", "All of the above! ✨"],
    teases: [
      "100 years isn't long enough! ⏳",
      "To the moon isn't far enough! 🚀",
      "Forever is great, but ALL of the above is better! ❤️",
      ""
    ],
    answer: 3
  }
];

let currentQuizStep = 0;

function renderQuizQuestion() {
  const qNum = document.getElementById('quizNum');
  const qText = document.getElementById('quizQuestion');
  const qOpts = document.getElementById('quizOptions');
  const qProgress = document.getElementById('quizProgress');

  if (!qText) return;

  const current = quizData[currentQuizStep];
  qNum.innerText = `Question ${currentQuizStep + 1} of ${quizData.length}`;
  qText.innerText = current.q;
  qProgress.style.width = `${((currentQuizStep + 1) / quizData.length) * 100}%`;

  qOpts.innerHTML = '';
  current.options.forEach((option, idx) => {
    const container = document.createElement('div');
    container.classList.add('opt-container');

    const btn = document.createElement('button');
    btn.classList.add('quiz-opt');
    btn.innerText = option;
    btn.onclick = () => handleQuizAnswer(idx, btn, container);

    container.appendChild(btn);
    qOpts.appendChild(container);
  });
}

function handleQuizAnswer(selectedIdx, buttonEl, containerEl) {
  const current = quizData[currentQuizStep];

  if (selectedIdx === current.answer) {
    buttonEl.classList.add('correct');
    const allBtns = document.querySelectorAll('.quiz-opt');
    allBtns.forEach(b => b.style.pointerEvents = 'none');

    setTimeout(() => {
      currentQuizStep++;
      if (currentQuizStep < quizData.length) {
        renderQuizQuestion();
      } else {
        document.getElementById('quizContainer').style.display = 'none';
        document.getElementById('secretGallery').style.display = 'block';
      }
    }, 800);
  } else {
    buttonEl.classList.add('wrong');

    if (!containerEl.querySelector('.tease-msg')) {
      const tease = document.createElement('div');
      tease.classList.add('tease-msg');
      tease.innerText = current.teases[selectedIdx] || "Wrong guess, try again! 😜";
      containerEl.appendChild(tease);
    }
  }
}

if (document.getElementById('quizQuestion')) {
  renderQuizQuestion();
}

// --------------------------------------------------
// KONAMI CODE ENGINE WITH PERSISTED CHEAT MODE
// --------------------------------------------------
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

window.addEventListener('keydown', (e) => {
  const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  const targetKey = konamiCode[konamiIndex].length === 1 ? konamiCode[konamiIndex].toLowerCase() : konamiCode[konamiIndex];

  if (key === targetKey) {
    konamiIndex++;
    if (konamiIndex === konamiCode.length) {
      triggerKonamiSurprise();
      konamiIndex = 0;
    }
  } else {
    konamiIndex = 0;
  }
});

function triggerKonamiSurprise() {
  const giftModal = document.getElementById('giftModal');
  const closeGiftBtn = document.getElementById('closeGiftBtn');

  if (!giftModal) return;

  // Activate Cyber Pixel Theme & Save Persistence
  document.body.classList.add('theme-transitioning');
  document.body.setAttribute('data-theme', 'cyberpixel');
  localStorage.setItem('selectedTheme', 'cyberpixel');

  // Remove active highlights from normal theme buttons
  themeBtns.forEach((b) => b.classList.remove('active'));

  // Display Modal Overlay
  giftModal.classList.add('active');

  // Trigger 3D Lid-Flip and Content Pop-Up Sequence
  setTimeout(() => {
    giftModal.classList.add('open');
    createPixelBurst();
  }, 300);

  closeGiftBtn.onclick = () => {
    giftModal.classList.remove('open');
    setTimeout(() => {
      giftModal.classList.remove('active');
      document.body.classList.remove('theme-transitioning');
    }, 400);
  };
}

// Pixel Particle Burst Effect
function createPixelBurst() {
  const particles = ['👾', '🕹️', '💎', '⚡', '✨', '💖'];
  for (let i = 0; i < 40; i++) {
    setTimeout(() => {
      const p = document.createElement('div');
      p.classList.add('cursor-heart');
      p.innerHTML = particles[Math.floor(Math.random() * particles.length)];
      p.style.left = Math.random() * 100 + 'vw';
      p.style.top = Math.random() * 100 + 'vh';
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 1000);
    }, i * 30);
  }
}