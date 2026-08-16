/* ==========================================================================
   PARTICLES BACKGROUND SYSTEM (Neural Network Effect)
   ========================================================================== */
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

let particlesArray = [];
let mouse = {
    x: null,
    y: null,
    radius: 120
};

// Handle window resizing
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
});

// Track mouse position
window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
});

// Clear mouse coordinates when leaving screen
window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
});

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        // Bounce off edges
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        // Particle collision with mouse (push back)
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius + this.size) {
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                this.x += 3;
            }
            if (mouse.x > this.x && this.x > this.size * 10) {
                this.x -= 3;
            }
            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                this.y += 3;
            }
            if (mouse.y > this.y && this.y > this.size * 10) {
                this.y -= 3;
            }
        }

        // Move particle
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

function initParticles() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particlesArray = [];
    
    // Adjust density based on screen size
    let numberOfParticles = (canvas.width * canvas.height) / 14000;
    numberOfParticles = Math.min(numberOfParticles, 85); // Cap to preserve CPU performance

    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 1.5) + 1;
        let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
        // Subtle drift speeds
        let directionX = (Math.random() * 0.4) - 0.2;
        let directionY = (Math.random() * 0.4) - 0.2;
        
        // Deep space palette colors
        const colors = [
            'rgba(0, 242, 254, 0.4)',  // Cyan
            'rgba(79, 172, 254, 0.4)',  // Blue
            'rgba(127, 0, 255, 0.3)'    // Purple
        ];
        let color = colors[Math.floor(Math.random() * colors.length)];

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

// Connect lines between nearby particles (Neural Network structure)
function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            // Connect if close enough
            if (distance < 130) {
                opacityValue = 1 - (distance / 130);
                ctx.strokeStyle = `rgba(79, 172, 254, ${opacityValue * 0.12})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    requestAnimationFrame(animateParticles);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

// Initialize particles system
initParticles();
animateParticles();


/* ==========================================================================
   TYPEWRITER SUBTITLE EFFECT
   ========================================================================== */
const typedTextElement = document.getElementById('typed-text');
const roles = [
    'Autonomous AI Research Agents.',
    'Machine Learning & Data Models.',
    'Android Productivity Applications.',
    'Full-Stack Software Solutions.'
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeWriter() {
    if (!typedTextElement) return;
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        // Erase character
        typedTextElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50; // Deleting is faster
    } else {
        // Type character
        typedTextElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentRole.length) {
        // Pause at the end of typing
        typingSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 500; // Pause before typing next word
    }

    setTimeout(typeWriter, typingSpeed);
}

// Start Typewriter
setTimeout(typeWriter, 1000);


/* ==========================================================================
   MOBILE NAVIGATION MENU
   ========================================================================== */
const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
const navLinksContainer = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-link');

if (mobileNavToggle) {
    mobileNavToggle.addEventListener('click', () => {
        mobileNavToggle.classList.toggle('open');
        navLinksContainer.classList.toggle('open');
    });
}

// Close mobile navigation when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (mobileNavToggle) mobileNavToggle.classList.remove('open');
        if (navLinksContainer) navLinksContainer.classList.remove('open');
    });
});


/* ==========================================================================
   STICKY NAVBAR & ACTIVE NAV LINK ON SCROLL (SCROLL SPY)
   ========================================================================== */
const header = document.querySelector('.navbar');
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    // Add sticky class on scroll
    if (header) {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    // Scroll spy: highlight current section in navigation
    let currentSectionId = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120; // offset for navbar
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSectionId = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
            link.classList.add('active');
        }
    });
});


/* ==========================================================================
   SKILLS FILTER SYSTEM
   ========================================================================== */
const skillTabs = document.querySelectorAll('.skill-tab');
const skillCards = document.querySelectorAll('.skill-card');

skillTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Toggle active tab class
        skillTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const category = tab.getAttribute('data-category');

        skillCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            if (category === 'all' || cardCategory === category) {
                card.style.display = 'flex';
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            } else {
                card.style.display = 'none';
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
            }
        });
    });
});


/* ==========================================================================
   INTERSECTION OBSERVER FOR FADE-IN & SKILL PROGRESS BARS
   ========================================================================== */
// Observe skills progress bars for loading animation when viewed
const skillsSection = document.getElementById('skills');
const progressBars = document.querySelectorAll('.skill-bar-fill');

const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            progressBars.forEach(bar => {
                const targetProgress = bar.getAttribute('data-progress');
                bar.style.width = targetProgress;
            });
            skillsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

if (skillsSection) {
    skillsObserver.observe(skillsSection);
}

// Observe fade-in animations on scroll
const fadeInElements = document.querySelectorAll('.fade-in');

const scrollFadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('appear');
            scrollFadeObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

fadeInElements.forEach(element => {
    scrollFadeObserver.observe(element);
});


/* ==========================================================================
   PROJECT DETAILS MODAL SYSTEM
   ========================================================================== */
const modal = document.getElementById('project-modal');
const modalBody = document.getElementById('modal-body-content');

// Project Data Details (Matching Resume Exactly)
const projectDetails = {
    'ae-02-agent': {
        meta: '2025 • Top 3 Hackathon Winner • Claude API Backbone',
        title: 'Self-Evolving Autonomous Research Agent (AE-02) — 24-Hour Hackathon',
        tags: ['Next.js', 'React.js', 'TypeScript', 'Claude API (LLM Backbone)', 'Antigravity'],
        content: `
            <h4>Project Abstract & Hackathon Highlights</h4>
            <p>Built during an intensive 24-hour hackathon, AE-02 is a self-evolving autonomous research agent designed to perform complex research workflows end-to-end using Claude API as its LLM engine.</p>
            
            <div class="metric-highlight">
                <i class="fa-solid fa-trophy"></i>
                <span><strong>Award:</strong> Placed <strong>Top 3</strong> out of all competing teams in the hackathon.</span>
            </div>

            <h4>Core Contributions & Implementation</h4>
            <ul>
                <li><strong>Frontend Architecture:</strong> Built the full web interface using Next.js, React.js, and TypeScript, delivering a responsive real-time research dashboard.</li>
                <li><strong>LLM Backbone Integration:</strong> Connected Claude API endpoints to support multi-step autonomous research cycles and self-evolving query refinements.</li>
                <li><strong>Critical Bug Fix:</strong> Diagnosed and fixed a critical bug in the <code>runResearchApi</code> function (<code>api.ts</code>) that silently swallowed backend errors, restoring accurate real-time research results across the full pipeline.</li>
            </ul>

            <h4>GitHub Repository</h4>
            <p><a href="https://github.com/bharathnow" target="_blank" style="color:#00f2fe; text-decoration:underline;"><i class="fa-brands fa-github"></i> github.com/bharathnow</a></p>
        `
    },
    'detox-app': {
        meta: '2024 • Native Android Application',
        title: 'Detox — Screen Time Reduction Mobile Application',
        tags: ['Android Studio', 'Java', 'Android SDK', 'Mobile UI/UX'],
        content: `
            <h4>Project Abstract & Objectives</h4>
            <p>Detox is a native Android productivity application designed from scratch to help users analyze, monitor, and curb excessive smartphone usage through customizable screen-time management features.</p>
            
            <div class="metric-highlight">
                <i class="fa-solid fa-mobile-screen"></i>
                <span><strong>Key Feature:</strong> Real-time usage tracking combined with customizable per-app limits and focus-mode locks.</span>
            </div>

            <h4>Core Contributions & Implementation</h4>
            <ul>
                <li><strong>Full Native Development:</strong> Designed and implemented the complete application architecture using Android Studio, Java, and the Android SDK.</li>
                <li><strong>Usage Tracking Engine:</strong> Implemented real-time system usage tracking and per-app activity monitors.</li>
                <li><strong>Focus Mode & Locks:</strong> Built customizable per-app limits and strict focus-mode lock screens to restrict distracting applications.</li>
                <li><strong>Graphical Analytics:</strong> Developed an intuitive graphical dashboard turning raw usage data into actionable, habit-forming insights.</li>
            </ul>

            <h4>GitHub Repository</h4>
            <p><a href="https://github.com/bharathnow" target="_blank" style="color:#00f2fe; text-decoration:underline;"><i class="fa-brands fa-github"></i> github.com/bharathnow</a></p>
        `
    },
    'stock-predict': {
        meta: '2023 • AI & Supervised ML Regression',
        title: 'Stock Price Prediction Using Artificial Intelligence',
        tags: ['Python', 'Machine Learning', 'Scikit-Learn', 'Pandas', 'NumPy'],
        content: `
            <h4>Project Abstract & Objectives</h4>
            <p>Developed an artificial intelligence regression model designed to predict stock market price movements and trend trajectories using historical financial datasets.</p>
            
            <div class="metric-highlight">
                <i class="fa-solid fa-chart-line"></i>
                <span><strong>Key Result:</strong> Achieved <strong>80%–85% prediction accuracy</strong> across historical TCS and Amazon market data.</span>
            </div>

            <h4>Core Contributions & Implementation</h4>
            <ul>
                <li><strong>Financial Data Processing:</strong> Cleaned and structured historical financial market datasets from TCS and Amazon using Pandas and NumPy.</li>
                <li><strong>Feature Engineering & Normalization:</strong> Engineered technical feature inputs, normalized dataset attributes, and removed statistical outliers.</li>
                <li><strong>ML Regression Modeling:</strong> Applied supervised regression models in Scikit-Learn to evaluate price trends and cross-validate accuracy metrics.</li>
            </ul>

            <h4>GitHub Repository</h4>
            <p><a href="https://github.com/bharathnow" target="_blank" style="color:#00f2fe; text-decoration:underline;"><i class="fa-brands fa-github"></i> github.com/bharathnow</a></p>
        `
    }
};

function openProjectModal(projectId) {
    const data = projectDetails[projectId];
    if (!data || !modal || !modalBody) return;

    let tagsHtml = data.tags.map(tag => `<span>${tag}</span>`).join('');
    
    modalBody.innerHTML = `
        <div class="modal-header-meta">${data.meta}</div>
        <h3 class="modal-title">${data.title}</h3>
        <div class="modal-tags">${tagsHtml}</div>
        <div class="modal-body">${data.content}</div>
    `;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    if (modal) {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }
}

if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeProjectModal();
        }
    });
}

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
        closeProjectModal();
    }
});


/* ==========================================================================
   CONTACT FORM SUBMISSION HANDLER
   ========================================================================== */
function handleContactSubmit(event) {
    event.preventDefault();
    
    const form = document.getElementById('contact-form');
    const feedback = document.getElementById('form-feedback');
    if (!form || !feedback) return;

    const name = document.getElementById('form-name').value;

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner animate-spin"></i> Sending...';

    setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;

        feedback.className = 'form-feedback-message success';
        feedback.innerHTML = `<strong>Message Received, ${name}!</strong> Thank you for reaching out. Bharath will respond shortly.`;
        
        form.reset();

        setTimeout(() => {
            feedback.style.display = 'none';
        }, 5000);
        
    }, 1500);
}

// CSS injection for loader spin
const style = document.createElement('style');
style.innerHTML = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    .animate-spin {
        animation: spin 1s linear infinite;
        display: inline-block;
    }
`;
document.head.appendChild(style);
